import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    // host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});

const sendMail = async (to, subject, text) => {
    try {
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

