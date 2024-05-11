import express from "express";
const router = express.Router();

import UserRoute from "./userRoutes.js"
import EmailRoute from './EmailRoutes.js'
import emailTemmplateRoute from './emailTemplateRoutes.js'

router.use('/user', UserRoute)
router.use('/email', EmailRoute)
router.use('/emailtemplate', emailTemmplateRoute)

export default router;
