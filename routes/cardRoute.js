import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { assignCard } from "../controllers/cardController.js";


const router = express.Router();


router.route("/assign")
    .post(authorizeRole(['Admin']), assignCard);


export default router;
