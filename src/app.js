// Importing the Express Package
import express from "express";

// Importing the cookieParse
import cookieParser from "cookie-parser";

// Importing the cors
import cors from "cors";
import { APIError } from "./utils/apiError.js";
import { APIResponse } from "./utils/apiResponse.js";

// Creating an Express application
const app = express();

// Adding the cors in the application
// app.use(cors());
// we can add the options to the cors as well
app.use(cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}))

// This is for the Data that we get from Forms
// Earlier, when the Express was not able to take the json responses, 
// we use different packages like body-parser, But now in express, we use the in-built middleware of the express
// No need for body-parser now
app.use(express.json({
    limit: process.env.JSON_LIMIT
}))

// This is for the Data that we get from URLs
app.use(express.urlencoded({
    extended: true,
    limit: process.env.URL_LIMIT
}))

// This is used to perform CRUD operations on the client's browser cookies securely and only be done by the server
app.use(cookieParser())



// ====================================================================================================================================================
// Adding Routes For the Application

// Testing Route for Server Alive
app.get("/v1/api/test/server", (req, res) => {
    console.log("[src/app.js] Route Tested Successfully")
    new APIResponse(200, { "Server": "Running" }, "Ok").send(res)
})

// Testing Route For Sending Error
app.get("/v1/api/test/error", (req, res) => {
    console.log("[src/app.js] Error Route Tested Successfully")
    new APIError(400, "Error Testing").send(res)
})

// Adding User Routes
import userRoutes from "./routes/user.routes.js";

app.use("/v1/api", userRoutes)

// Exporting the app in default format - i.e, no need to use object destructuring while importing
export default app;