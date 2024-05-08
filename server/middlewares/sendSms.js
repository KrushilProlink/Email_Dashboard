import "dotenv/config";
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const sendSMS = async (req) => {
    if (req.to && accountSid && authToken && twilioPhoneNumber) {
        const client = new twilio(accountSid, authToken);
        let msgOptions = {
            from: twilioPhoneNumber,
            to: req.to,
            body: req.message || " "
        }
        try {
            const sms = await client.messages.create(msgOptions)
            console.log(`message send successfully to ${req?.to}`)
            return { message: `message send successfully to ${req?.to}`, status: 200 }
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

export default sendSMS;
