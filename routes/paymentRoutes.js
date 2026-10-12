const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const paymentController = require("../controllers/paymentController");

router.post('/create-order', upload.none(), paymentController.createOrder);
router.post('/verify-payment', upload.none(), paymentController.verifyPayment);
router.post('/order_history', upload.none(), paymentController.orderHistory);

module.exports = router;
