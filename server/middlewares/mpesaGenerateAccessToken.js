import axios from 'axios';
import 'dotenv/config';

const generateAccessToken = async (req, res, next) => {
    try {
        // const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

        const auth = new Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

        await axios.get(
            url,
            {
                headers: {
                    authorization: `Basic ${auth}`
                }
            }
        ).then((response) => {
            req.safaricom_access_token = response.data.access_token;

            console.log("--- Access_token --- ", response.data.access_token);
            next();
        }).catch((error) => {
            console.log("--- Access Token generation error1 --- ", error);
            res.status(400).json({
                success: false,
                "message": 'Something went wrong when trying to process your payment',
                "error": error.message
            });
        });
    } catch (error) {
        console.log("--- Access Token generation error2 --- ", error);
        res.status(401).json({
            success: false,
            message: 'Something went wrong when trying to process your payment',
            error: error.message
        });

    }
};

export default generateAccessToken;