const express=require('express')
const router=express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/' });

const BannerController = require("../../controllers/banner")


router.post("/upload-banner", upload.single("image"), BannerController.createBanner);

router.delete("/delete-banner/:id", BannerController.deleteBanner);

router.post("/update-banner/:id", BannerController.updateBanner);

router.get("/get-banners", BannerController.getAllBanners);


module.exports = router;