// Importing the Router from Express Package
import { Router } from "express";

import { addNewOrder, getAllOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating the Router Object
const orderRouter = Router();



// ====================================================================================================================================================
// MARK: Add Order Route
// Method : POST
orderRouter.route("/").post(
    verifyJWT,
    addNewOrder
);



// ====================================================================================================================================================
// MARK: Fetch All Order
// Method : Get
orderRouter.route("/").get(
    verifyJWT,
    getAllOrders
);




// Exporting the userRouter
export default orderRouter