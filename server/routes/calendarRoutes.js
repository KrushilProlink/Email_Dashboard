import { Router } from 'express';
import Calendar from '../controllers/calendar.js';
import auth from '../middlewares/auth.js'
const router = Router();

router.get('/', auth, Calendar.index)

export default router