const express = require("express");
const router = express.Router();
const multer = require("multer");
const magicController = require("../controllers/magicController");
const upload = multer();

// API to get categories with products
router.get("/categories-products", magicController.getCategoriesWithProducts);
// Add product to cart (form-data)
router.post("/add_cart", upload.none(), magicController.addToCart);

// Get cart items for a specific user (user_id from form-data)
router.post("/get_cart", upload.none(), magicController.getCart);

// Remove product from cart (form-data)
router.post("/remove_item", upload.none(), magicController.removeFromCart);


router.post('/send-otp', upload.none(), magicController.sendOtp);
router.post('/verify-otp', upload.none(), magicController.verifyOtp);

module.exports = router;


