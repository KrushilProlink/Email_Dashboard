import { Router } from 'express';
import Lead from '../controllers/leads.js'
import auth from '../middlewares/auth.js'
import { upload } from '../utils/upload.js'

const router = Router();

router.get('/list', auth, Lead.index)
router.post('/add', auth, Lead.add)
router.post('/addMany', auth, Lead.addMany)
router.post('/sms', auth, Lead.SMS)
router.put('/edit/:id', auth, Lead.edit)
router.get('/view/:id', auth, Lead.view)
router.delete('/delete/:id', auth, Lead.deleteData)
router.post('/deletemany', auth, Lead.deleteMany)


export default router