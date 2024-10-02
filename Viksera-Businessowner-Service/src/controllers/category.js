const { v4: uuidv4, parse } = require("uuid")
const CategoryService = require("../service/category")
const Helper =require("../utils/helpers");
const AWS = require("../library/aws");
const Response = require("../utils/response");

class CategoryController {

    async createCategory(req, res) {
        const title = req.body.title;
        const file = req.file;
        const description = req.body.description || "";
        const status = req.body.status || true;

        if (!file || !title) {
            throw new Error("Required fields title , file ");
        }

        try {
            console.log("[createCategory] Controller processing")
            
            const id = uuidv4()
            const objectKey = "categories/" + title + "-" + id;
            const imageUrl = await AWS.uploadToS3(process.env.AWS_BUCKET, objectKey, req.file.path);
            
            if (!imageUrl) {
                throw new Error("Error uploading Image to S3 bucket");
            }
            
            console.log("[createCategory] Controller Uploaded image , logging public url", imageUrl);
            
            const {data: result, error} = await CategoryService.insertCategoryData(title, objectKey, imageUrl, description, status);
            if (error) {
                throw new Error("Failed to upload Banner data to DB");
            }
            console.log("[createCategory] Controller Inserted banner record to DB", result)

            const responseData = {
                id: result.id,
                title,
                description,
                imageUrl
            }
            console.log("[createCategory] Controller  Logging response", responseData);
            
            res.status(201).send(Response.success(responseData, "category created successfully", null));

        } catch (error) {
            console.log("[createCategory] controller Failed to execute", title, error);
            res.status(401).send(Response.error(error.message));
            
        }
    }

    async deleteCategoryByID(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new Error("Required field ID not found");
            }

            const {data: result, error} = CategoryService.deleteCategoryByID(id);
            if (error) {
                throw new Error("Failed to delete category");
            }

            res.status(200).send(Response.success(null, "category deleted successfully successfully", null));

        } catch (error) {
            console.log("[deleteCategoryByID] controller failed to execute ", error);
            res.status(401).send(Response.error(error.message));
        }
    }

    async updateCategoryByID(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;

            if (!id || !updateData) {
                throw new Error("Required fields not found");
            }

            const {data: category, error} = await CategoryService.getCategoryByID(id);
            if (error) {
                throw new Error("category not found invalid category ID");
            }

            const {data: result, err} = await CategoryService.updateCategoryByID(id, updateData);
            if (err) {
                throw new Error("Error updating the banner in update banner controller");
            }
            res.status(200).send(Response.success(null, "category updated successfully", null));

        } catch (error) {
            console.log("[updateCategoryByID] controller failed to execute ", error);
            res.status(401).send(Response.error(error.message));
        }
    }

    async getAllCategories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || null;
            let status = Helper.getStatus(req.query.status);
            
            const { data: categoryCount, error} = await CategoryService.getTotalCategoryCount(status);
            if (error) {
                throw new Error("[getAllCategories] Failed to execute Failed to get category count");
            }
            
            const { data: categories, error: err} = await CategoryService.getAllCategories(status, page, limit);
            if (err) {
                throw new Error("[getAllCategories] Failed to execute , Failed to get all the categories");
            }
            console.log("[getAllCategories] obtained all categories", categories);
            res.status(200).send(Response.success(categories, "categories fetched successfully", {
                "current_page": page,
                "next_page": Math.ceil(categoryCount / limit) == page ? 1 : page + 1,
                "total_pages": Math.ceil(categoryCount / limit),
                "total_rows": categoryCount,
                "limit": limit,
            }));
 
        } catch (error) {
            console.log("[getAllCategories] controller Failed to execute", error);
            res.status(401).send(Response.error(error.message));
        }
    }

}

module.exports = new CategoryController();