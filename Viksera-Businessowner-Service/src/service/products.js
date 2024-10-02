const { Op } = require("sequelize");
const ProductModel = require("../models/products");

class ProductService {
    
    async insertProductData(title, categoryId = "", description = "") {
        try {
            const result = await ProductModel.create({
                name: title,
                category_id: categoryId,
                description: description
            });
            if (!result) {
                throw new Error("Failed to create product");
            }
            return {data: result, error: null}

        } catch (error) {
            console.log("[insertProductData] services failed to execute", title, categoryId, description, error);
            return {data: null, error: error};
        }

    };

    async deleteProductByID(id) {
        try {
            const result = await ProductModel.destroy({
                where:{
                    id: id
                }
            })
            if (!result) {
                throw new Error("Failed to delete banner");
            }
            return {data: result, error: null};
        } catch (error) {
            console.log("[deleteProductByID] service failed to delete", id, error);
            return {data: null, error: error};
        }
    }

    async getProductCount(categoryId =  null, searchKey = null) {
        let options = {};
        if (categoryId) {
            options.where = {category_id: categoryId};
        }
        if (searchKey) {
            options.where = {...options.where, name : { 
                [Op.like]: `%${searchKey}%`}
            };
        }
        try {
            const productCount = await ProductModel.count(options);
            return {data: productCount, error: null};
        } catch (error) {
            console.log("[getProductCount] service failed", error);
            return {data: null, error: error};
        }
    }

    async getAllProducts(categoryId = null, searchKey = null, page = 1, limit = null) {
        let options = {
            offset: (page - 1) * (limit || 0), 
        };
    
        if (limit) {
            options.limit = limit;
        }

        if (categoryId) {
            options.where = {category_id: categoryId};
        }
        if (searchKey) {
            options.where = {...options.where, name : { 
                [Op.like]: `%${searchKey}%`}
            };
        }
        try {
            const products = await ProductModel.findAll(options);
            return {data: products, error: null};
        } catch (error) {
            console.log("[getAllProducts] service failed ", error);
            return {data: null, error: error};
        }
    }

}

module.exports = new ProductService();