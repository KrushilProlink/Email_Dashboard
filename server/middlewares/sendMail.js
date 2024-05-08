import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     // host: 'sandbox.smtp.mailtrap.io',
//     port: 587,
//     auth: {
//         user: process.env.user,
//         pass: process.env.pass
//     },
//     secure: false,
//     tls: { rejectUnauthorized: false }
// });
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Office 365 requires STARTTLS, so set secure to false
    auth: {
        user: process.env.user, // Assuming your environment variables are named EMAIL_USER and EMAIL_PASS
        pass: process.env.pass
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
const sendMail = async (to, subject, text) => {
    try {
        console.log(process.env.user, process.env.pass)
        const mailOptions = {
            from: process.env.user, // Replace with your email address
            to: to, // Replace with the recipient's email address
            subject: subject,
            // text: text,
            html: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info.response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
        // res.status(500).send('Error sending email');
    }
}

export default sendMail

