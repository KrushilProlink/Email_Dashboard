import { Router } from 'express';
import SMS from '../controllers/sms.js'
import auth from '../middlewares/auth.js';
const router = Router();

router.get('/list', auth, SMS.index)
router.post('/contact', auth, SMS.contactSMS)
router.post('/lead', auth, SMS.leadSMS)
// router.post('/add', auth, SMS.add)
// router.get('/view/:id', auth, SMS.view)
// router.delete('/delete/:id', auth, SMS.deleteData)


export default router