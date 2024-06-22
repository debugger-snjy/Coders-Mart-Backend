import { Schema, model } from 'mongoose';

// Defining the Schema for the Product
const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productImage: {
            type: String,
        },
        productInStock: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

// Creating the Product Model (Takes Model Name and Schema)
const Product = model("Product", productSchema);

// Exporting the model: 
export default Product;