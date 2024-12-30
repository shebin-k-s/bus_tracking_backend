import mongoose from "mongoose";
import stopSchema from "./stopModel.js";


const routeSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: [true, 'Route number is required'],
        unique: true,
        trim: true
    },
    stops: {
        type: [stopSchema],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'A route must have at least one stop'
        }
    }
});


const Route = mongoose.model("Route", routeSchema)

export default Route;
