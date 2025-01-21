import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addTicket, consumeTicket, fetchTicket } from "../controllers/ticketController.js";


const router = express.Router();

router.route("/")
    .get(fetchTicket);

router.route("/consume")
    .post(consumeTicket);

router.route("/add")
    .post(authorizeRole(['Admin']), addTicket);


export default router;
