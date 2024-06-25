// Importing the Router from Express Package
import { Router } from "express";

import { addStaticProducts, getAllProducts, getProduct } from "../controllers/product.controller.js";

// Creating the Router Object
const productRouter = Router();



// ====================================================================================================================================================
// MARK: Add Products Statically Route
// Method : POST
productRouter.route("/add").post(addStaticProducts)



// ====================================================================================================================================================
// MARK: Fetch All Products
// Method : Get
productRouter.route("/").get(getAllProducts)



// ====================================================================================================================================================
// MARK: Fetch All Products
// Method : Get
productRouter.route("/:id").get(getProduct)



// Exporting the userRouter
export default productRouter