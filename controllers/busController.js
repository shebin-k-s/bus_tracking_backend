import mongoose from "mongoose";
import Bus from "../models/busModel.js";
import Route from "../models/routeModel.js";

export const addBus = async (req, res) => {
    const { busNumber, routeId, driverName, driverNumber, currentLocation } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(routeId)) {
            return res.status(400).json({ 'message': "Invalid routeId format" });
        }
        const route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        let existingBus = await Bus.findOne({ busNumber : busNumber.toUpperCase() })

        if (existingBus) {
            return res.status(400).json({ message: "Bus already exist" })
        }

        const newBus = new Bus({
            busNumber : busNumber.toUpperCase(),
            routeId,
            driverName,
            driverNumber,
            currentLocation
        })
        await newBus.save();

        return res.status(201).json({ message: "Bus added", bus: newBus, });

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('routeId');

        const updatedBuses = buses.map(bus => {
            const route = bus.routeId;

            if (bus.direction === 'REVERSE' && route.stops) {
                const reversedStops = [...route.stops].reverse().map((stop, index, arr) => {
                    const nextStop = arr[index + 1];
                    if (nextStop) {
                        stop.distanceToNextStop = nextStop.distanceToNextStop;
                        stop.durationToNextStop = nextStop.durationToNextStop;
                    } else {
                        stop.distanceToNextStop = 0;
                        stop.durationToNextStop = 0;
                    }
                    return stop;
                });
                route.stops = reversedStops;
            }
            return { ...bus.toObject(), route };


        });


        return res.status(200).json({ buses: updatedBuses });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBusById = async (req, res) => {
    try {
        const { id } = req.params;
        const bus = await Bus.findById(id).populate('routeId');
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json({ bus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        const updatedBus = await Bus.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json({ updatedBus });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }
        res.status(400).json({ message: error.message });
    }
};


export const startBusJourney = async (req, res) => {
    const { id } = req.params;
    const { direction } = req.body;
    try {
        if (!direction && !['FORWARD', 'REVERSE'].includes(direction)) {
            return res.status(400).json({ message: "Invalid direction value" });
        }
        const startTime = Date.now();
        const status = "Running";

        const updatedBus = await Bus.findByIdAndUpdate(
            id,
            {
                startTime,
                status,
                direction
            },
            { new: true, runValidators: true }
        );
        console.log(updatedBus);


        if (!updatedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.status(200).json({ message: "Bus journey started", bus: updatedBus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
