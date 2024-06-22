import { Schema, SchemaTypes, model } from 'mongoose';

// Defining the Schema for the Cart
const CartSchema = new Schema(
    {
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "customer",
            required: true,
        },

        // We will give reference to the products model ==> It like a foreign key
        cartItems: [
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
                totalPrice:{
                    type:Number,
                }
            }
        ],

        cartAmount: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
);

// Creating the Cart Model (Takes Model Name and Schema)
const Cart = model("Cart", CartSchema);

// Exporting the Cart Model
export default Cart;