const CategoryModel = require("../models/category");
const { error } = require("../utils/response");

class CategoryService {

    async insertCategoryData(name, objectKey, imageUrl, description = "", status = true) {
        try {
            const result = await CategoryModel.create({
                name: name,
                object_key: objectKey,
                image_url: imageUrl,
                 description: description,
                 status: status
            });
            console.log("[createCategory] service result of create category", result);
            return {data: result, error: null};
        } catch (error) {
            console.log("[createCategory] service failed to execute", error);
            return {data: null, error: error};
        }
    }

    async getCategoryByID(id) {
        try {
            const category = await CategoryModel.findByPk(id);
            if (!category) {
                throw new Error("Invalid ID Category not found");
            }
            console.log("[getCategoryByID] Category obtained", category);
            return {data: category.toJSON, error: null};
        } catch (error) {
            console.log("[getCategoryByID] failed to execute",id , error);
            return {data: null, error: error};
        }
    }

    async deleteCategoryByID(id) {
        try {
            const result = await CategoryModel.destroy({
                where: {
                    id: id
                }
            })
            return {data: result, error: null};

        } catch (error) {
            console.log("[deleteCategory]  service failed to delete category", error);
            return {data: null, error: error};
        }
    }

    async updateCategoryByID(id, updateData) {
        console.log("[updateCategoryByID] service", updateData, {
            where: {
                id: id
            }
        })
        try {

            const result = await CategoryModel.update(updateData, {
                where: {
                    id: id
                }
            })
            if (!(result[0]>0)) {
                throw new Error("Failed to update category, no matching record found")
            }
            return {data: result, error: null};

        } catch (error) {
            console.log("[updateCategoryByID] service failed to execute", error);
            return {data: null, error};
        }
    }

    async getAllCategories(status, page = 1, limit = null) {
        const options = {
            offset : (page - 1) * (limit || 0)
        };
        if (status != null) {
            options.where = {
                status: status
            }
        };
        if (limit) {
            options.limit = limit
        }
        try {
            let categories = [];
            categories = await CategoryModel.findAll(options);
            console.log("[getAllCategories] service obtained the categories", categories);
            return {data: categories, error: null};
        } catch (error) {
            console.log("[getAllCategories] service failed to execute", error);
            return {data: null, error: error};
        }
    }

    async getTotalCategoryCount(status = null) {
        try {
            const options = {};
            if ( status != null) {
                options.where = {
                    status: status
                };
            }
            const categoryCount = await CategoryModel.count(options);
            return {data: categoryCount, error: null};
        } catch (error) {
            console.log("[getTotalCategoryCount] Failed to execute the category count", error);
            return {data: null, error};
        }
    }
}

module.exports = new CategoryService();