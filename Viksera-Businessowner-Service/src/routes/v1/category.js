const express=require('express')
const router=express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

const CategoryController = require("../../controllers/category");

router.post("/create-category", upload.single("image"), CategoryController.createCategory);

router.delete("/delete-category/:id", CategoryController.deleteCategoryByID);

router.patch("/update-category/:id", CategoryController.updateCategoryByID);

router.get("/get-categories", CategoryController.getAllCategories);

module.exports = router;