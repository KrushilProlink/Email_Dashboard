import "dotenv/config";
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const sendSMS = async (req) => {
    let msgOptions = {
        from: twilioPhoneNumber,
        to: req.to,
        body: req.message || ""
    }
    try {
        const message = await client.messages.create(msgOptions)
        console.log(message)
    } catch (error) {
        console.log(error)
    }
}

export default sendSMS;
