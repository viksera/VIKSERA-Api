const BannerModel = require("../models/banner");
const { error } = require("../utils/response");

class Banner {

    /**
     * inser the banner data into the DB
     * @param {string} title 
     * @param {string} objectKey 
     * @param {string} type 
     * @param {string} imageUrl 
     * @param {'business' | 'marketing agency' | 'influencer' |'all'} targetAudience 
     * @returns {Promise<boolean>}
     */
    async insertBannerData(title, objectKey, type = '', imageUrl, targetAudience = 'all') {
        try {
            const newBanner = await BannerModel.create ({
                title: title,
                object_key: objectKey,
                type: type,
                image_url: imageUrl,
                target_audience: targetAudience,
                expires_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // Expires in 30 days
                status: true,
            });
            console.log('[insertBannerData] New banner created:', newBanner.toJSON());
            return {data:newBanner.toJSON(), error: null};

        } catch (error) {
            console.log("[insertBannerData] Failed to upload banner into DB",title, type, imageUrl, targetAudience, error);
            return {data: null, error};
        }

    }

    /**
     * Get the banner by ID from DB
     * @param {string} id 
     * @returns 
     */
    async getBannerByID(id) {
        try {
            const banner = await BannerModel.findByPk(id);
            if (!banner) {
                throw new Error("No record found with the ID", id);
            }
            console.log('[getBannerByID] Banner found:', banner.toJSON());
            return  {data: banner.toJSON(), error: null};
        } catch (error) {
            console.log("[getBannerByID] Error in getting the Banner Data from DB", error);
            return {data: null, error};
        } 


    }

    /**
     * Delete the banner BY ID . deletes the record from DB
     * @param {number} id 
     * @returns 
     */
    async deleteBannerByID(id) {
        try {
            const res = await BannerModel.destroy({
                where: {
                    id: id,
                },
            });
            
            console.log("[deleteBannerByID] deleted the record from the DB", res);
            return {data: res, error: null};

        } catch (error) {
            console.log("[deleteBannerByID] Error in deleting the Banner Data from DB", error);
            return {data: null, error};
        }
    }

    // * @typedef {Object} User
    // * @property {string} id - The unique identifier for the user.
    // * @property {string} name - The name of the user.
    // * @property {string} email - The email address of the user.
    
    /**
     * @typedef {Object} updateDataJSON
     * @property {string} title
     * @property {string} type
     * @property {string} target_audience
     * @property {boolean} status
     * @param {number} id 
     * @param {updateDataJSON} updateData 
     * @returns 
     */
    async updateBannerByID(id, updateData) {
        console.log((updateData,{
            where: {
                id: id,
            },
        }))
        try {
            const result = await BannerModel.update(updateData,{
                where: {
                    id: id,
                },
            });
            console.log("[updateBannerByID] Update query result", result);
            if (!(result[0] > 0)) {
                throw new Error("Failed to update the banner records", id, updateData);
            } 
            return {data: result, error: null};

        } catch (error) {
            console.log("[updateBannerByID] error in updating the banner by ID", error);
            return {data: null, error: error};
        }
    }
    
    /**
     * Get all the banners with paginated results
     * @param {number} page 
     * @param {number} limit 
     * @param { "all" | "true" | "false"} status
     */
    async getAllBanners(page = 1, limit, status) {
        try {
            const options = {
                offset: (page - 1) * (limit || 0)
            };
            if (status != null) {
                options.where = {
                    status: status
                };
            }

            if (limit){
                options.limit = limit;
            }
            
            const banners = await BannerModel.findAll(options);
            return {data: banners, error: null};


        } catch (error) {
            console.log("[getAllBanners] Error in dettting the Banner Data from DB", error);
            return {data: null, error: error};
        }
    }

    /**
     * To find the total number of banners in the DB
     * @returns the total Banner count 
     */
    async getTotalBannersCount(status) {
        try {
            let options = {};
            if (status != null) {
                options.where = {
                    status: status
                }
            }
            const banners = await BannerModel.count(options);
            console.log("[getTotalBannersCount] obtained all banners count ", banners);
                return {data: banners, error:null};

        } catch (error) {
            console.log("[getTotalBannersCount] Error in getting the Banner count Data from DB", error);
            return {data: null, error: error};
        }
    }
}

module.exports = new Banner();