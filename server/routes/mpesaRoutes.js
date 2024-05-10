import { Router } from 'express';
import accessToken from "../middlewares/mpesaGenerateAccessToken.js";
import Mpesa from '../controllers/mpesa.js';
import Auth from '../middlewares/auth.js';
const router = Router();

router.get('/list', Auth, Mpesa.index)
router.get('/view/:id', Auth, Mpesa.view)
router.post('/stkPush', Auth, accessToken, Mpesa.initiateSTKPush);
router.post('/stkPushCallback/:Order_ID', Mpesa.stkPushCallback);
router.post('/confirmPayment/:CheckoutRequestID', Auth, accessToken, Mpesa.confirmPayment);

export default router;