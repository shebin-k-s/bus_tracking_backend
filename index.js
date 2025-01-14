import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import http from 'http';
import { adminAuthRoute, authRouter, busRouter, routeRouter } from "./routes/index.js";
import { Server } from "socket.io";
import Bus from "./models/busModel.js";


dotenv.config();

const app = express();

const server = http.createServer(app)
const io = new Server(server)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/admin/auth", adminAuthRoute);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bus", busRouter);
app.use("/api/v1/route", routeRouter);


const PORT = process.env.PORT || 5000;


io.on('connection', async (socket) => {
    console.log('A user connected');

    socket.on('joinBusSocket', async (data) => {
        try {

            socket.emit('busInfo', { message: 'joined bus socket', status: true });

            socket.join(data.busId);
        } catch (error) {
            console.error('Error joining bus socket:', error);
            socket.emit('busInfo', { message: 'Failed to join bus socket', status: false });
        }
    });
    socket.on('sendBusLocation', async (data) => {
        try {
            const { busId, longitude, latitude } = data;

            const bus = await Bus.findById(busId);
            if (!bus) {
                socket.emit('busInfo', { message: 'Bus not found', status: false });
                return;
            }

            io.to(busId).emit('busLocation', {
                busId,
                latitude,
                longitude
            });
            bus.currentLocation = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            await bus.save()

        } catch (error) {
            console.error('Error sending bus location:', error);
            socket.emit('busInfo', { message: 'Failed to send bus location', status: false });
        }
    });
    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    });

})


mongoose.connect(process.env.CONNECTION_URL)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });


