import mongoose from "mongoose"
import validator from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true ,"Email is required"],
        unique: true,
    },
    fullName: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
})


const User = mongoose.model('User', userSchema)


export default User