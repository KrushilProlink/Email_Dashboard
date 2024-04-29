// require('dotenv').config();
// import dotenv from "dotenv";
// import { Twilio } from 'twilio';

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;

// dotenv.config();
// // const client = require('twilio')(accountSid, authToken);
// const client = Twilio(accountSid, authToken);

// const sendSMS = async (req) => {
//     let msgOptions = {
//         from: +12563056990,
//         to: req.to,
//         body: req.message || ""
//     }
//     try {
//         const message = await client.messages.create(msgOptions)
//         console.log(message)
//     } catch (error) {
//         console.log(error)
//     }
// }

// ===========================

import dotenv from "dotenv";
import { Twilio } from 'twilio';

dotenv.config();

const sendSMS = async (req) => {
    console.log('Sending')
}

export default sendSMS;




// ===========================


// import dotenv from "dotenv";
// import fetch from 'node-fetch';
// import querystring from 'querystring'; // Import querystring module

// dotenv.config();

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const fromNumber = "+12563056990";

// const sendSMS = async ({ to, message }) => {
//     const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages`;
//     const authHeader = {
//         Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
//     };

//     // Format the body as URL-encoded data
//     const body = querystring.stringify({
//         From: fromNumber,
//         To: to,
//         Body: message
//     });

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 ...authHeader,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: body
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to send SMS: ${response.statusText}`);
//         }

//         console.log("SMS sent successfully!");
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//     }
// };

// sendSMS({ to: "+917016395746", message: "Hello World" });

// export default sendSMS;