// Importing the Router from Express Package
import { Router } from "express";

import { createNewUser } from "../controllers/user.controller.js";

// Creating the Router Object
const userRouter = Router();



// ====================================================================================================================================================
// MARK: Register Route
// URL : http://localhost:8000/api/v1/users/register
// Method : POST
userRouter.route("/user/create").post(createNewUser)



// Exporting the userRouter
export default userRouter