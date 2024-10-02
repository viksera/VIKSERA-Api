const express=require('express')
const router=express.Router();

const ProductController = require("../../controllers/products")

router.post("/create-product", ProductController.createProduct);

router.delete("/delete-product/:id", ProductController.deleteProductByID);

router.get("/get-products", ProductController.getAllProducts);

module.exports = router;