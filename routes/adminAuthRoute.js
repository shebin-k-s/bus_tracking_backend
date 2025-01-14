import express from 'express'
import { forgetPassword, login, signupAdmin, resetPassword } from '../controllers/adminController.js'

const router = express.Router()

router.route("/signup")
    .post(signupAdmin)

router.route("/signin")
    .post(login)

router.route("/forget-password")
    .post(forgetPassword)

router.route("/reset-password")
    .post(resetPassword)


export default router