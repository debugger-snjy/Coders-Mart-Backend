// Importing the asyncPromiseHandler 
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js"

// Importing the API Error and response Classes
import { APIError } from "../utils/apiError.js"
import { APIResponse } from "../utils/apiResponse.js"

// Importing User Model
import User from "../models/user.model.js";

// Importing Validations
import { isAnyFieldEmpty, isEmailValid, isEmptyField, isMinMaxLengthValid, isValidName, isValidPassword, isValidPhoneNumber } from "../utils/validation.js";

// Importing the jwt package
import jwt from 'jsonwebtoken';

// Importing mongoose Package
import mongoose from "mongoose";


// ====================================================================================================================================================
// MARK : Function to Create User (signup)
const createUser = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the Data From the Request Body
    const { role = "", gender = "", phone = "", name = "", password = "", email = "", address = "" } = req.body;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validating the Data

    const allFieldValidation = isAnyFieldEmpty({ role, gender, phone, name, password, email })
    if (allFieldValidation.isEmpty) {
        console.log("[src/controllers/user.controller.js] Error :", allFieldValidation.message);
        return new APIError(400, allFieldValidation.message).send(res);
    }

    if (!isEmailValid(email)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Email Address");
        return new APIError(400, "Invalid Email Address").send(res);
    }
    if (!isValidPassword(password)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Password");
        return new APIError(400, "Invalid Password, Password Must Contain Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character").send(res);
    }
    if (!isValidName(name)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Name");
        return new APIError(400, "Invalid Name").send(res);
    }
    if (!isValidPhoneNumber(phone)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Phone Number");
        return new APIError(400, "Invalid Phone Number").send(res);
    }
    if (!(role === "admin" || role === "customer" || role === "employee")) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Role Defined");
        return new APIError(400, "Invalid Role Defined").send(res);
    }
    if (!(gender === "male" || gender === "female" || gender === "others")) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Gender");
        return new APIError(400, "Invalid Gender").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking User Exists with same Email or Phone Number
    const isUserExists = await User.findOne({
        $or: [
            { phone },
            { email }
        ]
    })

    if (isUserExists) {
        console.log("[src/controllers/user.controller.js] Error : User With Same Email or Phone Number Exists");
        return new APIError(400, "User With Same Email or Phone Number Exists").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // If here, means User is not Exists in our database, So Creating User

    try {
        const newUserData = await User.create({
            role,
            gender,
            phone,
            name,
            password,
            email,
            address
        })


        // If User Not Created
        if (!newUserData) {
            console.log("[src/controllers/user.controller.js] Error : User NOT Created Successfully !!");
            return new APIError(400, "User NOT Created Successfully !!").send(res);
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Sending the Success Response
        new APIResponse(200, newUserData, "User Created Successfully").send(res);

    } catch (error) {

        console.log("[src/controllers/user.controller.js] Error : ", error.message);
        return new APIError(400, "User NOT Created Successfully !!").send(res);

    }

})



// ======================================================================================================================
// MARK: Function to login the user
const loginUser = asyncPromiseHandler(async (req, res, next) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting Data From API Body
    const { email = "", password = "" } = req.body

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validation

    const allFieldsEmpty = isAnyFieldEmpty({ email, password })

    // If any Validation is not Valid, then we are throwing the Error using API Error
    if (allFieldsEmpty.isEmpty) {
        console.log("[src/controllers/user.controller.js] Error :");
        return new APIError(400, allFieldsEmpty.message).send(res);
    }
    if (!isEmailValid(email)) {
        console.log("[src/controllers/user.controller.js] Error :");
        return new APIError(400, "Invalid Email Address").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking For User Exists

    // As it is a database operation, so it will take time
    const existedUser = await User.findOne({ email })

    if (!existedUser) {
        console.log("[src/controllers/user.controller.js] Error :");
        // 409 : Stands for Conflict
        return new APIError(409, "User with This Email or Username Doesn't Exists !!").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Comparing Password
    const isPasswordValid = await existedUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        // 401 : Unauthorized
        console.log("[src/controllers/user.controller.js] Error :");
        return new APIError(401, "Invalid User Credentials").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Generating the JWT Token

    // Things that we need to store in the token
    const payload = {
        // values are coming from the database (this.field)
        _id: existedUser._id,
        email: existedUser.email,
    }

    // Signing the JWT Token with payload, secret key, other options
    let token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )

    // When we are using cookies, then when they are set in the frontend, 
    // then it can be modified in the frontend, so to make it static, secure and non-modified in the frontend,
    // We are defining the options for the cookies like security
    const cookieOptions = {
        httpOnly: true, // It will makes that the cookie will be modified by the server only
        secure: true
    }

    // Returning the Response
    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json(
            new APIResponse(
                200,
                {
                    // Setting the Data
                    user: existedUser,
                    token,
                },
                "User Logged In Successfully"
            )
        );

});



// ======================================================================================================================
// MARK: Function to Logout the user
const logoutUser = asyncPromiseHandler(async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new APIResponse(200, {}, "User Logout Successfully !!"));

})



// ======================================================================================================================
// MARK: Function to Get the Current User Data
const getCurrentUser = asyncPromiseHandler(async (req, res) => {

    // As we want the Current User Data, so we can get the user from the middleware
    // So, we will execute the auth middleware before it
    // After the middleware execution, we will get the user data in the req object
    return res
        .status(200)
        .json(
            new APIResponse(200, { user: req.user }, "Current User Fetched Successfully")
        )

})



// ======================================================================================================================
// MARK: Function to Update the Account Details
const updateAccountDetails = asyncPromiseHandler(async (req, res) => {

    const { gender = "", phone = "", name = "", email = "", address = "" } = req.body;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validations

    const allValidation = isAnyFieldEmpty({ gender, phone, name, email });

    if (allValidation.isEmpty === true) {
        console.log("[src/controllers/user.controller.js] Error : ", allValidation.message);
        return new APIError(400, allValidation.message).send(res);
    }
    if (!isEmailValid(email)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Email Address");
        return new APIError(400, "Invalid Email Address").send(res);
    }
    if (!isValidName(name)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Name");
        return new APIError(400, "Invalid Name").send(res);
    }
    if (!isValidPhoneNumber(phone)) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Phone Number");
        return new APIError(400, "Invalid Phone Number").send(res);
    }
    if (!(gender === "male" || gender === "female" || gender === "others")) {
        console.log("[src/controllers/user.controller.js] Error : Invalid Gender");
        return new APIError(400, "Invalid Gender").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Updating the Data into Database

    // getting the user data from req.user as we have auth middleware
    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/user.controller.js] Error : ");
        return new APIError(401, "Unauthorized Access").send(res);
    }


    // Finding the User By ID and updating the Data and returning the user data with its updated data
    const updatedUserData = await User.findByIdAndUpdate(
        loggedInUser._id,
        {
            $set: {
                gender,
                phone,
                name,
                email,
                address
            }
        },
        {
            new: true,
        }
    ).select("-password")

    // Returning the Response
    return res
        .status(200)
        .json(
            new APIResponse(200, updatedUserData, "User Account Details Updated Successfully !!")
        );
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exporting the Functions
export {
    createUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAccountDetails
}