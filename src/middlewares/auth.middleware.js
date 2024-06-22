// Importing JWT Token from jsonwebtoken package
import jwt from "jsonwebtoken";

// Importing the API Error Class
import { APIError } from "../utils/apiError.js";

// Importing the asyncPromiseHandler function
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";

// Importing the User Model
import User from "../models/user.model.js";

// Function to verify that the user is logged in or not by accessing its tokens
export const verifyJWT = asyncPromiseHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        // If token not found !
        if (!token) {
            return new APIError(401, "Unauthorized Request").send(res);
        }

        // We have decoded the token that we have got from cookies or header
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // Finding the User by its id
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        // If user not available/exists, then we send the Error
        if (!user) {
            console.log("[src/middlewares/auth.middleware.js]] Error :");
            return new APIError(401, "Invalid Token").send(res);
        }

        // Now, if the user is existing, then we will save the user in the req object
        req.user = user;

        // calling the next() method as it is the middleware, by calling this, it will call the next method defined in the routes
        next(); // will call the logoutUser function from user.controller.js

    } catch (error) {

        console.log("[src/middlewares/auth.middleware.js] Error :", error.message, " or Invalid Token");
        return new APIError(401, error?.message || "Invalid Token").send(res);
    }
})