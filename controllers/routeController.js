import axios from "axios";
import Route from "../models/routeModel.js";
import Bus from "../models/busModel.js";

export const addRoute = async (req, res) => {

    console.log(req.body);


    const { routeNumber, stops } = req.body
    try {
        let existingRoute = await Route.findOne({ routeNumber: routeNumber.toUpperCase() })

        if (existingRoute) {
            return res.status(400).json({ message: "Route already exist" })
        }


        const stopsWithDistances = await Promise.all(
            stops.map(async (stop, index) => {
                if (index === stops.length - 1) {
                    return { ...stop, distanceToNextStop: 0 };
                }

                const origin = `${stop.location.coordinates[1]},${stop.location.coordinates[0]}`;
                const destination = `${stops[index + 1].location.coordinates[1]},${stops[index + 1].location.coordinates[0]}`;
                console.log(origin);
                console.log(destination);

                const { distance, duration } = await fetchDistanceWithRetry(origin, destination, 3);

                return { ...stop, distanceToNextStop: distance, durationToNextStop: duration };
            })
        );

        const route = new Route({
            routeNumber: routeNumber.toUpperCase(),
            stops: stopsWithDistances,
        });

        await route.save();
        return res.status(201).json({ message: "Bus route added", route });
    } catch (error) {
        console.log(error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(", ") });
        }
        return res.status(500).json({ message: "Internal server error" })
    }
};

const fetchDistanceWithRetry = async (origin, destination, retries = 3) => {
    let attempts = 0;

    while (attempts < retries) {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/distancematrix/json`,
                {
                    params: {
                        origins: origin,
                        destinations: destination,
                        key: process.env.GOOGLE_MAPS_API_KEY,
                    },
                }
            );
            const distance = response.data.rows[0].elements[0].distance.value;
            const duration = response.data.rows[0].elements[0].duration.value;
            return { distance, duration };
        } catch (error) {
            attempts++;
            if (attempts >= retries) {
                throw new Error(
                    `Failed to fetch distance between ${origin} and ${destination} after ${retries} attempts`
                );
            }
        }
    }
};

export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();

        res.status(200).json({ routes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRoute = await Route.findByIdAndDelete(id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }

        await Bus.deleteMany({ routeId: id })

        return res.status(200).json({ message: 'Route and associated buses deleted successfully' });


    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}