// Importing the Router from Express Package
import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUser, getCurrentUser, loginUser, logoutUser, updateAccountDetails } from "../controllers/user.controller.js";

// Creating the Router Object
const userRouter = Router();



// ====================================================================================================================================================
// MARK: Register Route
// Method : POST
userRouter.route("/register").post(createUser)



// ====================================================================================================================================================
// MARK: Login Route
// Method : POST
userRouter.route("/login").post(loginUser)



// ====================================================================================================================================================
// MARK: Current User Data Route
// Method : POST
userRouter.route("/get").get(
    verifyJWT,
    getCurrentUser
)



// ====================================================================================================================================================
// MARK: Logout Route
// Method : POST
userRouter.route("/logout").post(logoutUser)



// ====================================================================================================================================================
// MARK: Update User Route
// Method : POST
userRouter.route("/:id").put(
    verifyJWT,
    updateAccountDetails
)



// Exporting the userRouter
export default userRouter