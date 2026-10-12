const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminController = require("../controllers/adminController");

router.post('/add-category', upload.none(), adminController.addCategory);

//router.post('/add-video', upload.none(), adminController.addVideo);

router.post(
  '/add-video',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "category_video", maxCount: 1 },
    { name: "tutorial_video", maxCount: 1 }
  ]),
  adminController.addVideo
);


router.get("/get_all_video", adminController.getAllVideo);

router.get("/get_total_records", adminController.getTotalRecords);

router.get("/get_all_event", adminController.getAllEventList);

router.post('/add-category', upload.none(), adminController.addCategory);

router.post('/delete_videos', upload.none(), adminController.deleteVideos);

router.post(
  '/edit-video',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "category_video", maxCount: 1 },
    { name: "tutorial_video", maxCount: 1 }
  ]),
  adminController.editVideo
);

router.post('/delete_category', upload.none(), adminController.deleteCategory);

router.get("/payment_history", adminController.paymentHistory);

router.get("/get_register_user", adminController.getRegisterUser);


module.exports = router;


