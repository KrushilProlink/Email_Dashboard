import sendSMS from "./sendSms.js";
import moment from "moment";

const scheduleSMS = (req) => {
    // Get current date/time
    const now = new Date();
    // Calculate milliseconds until 
    const millisUntil5PM = new Date(req?.time) - now;
    console.log(moment(req.time).format("LLL"))

    // const millisUntil5PM = new Date(
    //     now.getFullYear(),
    //     now.getMonth(),
    //     now.getDate(),
    //     15, // 5 PM
    //     45,  // 0 minutes
    //     0   // 0 seconds
    // ) - now;

    // If the time is already past, don't schedule the SMS
    if (millisUntil5PM < 0) {
        console.log(`It's already past ${req?.time}. Can't schedule the SMS for today.`);
        return `It's already past ${req?.time}. Can't schedule the SMS for today.`
    }
    // Schedule sending SMS at ${5 PM}
    setTimeout(() => {
        sendSMS(req);
    }, millisUntil5PM);
    console.log(`SMS scheduled to be sent at ${req?.time}.`);
    return `SMS scheduled to be sent at ${req?.time}.`;
}

export default scheduleSMS
