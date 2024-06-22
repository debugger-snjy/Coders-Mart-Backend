// Importing the asyncPromiseHandler 
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js"

// Importing the API Error and response Classes
import { APIError } from "../utils/apiError.js"
import { APIResponse } from "../utils/apiResponse.js"

// Validation Functions
import { isEmptyField } from "../utils/validation.js"

// Importing the Product Model
import Product from "../models/product.model.js"

// Importing the Cart Model
import Cart from "../models/cart.model.js"

// Imported Mongoose Model
import mongoose from "mongoose"



// ====================================================================================================================================================
// MARK: Function to Add Item in Cart
const addItemsInCart = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting Data From API Request Body

    const { productID = "", quantity = 0 } = req.body;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validations

    if (isEmptyField(productID)) {
        console.log("[src/controllers/cart.controller.js] Error : Product ID is required");
        return new APIError(400, "Product ID is required").send(res);
    }
    if (quantity === 0 || (typeof quantity !== "number")) {
        console.log("[src/controllers/cart.controller.js] Error : Quantity cannot be 0 or Empty");
        return new APIError(400, "Quantity cannot be 0 or Empty").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/cart.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking for Product Exists
    const productData = await Product.findById(productID);

    console.log(productData);

    if (!productData) {
        console.log("[src/controllers/cart.controller.js] Error : No Product Found With this ID or Invalid Product ID");
        return new APIError(400, "No Product Found With this ID or Invalid Product ID").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Adding the Product in the User Cart

    // find() always returns an Array
    const isCartOfUserExists = await Cart.find({
        owner: loggedInUser
    });

    console.log(isCartOfUserExists)

    // Creating the Cart Item Object
    const newCartItem = {
        itemID: productID,
        quantity,
        totalPrice: quantity * productData.productPrice,
        itemName: productData.productName,
        itemDescription: productData.productDescription,
        itemPrice: productData.productPrice,
        itemImage: productData.productImage,
    }

    let isProductAlreadyExists = false;

    // If the User Cart Already Exists, we will only add the product with Quantity in that
    if (isCartOfUserExists.length === 1) {

        const updatedCartItems = isCartOfUserExists[0].cartItems.map((cartitem) => {

            if (cartitem.itemID._id.toString() === productID) {
                cartitem.quantity += newCartItem.quantity;
                cartitem.totalPrice += newCartItem.totalPrice
                isProductAlreadyExists = true;
            }
            // As we are using arrow function with block bracket, we have to return the result
            return cartitem
        })

        let allCartItems;

        if (isProductAlreadyExists) {
            allCartItems = updatedCartItems;
        }
        else {

            isCartOfUserExists[0].cartItems.push(newCartItem);

            allCartItems = isCartOfUserExists[0].cartItems;
        }

        console.log("[src/controllers/cart.controller.js] items : ", allCartItems);

        let cartAmount = Math.round((allCartItems.reduce((accumulator, currentValue) => accumulator + currentValue.totalPrice, 0) + Number.EPSILON) * 100) / 100

        // console.log(cartAmount);

        let updatedUserCart;

        // So, we will update the CartItems And Add New Cart Item in the Array
        try {
            updatedUserCart = await Cart.findByIdAndUpdate(
                isCartOfUserExists[0]._id,
                {
                    $set: {
                        cartItems: allCartItems,
                        cartAmount
                    }
                },
                {
                    new: true
                }
            )
        } catch (error) {
            console.log("[src/controllers/cart.controller.js] Error : ", error.message);
        }

        if (!updatedUserCart) {
            console.log(updatedUserCart)
            console.log("[src/controllers/cart.controller.js] Error : Item Not Added in the Cart");
            return new APIError(400, "Item Not Added in the Cart").send(res);
        }

        return res
            .status(200)
            .json(
                new APIResponse(200, updatedUserCart, "Item Added in the Cart Successfully")
            )

    }
    else {

        // Means that the User have never created any Cart, so creating the New Cart

        const newUserCart = await Cart.create(
            {
                owner: loggedInUser._id,
                cartItems: [newCartItem],
                cartAmount: newCartItem.totalPrice
            }
        )

        if (!newUserCart) {
            console.log("[src/controllers/cart.controller.js] Error : Item Not Added in the Cart");
            return new APIError(400, "Item Not Added in the Cart").send(res);
        }

        return res
            .status(200)
            .json(
                new APIResponse(200, newUserCart, "Item Added in the Cart Successfully")
            )

    }

})



