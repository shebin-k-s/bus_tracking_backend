import express from "express";
import { addRoute, getAllRoutes } from "../controllers/routeController.js";


const router = express.Router();

router.route("/")
    .get(getAllRoutes);

router.route("/add")
    .post(addRoute);

// router.route("/:id")
//     .get(getRouteById);

// router.route("/update/:id")
//     .patch(updateRoute);

// router.route("/delete/:id")
//     .delete(deleteRoute);

export default router;
