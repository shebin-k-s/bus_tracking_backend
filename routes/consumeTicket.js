import express from "express";
import { consumeTicket } from "../controllers/ticketController.js";


const router = express.Router();

router.route("/")
    .post(consumeTicket);

export default router;
