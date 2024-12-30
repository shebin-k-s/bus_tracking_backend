import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'


export const signupUser = async (req, res) => {
    const { fullName, email, password } = req.body

    console.log(req.body);



    try {
        const emailDomain = "@gecskp.ac.in";
        if (!email.endsWith(emailDomain)) {
            return res.status(403).json({ message: `Only users with the domain ${emailDomain} are allowed to sign up.` });
        }

        let existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });


        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(404).json({ message: email ? "Password is required" : "Email is required" })
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email doesn't exist" })
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {

            return res.status(401).json({ message: "Incorrect Password" })
        } else {
            const token = Jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);
            return res.status(200).json({
                message: "Login Successfull",
                token: token,
                fullName: user.fullName,
                email: user.email
            })
        }


    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const secret = process.env.JWT_TOKEN + user.password;
        const payload = {
            email: user.email,
            id: user._id
        };
        const token = Jwt.sign(payload, secret, { expiresIn: '15min' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: "Where is My Bus",
            to: user.email,
            subject: 'Password Reset',
            text: `Your token for reseting password is\n ${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to send reset password email' });
            } else {
                return res.status(200).json({ message: 'Reset password email sent successfully' });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;
    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }


        const secret = process.env.JWT_TOKEN + user.password;
        try {
            const decodedToken = Jwt.verify(token, secret)
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });

    }
}