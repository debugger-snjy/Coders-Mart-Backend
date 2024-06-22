// In this File, we are going to use the Modular Approach

// Importing the Connection Database Function [Provide the Name with the Extension to remove any kind of Errors Encountered]
import connectDB from './db/index.js'

// Importing the dotenv package
import dotenv from 'dotenv';
// The Above line will not work as it is not valid, but we can use it with the experimental feature

// Importing the Express Application Object
import app from "./app.js";

// Configuring the env
dotenv.config({
    path: "../.env"
})

// Calling the Connection Function and it will return the promise and handling it
connectDB()
    .then(() => {

        // Now, Here we are going to use the app object and start the server
        // If the app is not working or having errors
        app.on("error", (error) => {
            console.log("[src/index.js] Errors : ", error);
            throw error;
        })

        // Application Listening Code
        app.listen(process.env.PORT, () => {
            console.log(`[src/index.js] App is Listening on PORT ${process.env.PORT} ⚙️  `);
        })

    })
    .catch((err) => {
        console.log("[src/index.js] Mongo DB Connection Failed !!", err);
    })