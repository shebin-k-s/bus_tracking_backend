import express from "express";
import { addBus, deleteBus, getAllBuses, getBusById, startBusJourney, updateBus } from "../controllers/busController.js";
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
    .patch(verifyToken, authorizeRole(['Admin']), updateBus)

router.route("/start-journey/:id")
    .patch(startBusJourney)

router.route("/:id")
    .delete(verifyToken, authorizeRole(['Admin']), deleteBus)






export default router;