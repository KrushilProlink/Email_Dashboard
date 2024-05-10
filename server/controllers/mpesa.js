import ngrok from 'ngrok';
import axios from 'axios';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import PaymentDetails from '../model/mpesaPaymentDetails.js';
import User from '../model/User.js';

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

const index = async (req, res) => {
    const query = req.query

    const user = await User.findById(req.user.userId)
    if (user?.role !== "admin") {
        query.createdBy = req.user.userId;
    }

    let allData = await PaymentDetails.find(query).populate({
        path: 'createdBy',
    }).exec()

    let result = allData.filter(item => item.createdBy !== null);
    result = result.sort((a, b) => b.createdOn - a.createdOn);

    let totalRecords = result.length

    res.send({ result, total_recodes: totalRecords })
};

const view = async (req, res) => {
    let paymentData = await PaymentDetails.findById(req.params.id);
    res.status(200).json({ paymentData })
}

const initiateSTKPush = async (req, res) => {
    try {
        if (!req.body.amount || !req.body.phone || !req.body.accountNo) {
            return res.status(400).send({ message: 'amount, phone, accountNo are required fields' });
        }
        const { amount, phone, accountNo } = req.body;           // phone - MSISDN (12 digits Mobile Number) e.g. 2547XXXXXXXX
        const Order_ID = uuidv4();

        const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = `Bearer ${req.safaricom_access_token}`;

        const timestamp = getTimestamp();
        const password = new Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');

        const callback_url = await ngrok.connect(process.env.PORT);
        const api = ngrok.getApi();
        await api.listTunnels();

        console.log("--- Order_ID ---- ", Order_ID);
        console.log("---- callback_url ---- ", `${callback_url}/lipanampesa/stkPushCallback/${Order_ID}`);

        await axios.post(
            url,
            {
                "BusinessShortCode": process.env.BUSINESS_SHORT_CODE,          //  to receive the transaction.
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,                                               // will send money
                "PartyB": process.env.BUSINESS_SHORT_CODE,                     // will receive money
                "PhoneNumber": phone,                                          // will receive the STK Pin Prompt.
                // "CallBackURL": `${process.env.BACKEND_URL || callback_url}/lipanampesa/stkPushCallback/${Order_ID}`,
                "CallBackURL": `${callback_url}/lipanampesa/stkPushCallback/${Order_ID}`,
                "AccountReference": accountNo,                   // will display to the customer in the STK Pin Prompt message, 12 characters max         // need to change
                "TransactionDesc": "Online Payment"                // 13 characters max
            },
            {
                headers: {
                    "Authorization": auth
                },
            }
        ).then(async (response) => {

            const payment = {
                orderId: Order_ID,
                merchantRequestId: response.data.MerchantRequestID,
                checkoutRequestId: response.data.CheckoutRequestID,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription,
                customerMessage: response.data.CustomerMessage,
                senderPhoneNumber: req.body?.phone,
                amount: req.body?.amount,
                emailAddress: req.body?.emailAddress,
                firstName: req.body?.firstName,
                lastName: req.body?.lastName,
                createdBy: req.user.userId,
                accountNo: req?.body?.accountNo
            };

            if (response.data.ResponseCode === "0") {
                payment.status = 'Pending Confirmation';
            }

            const newPayment = new PaymentDetails(payment);
            await newPayment.save();
            return res.send({ success: true, data: response.data, message: response.data?.CustomerMessage });

        }).catch(async (error) => {
            console.log("--- stkPush error1 ---:: ", error);

            const newPayment = new PaymentDetails({
                errorCode: error?.response?.data?.errorCode,
                errorMessage: error?.response?.data?.errorMessage,
                orderId: Order_ID,
                amount: amount,
                senderPhoneNumber: phone,
                status: 'Failed',
                emailAddress: req.body?.emailAddress,
                firstName: req.body?.firstName,
                lastName: req.body?.lastName,
                createdBy: req.user.userId,
                accountNo: req?.body?.accountNo
            });
            await newPayment.save();

            // if (error.response && error.response.status === 400) {
            if (error.response && error.response.data && error.response.data.errorMessage) {
                const errorMessage = error.response.data.errorMessage;
                return res.status(400).send({ success: false, message: errorMessage });
            } else {
                return res.status(500).send({ success: false, message: "Error with the stk push", error: error.toString() });
            }
        });

    } catch (error) {
        console.log("--- stkPush error2 ---:: ", error);
        return res.status(500).send({ success: false, message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin", error: error.toString() });
    }
};

const stkPushCallback = async (req, res) => {
    try {
        const { Order_ID } = req.params;
        console.log("--- callback Order_ID --- ", Order_ID);
        console.log("--- callback req.body --- ", req.body);

        // Callback details
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = req.body?.Body?.stkCallback;

        // Get the meta data from the metadata
        const meta = Object.values(await CallbackMetadata.Item);
        const PhoneNumber = meta?.find(o => o.Name === 'PhoneNumber')?.Value.toString();
        const Amount = meta?.find(o => o.Name === 'Amount')?.Value.toString();
        const MpesaReceiptNumber = meta?.find(o => o.Name === 'MpesaReceiptNumber')?.Value.toString();
        const TransactionDate = meta?.find(o => o.Name === 'TransactionDate')?.Value.toString();

        // Log the data
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

        // let existingPayment = await PaymentDetails.findOne({ orderId: Order_ID });
        let existingPayment = await PaymentDetails.findOne({ checkoutRequestId: CheckoutRequestID });

        if (existingPayment) {
            existingPayment.resultCode = ResultCode;
            existingPayment.merchantRequestId = MerchantRequestID;
            existingPayment.checkoutRequestId = CheckoutRequestID;
            existingPayment.resultDesc = ResultDesc;
            existingPayment.phoneNumber = PhoneNumber;
            existingPayment.amount = Amount;
            existingPayment.mpesaReceiptNumber = MpesaReceiptNumber;
            existingPayment.transactionDate = TransactionDate;
            existingPayment.modifiedOn = new Date();

            if (ResultDesc === "The service request is processed successfully.") {
                existingPayment.status = 'Completed';
            } else {
                // existingPayment.status = ResultDesc;
                existingPayment.status = 'Failed';
            }

            await existingPayment.save();
        }

        return res.send({ success: true });

    } catch (error) {
        console.log("---- stkPushCallback catch error ---- ", error);
        return res.status(500).send({ success: false, message: "Something went wrong with the callback", error: error.toString });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const url = "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query";

        const auth = `Bearer ${req.safaricom_access_token}`;
        const timestamp = getTimestamp();

        const password = Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');

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

        return res.status(200).send({ success: true, data: response.data });

    } catch (error) {
        console.log("--- confirmPayment catch error --- ", error);

        if (error.response && error.response.data && error.response.data.errorMessage) {
            return res.status(500).send({ success: false, message: error.response.data.errorMessage });
        } else {
            return res.status(500).send({ success: false, message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin", error: error.toString() });
        }
    }
};

export default { initiateSTKPush, stkPushCallback, confirmPayment, getTimestamp, index, view };