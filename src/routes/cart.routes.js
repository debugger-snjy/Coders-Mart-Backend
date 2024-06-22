// Importing the Router from Express Package
import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addItemsInCart, emptyCart, getUserCart, removeItemFromCart, updateQuantityOfItem } from "../controllers/cart.controller.js";

// Creating the Router Object
const cartRouter = Router();



// ====================================================================================================================================================
// MARK: Adding Items in Cart
// Method : POST
cartRouter.route("/").post(
    verifyJWT,
    addItemsInCart
)



// ====================================================================================================================================================
// MARK: Removing Item From Cart
// Method : DELETE
cartRouter.route("/item/:id").delete(
    verifyJWT,
    removeItemFromCart
)



// ====================================================================================================================================================
// MARK: Update Item Quantity In Cart
// Method : PATCH
cartRouter.route("/").patch(
    verifyJWT,
    updateQuantityOfItem
)



// ====================================================================================================================================================
// MARK: Fetch Cart Details of the LoggedIn User
// Method : GET
cartRouter.route("/").get(
    verifyJWT,
    getUserCart
)



// ====================================================================================================================================================
// MARK: To Clear/Empty the Cart
// Method : DELETE
cartRouter.route("/").delete(
    verifyJWT,
    emptyCart
)


// Exporting the cartRouter
export default cartRouter