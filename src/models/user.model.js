import { Schema, model } from 'mongoose';

// Defining the Schema for the User
const userSchema = new Schema(
    {

        role: {
            type: String,
            required: true,
            enum: ["customer", "admin", "employee"],
            default: "user"
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"],
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
        },
    },
    { timestamps: true }
);

// Creating the User Model (Takes Model Name and Schema)
const User = model("User", userSchema);

// Exporting the model: 
export default User;