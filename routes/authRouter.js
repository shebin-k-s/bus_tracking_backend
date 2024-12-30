import express from 'express'
import { forgetPassword, login, signupUser, resetPassword } from '../controllers/userController.js'

const router = express.Router()

router.route("/signup")
    .post(signupUser)

router.route("/signin")
    .post(login)

router.route("/forget-password")
    .post(forgetPassword)

router.route("/reset-password")
    .post(resetPassword)


export default router