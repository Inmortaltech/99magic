const pool = require("../config/db");

exports.getCategoriesWithProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id AS category_id, c.name AS category_name, p.category_video AS category_video,
             p.id AS product_id, p.name AS product_name, p.image, p.price, p.rating, p.descriptions
      FROM category c
      LEFT JOIN products p ON c.id = p.category_id
      ORDER BY c.id, p.id
    `);

    // Transform result into nested structure
    const result = [];
    const map = {};
    const allProducts = []; 

    rows.forEach(row => {
      if (!map[row.category_id]) {
        map[row.category_id] = {
          category_id: row.category_id,
          category_name: row.category_name,
          // Add category_video URL if exists
          //category_video: row.category_video ? `https://99magics.com:8878/video/${row.category_video}` : null,
          products: []
        };
        result.push(map[row.category_id]);
      }

      if (row.product_id) {
        const product = {
          id: row.product_id,
          name: row.product_name,
          price: row.price,
		  descriptions: row.descriptions,
		  rating: row.rating,
          // Construct image URL
          image: row.image ? `https://99magics.com:8878/uploads/${row.image}` : null,
		      category_video: row.category_video ? `https://99magics.com:8878/uploads/${row.category_video}` : null,
        };

        map[row.category_id].products.push(product);
        allProducts.push(product); 
      }
    });

    res.json({
      categories: result,   // nested structure with video
      allProducts: allProducts // flat product list
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add product to cart
exports.addToCart1 = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "user_id and product_id are required" });
    }

    // Check if product already in cart for this user
    const [rows] = await pool.query(
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (rows.length > 0) {
      // Update quantity if product already in cart
      await pool.query(
        "UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity || 1, user_id, product_id]
      );
    } else {
      // Insert new product in cart
      await pool.query(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity || 1]
      );
    }
    res.json({ message: "Product added to cart successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "user_id and product_id are required" });
    }

    // Check if product already exists in user's cart
    const [rows] = await pool.query(
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (rows.length > 0) {
      // Product already exists, do NOT add again
      return res.status(201).json({
        success: false,
        message: "Product already exists in cart"
      });
    }

    // Insert new product in cart
    await pool.query(
      "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, quantity || 1]
    );

    res.json({ success: true, message: "Product added to cart" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get cart items for a user
exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.body; // now from form-data

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Base URL for product images
    const BASE_URL = "https://99magics.com:8878/uploads/";

  const [rows] = await pool.query(
  `SELECT 
      c.id AS cart_id,
      c.quantity,
      p.id AS product_id,
      p.name AS product_name,
      p.price AS product_price,
      CONCAT(?, p.image) AS product_image,
      u.id AS user_id,
      u.name AS name,
      u.mobile AS mobile,
      u.email AS email
   FROM carts c
   JOIN products p ON c.product_id = p.id
   JOIN users u ON c.user_id = u.id
   WHERE c.user_id = ?`,
  [BASE_URL, user_id]
);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    await pool.query("DELETE FROM carts WHERE user_id = ? AND product_id = ?", [
      user_id,
      product_id
    ]);
    res.json({ message: "Product removed from cart", status:'true' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Helper function to generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// Fake SMS sender (replace with real SMS service)
const sendOtpSms = (mobile, otp) => {
  console.log(`Sending OTP ${otp} to mobile ${mobile}`);
  return true;
};

// Send or update OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: "Mobile number is required" });

    const otp = generateOtp();

    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE mobile = ?', [mobile]);

    if (user.length > 0) {
      // Update OTP
      await pool.query('UPDATE users SET otp = ?, otp_verified = 0 WHERE mobile = ?', [otp, mobile]);
    } else {
      // Insert new user
      await pool.query('INSERT INTO users (mobile, otp) VALUES (?, ?)', [mobile, otp]);
    }

    // Send OTP via SMS
    sendOtpSms(mobile, otp);

      res.json({ message: 'OTP sent successfully', otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ message: "Mobile and OTP are required" });

    const [user] = await pool.query('SELECT * FROM users WHERE mobile = ? AND otp = ?', [mobile, otp]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark OTP as verified
    await pool.query('UPDATE users SET otp_verified = 1 WHERE mobile = ?', [mobile]);
    res.json({ 
		 message: 'OTP verified successfully', 
		 'status': 'true',
		 'user_id': user[0].id
	});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', status: 'false' });
  }
};
