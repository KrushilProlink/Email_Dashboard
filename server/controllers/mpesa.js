import ngrok from 'ngrok';
import axios from 'axios';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
// import PaymentDetails from './models/paymentDetails';

const parseDate = (val) => {
    return (val < 10) ? "0" + val : val;
};

const getTimestamp = () => {
    const dateString = new Date().toLocaleString("en-us", { timeZone: "Africa/Nairobi" })
    const dateObject = new Date(dateString);
    const month = parseDate(dateObject.getMonth() + 1);
    const day = parseDate(dateObject.getDay());
    const hour = parseDate(dateObject.getHours());
    const minute = parseDate(dateObject.getMinutes());
    const second = parseDate(dateObject.getSeconds());
    return dateObject.getFullYear() + "" + month + "" + day + "" + hour + "" + minute + second;
};

const initiateSTKPush = async (req, res) => {
    try {
        // if (!req.body.amount || !req.body.phone || !req.body.Order_ID) {
        //     return res.status(400).send({ message: 'amount, phone, and Order_ID are required fields' });
        // }
        // const { amount, phone, Order_ID } = req.body;

        if (!req.body.amount || !req.body.phone) {
            return res.status(400).send({ message: 'amount and phone are required fields' });
        }
        const { amount, phone } = req.body;           // phone - MSISDN (12 digits Mobile Number) e.g. 2547XXXXXXXX
        const Order_ID = uuidv4();

        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = "Bearer " + req.safaricom_access_token;

        const timestamp = getTimestamp();
        const password = new Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');

        const callback_url = await ngrok.connect(process.env.PORT);
        console.log("### ${callback_url}/lipanampesa/stkPushCallback/${Order_ID} ", `${callback_url}/lipanampesa/stkPushCallback/${Order_ID}`); //  https://0907-2405-201-200c-b265-69d6-d04a-9efb-1606.ngrok-free.app/lipanampesa/stkPushCallback/1236
        console.log("Order_ID ", Order_ID);

        const api = ngrok.getApi();
        const tunnels = await api.listTunnels();
        console.log("### tunnels ", tunnels);

        await axios.post(
            url,
            {
                "BusinessShortCode": process.env.BUSINESS_SHORT_CODE,           //  to receive the transaction.
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,                                                      // will send money
                "PartyB": process.env.BUSINESS_SHORT_CODE,                            // will receive money
                "PhoneNumber": phone,                                                 // will receive the STK Pin Prompt.
                "CallBackURL": `${callback_url}/lipanampesa/stkPushCallback/${Order_ID}`,
                "AccountReference": "CompanyXLTD",          // will display to the customer in the STK Pin Prompt message, 12 characters max
                "TransactionDesc": "Payment of X"           // 13 characters max
            },
            {
                headers: {
                    "Authorization": auth
                },
            }
        ).then((response) => {
            res.send({ success: true, data: response.data });
            /*
                {
                    "MerchantRequestID": "c0d2-4b9a-a71a-12bae346ef6e1774159",
                    "CheckoutRequestID": "ws_CO_29042024142925427708374149",
                    "ResponseCode": "0",
                    "ResponseDescription": "Success. Request accepted for processing",
                    "CustomerMessage": "Success. Request accepted for processing"
                }
            */
        }).catch((error) => {
            res.status(503).send({ success: false, message: "Error with the stk push", error: error });
        });

    } catch (error) {
        res.status(503).send({ success: false, message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin", error: error });
    }
};

const stkPushCallback = async (req, res) => {
    try {
        const { Order_ID } = req.params;
        console.log("callback Order_ID ", Order_ID);
        console.log("callback req.body ", req.body);

        // Callback details
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = req.body.Body.stkCallback;

        // Get the meta data from the metadata
        const meta = Object.values(await CallbackMetadata.Item);
        const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber').Value.toString();
        const Amount = meta.find(o => o.Name === 'Amount').Value.toString();
        const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber').Value.toString();
        const TransactionDate = meta.find(o => o.Name === 'TransactionDate').Value.toString();

        // Log the data
        console.log("-".repeat(20), " OUTPUT IN THE CALLBACK ", "-".repeat(20));
        console.log(`
            Order_ID : ${Order_ID},
            MerchantRequestID : ${MerchantRequestID},
            CheckoutRequestID: ${CheckoutRequestID},
            ResultCode: ${ResultCode},
            ResultDesc: ${ResultDesc},
            PhoneNumber : ${PhoneNumber},
            Amount: ${Amount},
            MpesaReceiptNumber: ${MpesaReceiptNumber},
            TransactionDate : ${TransactionDate}
        `);

        const newPayment = new PaymentDetails({
            Order_ID: Order_ID,
            resultCode: ResultCode,
            merchantRequestId: MerchantRequestID,           // maybe who receive amount
            checkoutRequestId: CheckoutRequestID,
            resultDesc: ResultDesc,
            phoneNumber: PhoneNumber,
            amount: Amount,
            mpesaReceiptNumber: MpesaReceiptNumber,
            transactionDate: TransactionDate
        });

        const savedPayment = await newPayment.save();
        console.log("savedPayment ", savedPayment);

        res.send({ success: true });

    } catch (error) {
        res.status(503).send({ success: false, message: "Something went wrong with the callback", error: error.message });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
        const auth = "Bearer " + req.safaricom_access_token;
        const timestamp = getTimestamp();

        const password = Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');
        console.log("password: " + password);
        console.log("req.params.CheckoutRequestID: " + req.params.CheckoutRequestID);

        const response = await axios.post(
            url,
            {
                BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: req.params.CheckoutRequestID
            }, {
            headers: {
                Authorization: auth
            }
        });

        res.status(200).send({ success: true, data: response.data });

    } catch (error) {
        res.status(503).send({ success: false, message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin", error: error.toString() });
    }
};

export default { initiateSTKPush, stkPushCallback, confirmPayment };