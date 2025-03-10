import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { assignCard } from "../controllers/cardController.js";
import { consumeTicket } from "../controllers/ticketController.js";


const router = express.Router();


router.route("/assign")
    .post(authorizeRole(['Admin']), assignCard);

router.route("/consume")
    .post(consumeTicket);


export default router;
