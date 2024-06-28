// Importing the asyncPromiseHandler 
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js"

// Importing the API Error and response Classes
import { APIError } from "../utils/apiError.js"
import { APIResponse } from "../utils/apiResponse.js"

// Importing the Order Model
import Order from "../models/order.model.js";

// Importing the Cart Model
import Cart from "../models/cart.model.js";

// Importing the Product Model
import Product from "../models/product.model.js";

// Importing the Empty Field Validation
import { isEmptyField } from "../utils/validation.js";



// ====================================================================================================================================================
// MARK : Function to Add Orders
const addNewOrder = asyncPromiseHandler(async (req, res) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the Data From the API Request Body
    const { paymentMode = "", address = "" } = req.body;

    if (isEmptyField(paymentMode) || !(paymentMode === "CHEQUE" || paymentMode === "CASH")) {
        console.log("[src/controllers/order.controller.js] Error : Payment Mode is Empty or Invalid ");
        return new APIError(400, "Payment Mode is Empty or Invalid ").send(res);
    }
    if (isEmptyField(address)) {
        console.log("[src/controllers/order.controller.js] Error : Address is Empty or Invalid ");
        return new APIError(400, "Address is Empty or Invalid ").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the LoggedIn User Data

    const loggedInUser = req.user;

    if (!loggedInUser) {
        console.log("[src/controllers/order.controller.js] Error : Unauthorized Request");
        return new APIError(400, "Unauthorized Request").send(res);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getting the Cart Data for the Order

    const cartData = await Cart.aggregate([
        {
            $match: {
                owner: loggedInUser._id
            },
        },
        {
            $project: {
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
            }
        }
    ])

    if (!cartData || cartData.length === 0 || cartData[0].cartItems.length === 0) {
        console.log("[src/controllers/order.controller.js] Error : No Cart Found");
        return new APIError(400, "No Cart Found").send(res);
    }

    console.log("Cart Data : ", cartData);
    console.log("Cart Data : ", cartData[0].cartItems);

    await Promise.all(
        await cartData[0].cartItems.map(async (item) => {
            await Product.findByIdAndUpdate(
                item.itemID,
                {
                    $inc: {
                        productInStock: -item.quantity
                    }
                }
            )
            console.log("Product Quantity Updated on Ordering !!");
        })
    )

    // Adding the Orders in the Database
    const newOrder = await Order.create({
        owner: loggedInUser._id,
        orderItems: cartData[0].cartItems,
        orderAmount: cartData[0].cartAmount,
        paymentMode: paymentMode,
        orderAddress: address
    })

    if (!newOrder) {
        console.log("[src/controllers/order.controller.js] Error : Your Orders is NOT Added");
        return new APIError(400, "Your Orders is NOT Added").send(res);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // As the Order is successfully Placed, we will remove the items from the cart
    // Deleting the Cart Data
    const deletedCartData = await Cart.findByIdAndDelete(
        cartData[0]._id
    )

    if (!deletedCartData) {
        console.log("[src/controllers/cart.controller.js] Error : Cart Not Deleted");
        return new APIError(400, "Cart Not Deleted").send(res);
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, newOrder, "Order Added Successfully, Your Cart is Empty Now !!")
        )

})



// ======================================================================================================================
// MARK: Function to Fetch Orders
const getAllOrders = asyncPromiseHandler(async (req, res, next) => {

    const allOrders = await Order.find({
        owner: req.user._id
    });

    if (!allOrders) {
        console.log("[src/controllers/order.controller.js] Error : No Orders Found !!");
        return new APIError(400, "No Orders Found !!").send(res);
    }

    // Returning the Response
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    orders: allOrders
                },
                "All Orders Fetched Successfully"
            )
        );

});



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exporting the Functions
export {
    addNewOrder,
    getAllOrders
}