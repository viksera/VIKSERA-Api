const AWS = require("../library/aws");
const BannerService = require("../service/banner");
const Response = require("../utils/response");
const { v4: uuidv4 } = require('uuid');

class BannerController {

    /**
     * @typedef {Object} UploadRequest
     * @property {string} title - The title of the upload.
     * @property {string} type - The type of the upload, must be either 'value1' or 'value2'.
     * @property {Object} file - The uploaded file.
     * @property {string} file.originalname - The original name of the uploaded file.
     * @property {string} file.mimetype - The MIME type of the uploaded file.
     * @property {number} file.size - The size of the uploaded file in bytes.
     * @property {string} file.path - The path where the uploaded file is stored.
     * @property {'business'| 'marketing agency'| 'influencer'| 'all'} target_audience
     * @property {time} expires_on
     * @property {boolean} status 
     */


    /**
     * 
     * @route POST /api/v1/banner/upload-banner
     * @group Banner - Operation related to Banner
     * @param {UploadRequest} title 
     * @returns {object} 201
     * @returns {Error} 401  default -
     */
    async createBanner(req, res) {
        
        const title = req.body.title;
        const type = req.body.type;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Title and image are required' });
        }
        const targetAudience =req.body.target_audience;
        try {
            console.log("Banner controller processing upload function")
            
            const id = uuidv4()
            const objectKey = title + "-" + id;
            const imageUrl = await AWS.uploadToS3(process.env.AWS_BUCKET, objectKey, req.file.path);
            
            if (!imageUrl) {
                throw new Error("Error uploading Image to S3 bucket");
            }
            
            console.log("Uploaded image logging public url", imageUrl);
            
            const result = await BannerService.insertBannerData(title, objectKey, type, imageUrl, targetAudience );
            if (!result) {
                throw new Error("Failed to upload Banner data to DB");
            }
            console.log("Inserted banner record to DB", result)

            const responseData = {
                id: result.id,
                title,
                type, 
                targetAudience,
                imageUrl
            }
            console.log("Logging banner upload controller response", responseData);
            
            res.status(201).send(Response.success(responseData, "banner created successfully", null));

        } catch (error) {
            console.log("Failed executing [createBanner] controller", title, type, targetAudience, error);
            res.status(401).send(Response.error(error.message));
            
        }
    }

    /**
     * 
     * @route DELETE /api/v1/banner/delete-banner/:id
     * @group Banner - Operation related to Banner
     * @param {number} req.params.id  params
     * @returns 200 OK when deleted
    */
    async deleteBanner(req, res) {
        try {
            const id = req.params.id;
            const banner = await BannerService.getBannerByID(id);
            if (!banner) {
                throw new Error("No banner record found with the ID ", id);
            }
            
            const objectKey = banner.object_key;
            const deleteImageRes = await AWS.deleteFromS3(objectKey);
            if (!deleteImageRes) {
                throw new Error("Error deleting AWS S3 object");
            }

            const deleteRecordRes = await BannerService.deleteBannerByID(id);
            if (!deleteRecordRes) {
                throw new Error("Error deleting record from DB");
            }

            console.log("Succesfully finished executing delete banner controller", deleteRecordRes, deleteImageRes);
            res.status(201).send(Response.success(null, "banner deleted successfuly", null));
            
        } catch (error) {
            console.log("Failed executing [deleteBanner] controller", error);
            res.status(401).send(Response.error(error.message)); 
        }

    }

    /**
     * PATCH /api/v1/banner/update-banner/:id
     * @group Banner - Operation related to Banner
     * @param {number} req.params.id  params
     * @param {Object} req.body  the data to update the Table
     * @returns 200 OK when deleted
     * @param {*} res 
     */
    async updateBanner(req, res) {
        const id = req.params.id;
        const params =req.body;
        try {
            console.log("recieved update request", id, params);
            if (!id) {
                throw new Error("Invalid request ID not supplied");
            }
    
            const banner = await BannerService.getBannerByID(id);
            if (!banner) {
                throw new Error("No banner record found with the ID ", id);
            }
            
            const result = await BannerService.updateBannerByID(id, params);
            if (!result) {
                throw new Error("Error updating the banner in update banner controller");
            }
            console.log("Updated banner result ", result);

            res.status(200).send(Response.success(null, "banner updated successfuly", null));
        } catch (error) {
            console.log("Failed executing [updateBanner] controller", id, params, error);
            res.status(401).send(Response.error(error.message)); 
        }
    }


    /**
     * GET /api/v1/banner/get-banners
     * @group Banner - Operation related to Banner
     * @returns 200 Returns the Array of obtained banner results
     */
    async getAllBanners(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page for the banners
            const bannerCount = await BannerService.getTotalBannersCount();
            const banners = await BannerService.getAllBanners(page, limit) || [];

            res.status(200).send(Response.success(banners, "banner obtained successfully", { 
                "current_page": page,
                "next_page": Math.ceil(bannerCount / limit) == page ? 1 : page + 1,
                "total_pages": Math.ceil(bannerCount / limit),
                "total_rows": bannerCount,
                "limit": limit,
            }));

        } catch (error) {
            console.log("Failed executing [getAllBanners] controller", error);
        }
    }
}

module.exports = new BannerController();