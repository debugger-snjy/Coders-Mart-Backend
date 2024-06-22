import { Schema, SchemaTypes, model } from 'mongoose';

// Defining the Schema for the Order
const orderSchema = new Schema(
    {
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "customer",
            required: true,
        },

        // We will give reference to the products model ==> It like a foreign key
        orderItems: [{
            type: SchemaTypes.ObjectId,
            ref: "product",
            required: true,
        }],

        totalAmount: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
);

// Creating the Order Model (Takes Model Name and Schema)
const Order = model("Order", orderSchema);

// Exporting the Order Model
export default Order;