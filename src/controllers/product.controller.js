// Importing the asyncPromiseHandler 
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js"

// Importing the API Error and response Classes
import { APIError } from "../utils/apiError.js"
import { APIResponse } from "../utils/apiResponse.js"

// Importing the Product Model
import Product from "../models/product.model.js";


// ====================================================================================================================================================
// MARK : Function to Add Products
const addStaticProducts = asyncPromiseHandler(async (req, res) => {

    // Dummy Products Data
    const allAvailableProducts = [
        {
            "productName": "Adidas Ultra boost 21",
            "productPrice": 18999.99,
            "productDescription": "The Adidas Ultra boost 21 features responsive cushioning and a lightweight design, perfect for runners.",
            "productImage": "https://images.unsplash.com/photo-1505248254168-1de4e1abfa78",
            "productInStock": 90
        },
        {
            "productName": "Puma RS-X",
            "productPrice": 15500.00,
            "productDescription": "The Puma RS-X features a chunky design and bold colorways, combining style and comfort.",
            "productImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "productInStock": 20
        },
        {
            "productName": "Reebok Nano X1",
            "productPrice": 14000.75,
            "productDescription": "The Reebok Nano X1 is designed for high-performance training, offering stability and support.",
            "productImage": "https://images.unsplash.com/photo-1530389912609-9a007b3c38a4",
            "productInStock": 10
        },
        {
            "productName": "New Balance 990v5",
            "productPrice": 17999.50,
            "productDescription": "The New Balance 990v5 blends classic style with modern comfort, featuring premium materials and cushioning.",
            "productImage": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
            "productInStock": 83
        },
        {
            "productName": "Asics Gel-Kayano 27",
            "productPrice": 16000.00,
            "productDescription": "The Asics Gel-Kayano 27 provides excellent stability and cushioning for long-distance running.",
            "productImage": "https://images.unsplash.com/photo-1605408499391-6368c628ef42",
            "productInStock": 12
        },
        {
            "productName": "Under Armour HOVR Phantom",
            "productPrice": 17000.99,
            "productDescription": "The Under Armour HOVR Phantom offers a zero-gravity feel to maintain energy return that helps eliminate impact.",
            "productImage": "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8",
            "productInStock": 8
        },
        {
            "productName": "Brooks Ghost 13",
            "productPrice": 15000.00,
            "productDescription": "The Brooks Ghost 13 features DNA LOFT cushioning for a smooth and stable ride.",
            "productImage": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
            "productInStock": 100
        },
        {
            "productName": "Hoka One One Clifton 7",
            "productPrice": 16500.45,
            "productDescription": "The Hoka One One Clifton 7 provides lightweight comfort and a smooth ride.",
            "productImage": "https://images.unsplash.com/photo-1562183241-b937e95585b6",
            "productInStock": 26
        },
        {
            "productName": "Saucony Endorphin Speed",
            "productPrice": 18500.00,
            "productDescription": "The Saucony Endorphin Speed features a responsive nylon plate and PWRRUN PB cushioning.",
            "productImage": "https://images.unsplash.com/photo-1595341888016-a392ef81b7de",
            "productInStock": 45
        },
    ]

    // Removing all the previous Products as we are handling statically
    const deletedProducts = await Product.deleteMany({});

    if (!deletedProducts) {
        console.log("[src/controllers/product.controller.js] Error : ");
        return new APIError(400, "Previous Products are NOT Deleted").send(res);
    }

    // Adding the Products in the Database
    const addedProducts = await Product.insertMany(allAvailableProducts)

    if (!addedProducts) {
        console.log("[src/controllers/product.controller.js] Error : ");
        return new APIError(400, "New Products are NOT Added").send(res);
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, addedProducts, "All Products are Added Statically")
        )

})



// ======================================================================================================================
// MARK: Function to Fetch Products
const getAllProducts = asyncPromiseHandler(async (req, res, next) => {

    const allProducts = await Product.find({});

    if (!allProducts) {
        console.log("[src/controllers/product.controller.js] Error : ");
        new APIError(400, "No Products Found !!").send(res);
    }

    // Returning the Response
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    products: allProducts
                },
                "All Products Fetched Successfully"
            )
        );

});



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exporting the Functions
export {
    addStaticProducts,
    getAllProducts
}