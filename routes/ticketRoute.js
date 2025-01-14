import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addTicket, fetchTicket } from "../controllers/ticketController.js";


const router = express.Router();

router.route("/")
    .get(fetchTicket);

router.route("/add")
    .post(authorizeRole(['Admin']),addTicket);


export default router;
