import "dotenv/config";
// import twilio from 'twilio';
import axios from 'axios';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// const sendSMS = async (req) => {
//     if (req.to && accountSid && authToken && twilioPhoneNumber) {
//         const client = new twilio(accountSid, authToken);
//         let msgOptions = {
//             from: twilioPhoneNumber,
//             to: req.to,
//             body: req.message || " "
//         }
//         try {
//             const sms = await client.messages.create(msgOptions)
//             console.log(`message send successfully to ${req?.to}`)
//             return { message: `message send successfully to ${req?.to}`, status: 200 }
//         } catch (error) {
//             console.log(error)
//             return error
//         }
//     }
// }

const sendSMS = async (req) => {
    const url = 'https://bulk.cloudrebue.co.ke/api/v1/send-sms';
    const token = process.env.CLOUDREBUE_SMS_ACCESS_TOKEN;

    const postData = {
        sender: req.senderId,
        phone: req.phone,
        message: req.message,
        link_id: null,
        // correlator: req.correlator,
    };

    try {
        const response = await axios.post(url, postData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    } catch (error) {
        console.log("--- sendSMS catch error --- ", response);
        throw error;
    }
}

export default sendSMS;
