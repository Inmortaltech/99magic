const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db"); 
const bcrypt = require("bcrypt");


// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, mobile, product_id } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }
	const currency = "INR";
	
    const options = {
      amount: amount, // amount 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save to DB
    db.query(
      "INSERT INTO payments (order_id, amount, currency, status, mobile, product_id) VALUES (?, ?, ?, ?, ?, ?)",
      [order.id, amount, currency, "created", mobile, product_id],
      (err) => {
        if (err) console.error("DB Error:", err);
      }
    );

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
	
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      db.query(
        "UPDATE payments SET payment_id=?, signature=?, status='paid' WHERE order_id=?",
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Order History
exports.orderHistory = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Query to fetch order details + category video file name
    const query = `
      SELECT 
        p.order_id AS OrderID,
        p.created_at AS Date,
        p.status AS Status,
        p.amount AS Amount,
        pr.category_video AS VideoFile,
		pr.name AS product_title,
		pr.descriptions AS description,
		pr.image AS product_image
      FROM payments p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.mobile = ?
      ORDER BY p.created_at DESC
    `;

    const [rows] = await db.query(query, [mobile]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        // message: "No order history found for this mobile number",
      });
    }

    // Append base video URL to each result
    const baseUrl = "https://99magics.com:8878/uploads/"
	  const baseUrl1 = "https://99magics.com:8878/uploads/";
    const data = rows.map((row) => ({
      OrderID: row.OrderID,
      Date: row.Date,
      Status: row.Status,
      Amount: row.Amount,
	  product_title: row.product_title,
	  description: row.description,
	  productImage: row.VideoFile ? `${baseUrl1}${row.product_image}` : null,
      VideoUrl: row.VideoFile ? `${baseUrl}${row.VideoFile}` : null,
    }));

    return res.status(200).json({
      success: true,
      // message: "Order history retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


