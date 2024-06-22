import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';

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

// Using Pre Hook
userSchema.pre("save", async function (next) {

    // If not Modified, then return the next(), as we don't want to hash the password every time
    if (!this.isModified("password")) return next();

    // Else, we have to encrypt the password field
    // we have to use the await as hashing is a computational job and will take time, also from documentation it will return the Promise
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// --------------------------------------------------------------------------------------------------------------------------------
// Adding the Custom Methods

// This will check whether the password is correct or not (i.e, compare the hashed password with the normal text password)
userSchema.methods.isPasswordCorrect = async function (password) {

    // Here, the object we compare with may or may not have the password field fetched from the database
    // So, if the password field is not available, then we will fetch the password of that user
    if (!this.password) {
        const userPasswordData = await User.findById(this._id, { _id: 0, password: 1 })
        console.log("[src/models/user.model.js] Password Fetched From DB : ", userPasswordData);

        // As the user record don't contain the password field, so we have fetched the password field and then compare it here
        return await bcrypt.compare(password, userPasswordData.password);
    }

    // If the code is here, means that the password field is present in the user record and we can compare directly from that value
    return await bcrypt.compare(password, this.password);
}

// Creating the User Model (Takes Model Name and Schema)
const User = model("User", userSchema);

// Exporting the model: 
export default User;