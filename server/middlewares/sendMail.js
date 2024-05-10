// import nodemailer from 'nodemailer'
import sendGridMail from '@sendgrid/mail'

// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     // host: 'sandbox.smtp.mailtrap.io',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.user,
//         pass: process.env.pass
//     },
//     tls: { rejectUnauthorized: false }
// });

// const sendMail = async (to, subject, message, html) => {
//     try {
//         const mailOptions = {
//             from: 'm', // Replace with your email address
//             to: to, // Replace with the recipient's email address
//             subject: subject,
//             text: message,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log('Email sent:', info.response);
//         // res.send('Email sent successfully');
//     } catch (error) {
//         console.log('Error sending email:', error);
//         // res.status(500).send('Error sending email');
//     }
// }

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, message) => {
    try {
        const mailOptions = {
            from: process.env.SENDGRID_EMAIL_FROM,
            to: to,
            subject: subject,
            html: message
        };

        const info = await sendGridMail.send(mailOptions);
        console.log('Email sent: ' + info);

        return info.response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
        // res.status(500).send('Error sending email');
    }
}

export default sendMail


//  user = hello@anzianoinsuranceagency.com
//  pass = Hello@Anziano

//  Username:	hello@anzianoinsuranceagency.com
//  Password:	Hello@Anziano
//  Incoming Server:	mail.anzianoinsuranceagency.com
//  IMAP Port: 993 POP3 Port: 995
//  Outgoing Server:	mail.anzianoinsuranceagency.com
//  SMTP Port: 465