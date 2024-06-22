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
const createNewUser = asyncPromiseHandler(async (req, res) => {

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



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exporting the Functions
export {
    createNewUser
}