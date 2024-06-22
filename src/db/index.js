// Importing the Mongoose Package
import mongoose from "mongoose";

// Importing the DatabaseName From constants [Provide the Name with the Extension to remove any kind of Errors Encountered]
import { DB_NAME } from "../constants.js";

// Function to Connect the Database
const connectDB = async () => {
    try {

        // Connecting to the Mongoose - To Connect we have to add Mongo URL and then /databaseName
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

        console.log(`\nMongoDB Connected !!\nDB HOST : ${connectionInstance.connection.host}`);

    } catch (error) {

        console.log("[src/db/index.js] MongoDB connection error : ", error.message);
        
        // Closing and Exiting the Process
        process.exit(1)
    }
}

export default connectDB