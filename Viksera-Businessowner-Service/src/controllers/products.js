const ProductService = require("../service/products")
const Response = require("../utils/response");

class ProductController {
    async createProduct(req, res) {
        try {
            const title = req.body.title;
            const categoryId = req.body.category_id;
            const description = req.body.description;
    
            if (!title) {
                throw new Error("Required field title not found");
            }
            const {data: result, error} = await ProductService.insertProductData(title, categoryId, description);
            if (error) {
                throw new Error("Failed to create product");
            }
            const responseData = {
                id: result.id,
                title,
                description
            }
            res.status(201).send(Response.success(responseData, "Product created successfully", null));


        } catch (error) {
            console.log("[createProduct] controller Failed to create product", error);
            res.status(401).send(Response.error(error.message));
        }

    }

    async deleteProductByID(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new Error("Required field id not found");
            }
            const {data: result, error} = await ProductService.deleteProductByID(id);
            if (error) {
                throw new Error("Failed to delete product");
            }
            res.status(200).send(Response.success(null, "product deleted successfuly", null));
        } catch (error) {
            console.log("[deleteProductByID] controller failed");
            res.status(401).send(Response.error(error.message));

        }
    }
    
    async getAllProducts(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || null;
            const categoryId = req.query.category_id || null;
            const searchKey = req.query.search || null
            
            const {data: productCount, error} = await ProductService.getProductCount(categoryId, searchKey);
            if (error) {
                throw new Error("Failed to get products count");
            }
            const {data: products, err} = await ProductService.getAllProducts(categoryId, searchKey, page, limit);
            if (err) {
                throw new Error("Failed to get all products");
            }
            res.status(201).send(Response.success(products, "Product created successfully", { 
                "current_page": page,
                "next_page": Math.ceil(productCount / limit) == page ? 1 : page + 1,
                "total_pages": Math.ceil(productCount / limit),
                "total_rows": productCount,
                "limit": limit,
            }));

        } catch (error) {
            console.log("[getAllProducts] controller error ", error);
            res.status(401).send(Response.error(error.message));
        }
    }

}

module.exports = new ProductController();