// ====================================================================================================================================================
// MARK: Function to Remove Only Item in Cart
const removeItemFromCart = asyncPromiseHandler(async (req, res) => {

    const { id: itemInCartId = "" } = req.params;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validation

    if (isEmptyField(itemInCartId) || itemInCartId === ":id") {
        console.log("[src/controllers/cart.controller.js] Error : Item ID is Missing or Invalid");
        return new APIError(400, "Item ID is Missing or Invalid").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/cart.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking Whether the Item is Exits in the User Cart

    const userCart = await Cart.aggregate([
        {
            $match: {
                owner: loggedInUser._id,
            },
        },
        {
            $project: {
                cartAmount: 1,
                cartItems: {
                    $filter: {
                        input: "$cartItems",
                        as: "cartItems",
                        cond: {
                            $eq: [
                                "$$cartItems.itemID",
                                new mongoose.Types.ObjectId(itemInCartId)
                            ],
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                cartItems: { $first: '$cartItems' },
            }
        }
    ]);

    console.log("Cart Data : ", userCart)

    if (!userCart[0].cartItems) {
        console.log("[src/controllers/cart.controller.js] Error : Item Doesn't Exists in Your Cart !");
        return new APIError(400, "Item Doesn't Exists in Your Cart !").send(res);
    }

    // Getting the Round Off Value
    let updatedCartAmount = Math.round((userCart[0].cartAmount - userCart[0].cartItems.totalPrice + Number.EPSILON) * 100) / 100;

    // Now, if the Item is present, then we have to remove that item from that cart
    let updatedCart = await Cart.updateOne(
        { _id: userCart[0]._id, },
        { $pull: { "cartItems": { "itemID": itemInCartId } } }
    )

    if (!updatedCart) {
        console.log("[src/controllers/cart.controller.js] Error : Item NOT Removed From Your Cart");
        return new APIError(400, "Item NOT Removed From Your Cart").send(res);
    }

    console.log(updatedCart)

    if (!updatedCart.modifiedCount) {
        console.log("[src/controllers/cart.controller.js] Error : Item NOT Removed From Your Cart modifiedCount");
        return new APIError(400, "Item NOT Removed From Your Cart").send(res);
    }

    // Now, Updating the CartAmount in the Cart Document
    const updatedCartAmountData = await Cart.updateOne(
        { _id: userCart[0]._id, },
        { $set: { cartAmount: updatedCartAmount } }
    )

    if (!updatedCartAmountData) {
        console.log("[src/controllers/cart.controller.js] Error : Item NOT Removed From Your Cart modifiedCount");
        return new APIError(400, "Item NOT Removed From Your Cart").send(res);
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, {}, "Item Removed From Your Cart")
        )

})



// ====================================================================================================================================================
// MARK: Function to Update Quantity in Cart
const updateQuantityOfItem = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting Data From API Request Body

    const { productID = "", quantity = 0, qtyOperation = "" } = req.body;

    console.log("req.body : ", req.body)

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Validations

    if (isEmptyField(productID)) {
        console.log("[src/controllers/cart.controller.js] Error : Product ID is required");
        return new APIError(400, "Product ID is required").send(res);
    }
    if (quantity === 0 || (typeof quantity !== "number")) {
        console.log("[src/controllers/cart.controller.js] Error : Quantity cannot be 0 or Empty");
        return new APIError(400, "Quantity cannot be 0 or Empty").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/cart.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking for Product Exists
    const productData = await Product.findById(productID);

    console.log("Product Data :", productData);

    if (!productData) {
        console.log("[src/controllers/cart.controller.js] Error : No Product Found With this ID or Invalid Product ID");
        return new APIError(400, "No Product Found With this ID or Invalid Product ID").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking Whether Cart of the User Exists

    // find() always returns an Array
    const isCartOfUserExists = await Cart.find({
        owner: loggedInUser
    });

    let addQuantityFailed = false;
    let removeQuantityFailed = false;
    let updatedCartAmountBy = 0;
    let currentCartAmount = isCartOfUserExists[0].cartAmount;
    let isProductAlreadyExists = false;


    console.log("isCartOfUserExists : ", isCartOfUserExists)

    // If the User Cart Exists, we will Update the Quantity of that Product
    if (isCartOfUserExists.length === 1) {

        const updatedCartItems = await Promise.all(isCartOfUserExists[0].cartItems.map(async (cartitem) => {

            if (cartitem.itemID._id.toString() === productID) {
                const itemDetails = await Product.findById(cartitem.itemID).then((res) => res);
                console.log("itemDetails : ", itemDetails);
                isProductAlreadyExists = true;

                if (qtyOperation === "add") {
                    if (itemDetails.productInStock >= cartitem.quantity + quantity) {
                        cartitem.quantity += quantity;
                        cartitem.totalPrice += quantity * itemDetails.productPrice;

                        // This Price will be Added in the cartAmount
                        updatedCartAmountBy = quantity * itemDetails.productPrice;

                    }
                    else {
                        addQuantityFailed = true;
                    }
                }
                else if (qtyOperation === "remove") {
                    if (cartitem.quantity - quantity <= 0) {
                        removeQuantityFailed = true;
                    }
                    else {
                        cartitem.quantity -= quantity;
                        cartitem.totalPrice -= quantity * itemDetails.productPrice;

                        // This amount will be deducted from the Cart Amount
                        updatedCartAmountBy = quantity * itemDetails.productPrice;
                    }
                }

            }
            // As we are using arrow function with block bracket, we have to return the result
            return cartitem
        })).then((res) => res)

        if (!isProductAlreadyExists) {
            console.log("[src/controllers/cart.controller.js] Error : No Item Exists with this ID");
            return new APIError(400, "No Item Exists with this ID").send(res);
        }

        if (addQuantityFailed) {
            console.log("[src/controllers/cart.controller.js] Error : Item You are Trying to Increase Quantity is Out of Stock");
            return new APIError(400, "Item You are Trying to Increase Quantity is Out of Stock").send(res);
        }
        if (removeQuantityFailed) {
            // Breaking the Loop of map
            console.log("[src/controllers/cart.controller.js] Error : Item You are Trying to Decrease Quantity is Invalid");
            return new APIError(400, "Item You are Trying to Decrease Quantity is Invalid").send(res);
        }

        console.log("[src/controllers/cart.controller.js] items : ", updatedCartItems);

        let updatedUserCart;
        let finalCartAmount = qtyOperation === "add" ? currentCartAmount + updatedCartAmountBy : currentCartAmount - updatedCartAmountBy;

        if (finalCartAmount < 0) {
            console.log("[src/controllers/cart.controller.js] Error : Invalid Operation");
            return new APIError(400, "Invalid Operation").send(res);
        }

        // So, we will update the CartItems And Add New Cart Item in the Array
        try {
            updatedUserCart = await Cart.findByIdAndUpdate(
                isCartOfUserExists[0]._id,
                {
                    $set: {
                        cartItems: updatedCartItems,
                        cartAmount: Math.round((finalCartAmount + Number.EPSILON) * 100) / 100
                    }
                },
                {
                    new: true
                }
            )
        } catch (error) {
            console.log("[src/controllers/cart.controller.js] Error : ", error.message);
            return new APIError(400, "Item Quantity Not Modified Successfully").send(res);
        }

        if (!updatedUserCart) {
            console.log(updatedUserCart)
            console.log("[src/controllers/cart.controller.js] Error : Item Quantity Not Modified Successfully");
            return new APIError(400, "Item Quantity Not Modified Successfully").send(res);
        }

        return res
            .status(200)
            .json(
                new APIResponse(200, updatedUserCart, "Item Quantity Modified Successfully Successfully")
            )

    }
    else {
        console.log("[src/controllers/cart.controller.js] Error : Item NOT Exists in Your Cart");
        return new APIError(400, "Item NOT Exists in Your Cart").send(res);
    }

})



// ====================================================================================================================================================
// MARK: Function to Add Item in Cart
const emptyCart = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/cart.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking Whether the Item is Exits in the User Cart

    const userCart = await Cart.aggregate([
        {
            $match: {
                owner: loggedInUser._id,
            },
        }
    ]);

    if (userCart.length === 0) {
        console.log("[src/controllers/cart.controller.js] Error : No Cart Data Found !!");
        return new APIError(400, "No Cart Data Found !!").send(res);
    }

    const deletedCartData = await Cart.findByIdAndDelete(
        userCart[0]._id
    )

    if (!deletedCartData) {
        console.log("[src/controllers/cart.controller.js] Error : Cart Not Deleted");
        return new APIError(400, "Cart Not Deleted").send(res);
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, { deletedCartData }, "All Items From Your Cart Are Removed Successfully !!")
        )
})



// ====================================================================================================================================================
// MARK: Function to Remove Only Item in Cart
const getUserCart = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/cart.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking Whether the Item is Exits in the User Cart

    const userCart = await Cart.aggregate([
        {
            $match: {
                owner: loggedInUser._id,
            },
        }
    ]);

    if (userCart.length === 0) {
        console.log("[src/controllers/cart.controller.js] Error : No Cart Data Found !!");
        return new APIError(400, "No Cart Data Found !!").send(res);
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, { userCart }, "Your Cart has Been Fetched Successfully")
        )

})



// ====================================================================================================================================================
// MARK: Exporting the Functions
export {
    addItemsInCart,
    removeItemFromCart,
    updateQuantityOfItem,
    getUserCart,
    emptyCart
}