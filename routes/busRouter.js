import express from "express";
import { addBus, getAllBuses, getBusById, startBusJourney, updateBus } from "../controllers/busController.js";

const router = express.Router()



router.route("/")
    .get(getAllBuses)


router.route("/add")
    .post(addBus)




router.route("/:id")
    .get(getBusById)

router.route("/update/:id")
    .patch(updateBus)

router.route("/start-journey/:id")
    .patch(startBusJourney)






export default router;