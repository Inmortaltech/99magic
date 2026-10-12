const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post('/add-user', upload.none(), userController.createUser);
router.post('/submit_user_detail', upload.none(), userController.submitUserDetail);

//router.post("/add-user", userController.createUser);
router.post('/login_user', upload.none(), userController.loginUser);

router.post('/get_userpurchased_products', upload.none(), userController.getUserPurchasedProducts);

router.post('/generate_otp', upload.none(), userController.sendOtpValue);

router.post('/verify-otp-change-password', upload.none(), userController.verifyOtpAndChangePassword);

router.post('/send_otp_users', upload.none(), userController.sendOtpUsers)

router.post('/verify_users_otp', upload.none(), userController.verifyUsersOtp)

module.exports = router;
