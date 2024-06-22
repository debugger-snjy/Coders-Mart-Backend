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
        orderItems: [
            {
                itemID: {
                    type: SchemaTypes.ObjectId,
                    ref: "product",
                    required: true,
                },
                itemName: {
                    type: String,
                    required: true,
                },
                itemDescription: {
                    type: String,
                    required: true,
                },
                itemPrice: {
                    type: Number,
                    required: true,
                },
                itemImage: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true
                },
                totalPrice: {
                    type: Number,
                }
            }
        ],

        orderAmount: {
            type: Number,
            required: true,
            default: 0
        },

        paymentMode: {
            type: String,
            enum: ["CHEQUE", "CASH"],
            required: true
        }
    },
    { timestamps: true }
);

// Creating the Order Model (Takes Model Name and Schema)
const Order = model("Order", orderSchema);

// Exporting the Order Model
export default Order;