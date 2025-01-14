import express from "express";
import { addBus, getAllBuses, getBusById, startBusJourney, updateBus } from "../controllers/busController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router()



router.route("/")
    .get(getAllBuses)


router.route("/add")
    .post(verifyToken, authorizeRole(['Admin']), addBus)


router.route("/:id")
    .get(getBusById)

router.route("/update/:id")
    .patch(updateBus)

router.route("/start-journey/:id")
    .patch(startBusJourney)






export default router;