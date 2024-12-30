import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Bus number is required'],
        unique: true,
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: [true, 'Route ID is required']
    },
    driverName: {
        type: String,
    },
    driverNumber: {
        type: String,
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required']
        }
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: [
            'running',
            'stopped',
            'maintenance'
        ],
        default: 'stopped'
    },
    direction: {
        type: String,
        enum: ['FORWARD', 'REVERSE'],
        default: 'FORWARD'
    },
})

const Bus = mongoose.model('Bus', busSchema)


export default Bus