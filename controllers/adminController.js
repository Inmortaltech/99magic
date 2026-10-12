const bcrypt = require("bcrypt");
const pool = require("../config/db");

// Add category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const [exists] = await pool.query(
      'SELECT id FROM category WHERE name = ? LIMIT 1',
      [name]
    );

    if (exists.length > 0) {
      return res.status(409).json({
        message: "Tricks category already exist",
        status: false
      });
    }

    // Insert if not exists
    await pool.query(
      'INSERT INTO category (name, is_active) VALUES (?, ?)',
      [name, 1]
    );

    return res.status(200).json({
      message: 'Added Successfully',
      status: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
};


// Add video
exports.addVideo = async (req, res) => {
  try {
    const {
      category_id,
      name,
      price,
      unique_no,
      //description,
      rating,
	 descriptions 
    } = req.body;

    const image = req.files.image ? req.files.image[0].filename : null;
    const category_video = req.files.category_video ? req.files.category_video[0].filename : null;
    const tutorial_video = req.files.tutorial_video ? req.files.tutorial_video[0].filename : null;

    const videoBaseUrl = "https://99magics.com:8878/uploads/";
    const imageBaseUrl = "https://99magics.com:8878/uploads/";

    const savedImage = image ? image : null;
    const savedCategoryVideo = category_video ? category_video : null;
    const savedTutorialVideo = tutorial_video ? tutorial_video : null;

    const [result] = await pool.query(
      `INSERT INTO products 
      (category_id, name, price, image, category_video, tutorial_video, unique_no, descriptions, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        price,
        savedImage,
        savedCategoryVideo,
        savedTutorialVideo,
        unique_no,
        descriptions,
        rating
      ]
    );

    return res.status(200).json({
      message: "Added Successfully",
      status: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

exports.getAllVideo = async (req, res) => {
	try {
    const [rows] = await pool.query(`
      SELECT c.id AS category_id, c.name AS category_name, p.category_video AS category_video,
             p.id AS product_id, p.name AS product_name, p.image, p.price, p.rating, p.descriptions, p.tutorial_video, p.price, p.created_at
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
      products: []
    };
    result.push(map[row.category_id]);
  }

  if (row.product_id) {
    const product = {
      id: row.product_id,
	  category_id:row.category_id,
      name: row.product_name,
      price: row.price,
      descriptions: row.descriptions,
      rating: row.rating,
      created_at: row.created_at,

      // Add category_name per product
      category_name: row.category_name,

      // Construct URLs
      image: row.image ? `https://99magics.com:8878/uploads/${row.image}` : null,
      performance_video: row.category_video ? `https://99magics.com:8878/uploads/${row.category_video}` : null,
      tutorial_video: row.tutorial_video ? `https://99magics.com:8878/uploads/${row.tutorial_video}` : null,
    };

    map[row.category_id].products.push(product);
    allProducts.push(product);
  }
});

    res.json({
      //categories: result,   // nested structure with video
      allProducts: allProducts // flat product list
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTotalRecords = async (req, res) => {
  try {
    //  Total Users (COUNT UNIQUE MOBILE)
const [totalUsersRow] = await pool.query(
  "SELECT COUNT(DISTINCT mobile) AS totalUsers FROM users WHERE otp_verified = 1"
);


    // Total Videos like getAllVideo
	const [totalVideosRow] = await pool.query(`
	  SELECT COUNT(p.id) AS totalVideos
	  FROM category c
	  LEFT JOIN products p ON c.id = p.category_id
	  WHERE p.id IS NOT NULL
	`);

    // Total Purchased (payments)
    const [totalPurchasedRow] = await pool.query(
      "SELECT COUNT(*) AS totalPurchased FROM payments WHERE status IN ('paid', 'success')"
    );

    //  Total Booked Events (UNIQUE MOBILE)
    //const [totalBookedEventRow] = await pool.query(
     // `SELECT COUNT(DISTINCT mobile) AS totalBookedEvents
      /// FROM users
       //WHERE event_type IS NOT NULL AND event_type != ''`
   // );
	
	const [totalBookedEventRow] = await pool.query(
  `SELECT COUNT(*) AS totalBookedEvents 
   FROM users 
   WHERE event_type IS NOT NULL AND event_type != ''`
);



    return res.json({
      success: true,
      totals: {
        totalUsers: totalUsersRow[0].totalUsers,
        totalVideos: totalVideosRow[0].totalVideos,
        totalPurchased: totalPurchasedRow[0].totalPurchased,
        totalBookedEvents: totalBookedEventRow[0].totalBookedEvents
      }
    });

  } catch (error) {
    console.error("Error in getTotalRecords API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



exports.getAllEventList1 = async (req, res) => {
  try {
    // Fetch all users with event fields
    const [rows] = await pool.query(
      "SELECT name, email, event_type, created_at, address, mobile, company_name FROM users ORDER BY id DESC"
    );

    const today = new Date().setHours(0, 0, 0, 0);

const eventList = rows.map((row) => {
  let status = "";

  // If there's no date → completed by default
  if (!row.created_at) {
    status = "completed";
  } else {
    const eventDate = new Date(row.created_at).setHours(0, 0, 0, 0);
    // Compare event date with today's date
    if (eventDate >= today) {
      status = "active";
    } else {
      status = "completed";
    }
  }

  return {
    name: row.name,
    email: row.email,
    event_type: row.event_type,
    created_at: row.created_at,
    address: row.address,
	contact_no: row.mobile,
	company_name: row.company_name,
    status: status,
  };
});

    return res.json({
      success: true,
      events: eventList,
    });
  } catch (error) {
    console.error("Error in getEventList API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllEventList = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT name, email, event_type, created_at, address, mobile, company_name
       FROM users
       WHERE event_type IS NOT NULL AND event_type != ''
       ORDER BY id DESC`
    );

    const today = new Date().setHours(0, 0, 0, 0);

    const eventList = rows.map((row) => {
      let status = "";

      if (!row.created_at) {
        status = "completed";
      } else {
        const eventDate = new Date(row.created_at).setHours(0, 0, 0, 0);
        status = eventDate >= today ? "active" : "completed";
      }

      return {
        name: row.name,
        email: row.email,
        event_type: row.event_type,
        created_at: row.created_at,
        address: row.address,
        contact_no: row.mobile,
        company_name: row.company_name,
        status: status,
      };
    });

    return res.json({
      success: true,
      events: eventList,
    });
  } catch (error) {
    console.error("Error in getEventList API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.deleteVideos = async (req, res) => {
  try {
    const { id } = req.body; // ID from form-data
    if (!id) {
      return res.status(201).json({
        success: false,
        message: "ID is required",
      });
    }

    // Delete record by ID
    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(201).json({
        success: false,
        message: "No product found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.editVideo = async (req, res) => {
  try {
    const {
      id,
      category_id,
      name,
      price,
      unique_no,
      descriptions,
      rating
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Product ID is required"
      });
    }

    //=========== GET EXISTING PRODUCT ===========//
    const [oldData] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (oldData.length === 0) {
	  return res.status(404).json({
		status: false,
		message: "Product not found"
	  });
    }

    const oldProduct = oldData[0];

    //=========== FILE HANDLING ===========//
    const image = req.files?.image ? req.files.image[0].filename : oldProduct.image;
    const category_video = req.files?.category_video ? req.files.category_video[0].filename : oldProduct.category_video;
    const tutorial_video = req.files?.tutorial_video ? req.files.tutorial_video[0].filename : oldProduct.tutorial_video;

    //=========== UPDATE QUERY ===========//
    const updateQuery = `
      UPDATE products SET
        category_id = ?,
        name = ?,
        price = ?,
        image = ?,
        category_video = ?,
        tutorial_video = ?,
        unique_no = ?,
        descriptions = ?,
        rating = ?
      WHERE id = ?
    `;

    await pool.query(updateQuery, [
      category_id || oldProduct.category_id,
      name || oldProduct.name,
      price || oldProduct.price,
      image,
      category_video,
      tutorial_video,
      unique_no || oldProduct.unique_no,
      descriptions || oldProduct.descriptions,
      rating || oldProduct.rating,
      id
    ]);
	
    return res.status(200).json({
      status: true,
      message: "Product updated successfully"
    });
	
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Failed to update product",
      error: err.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.body; // ID from form-data
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "ID is required",
      });
    }

    // Delete record by ID
    const [result] = await pool.query(
      "DELETE FROM category WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No category found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "category deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.paymentHistory = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*, 
        MAX(u.name) AS name,
        MAX(u.email) AS email,
        MAX(u.address) AS address,
        MAX(u.mobile) AS mobile
      FROM payments p
      LEFT JOIN users u 
        ON p.mobile COLLATE utf8mb4_general_ci = u.mobile COLLATE utf8mb4_general_ci
      WHERE p.status IN ('paid', 'success')
      GROUP BY p.id
      ORDER BY p.id DESC
    `;

    const [rows] = await pool.query(query);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




exports.getRegisterUser = async (req, res) => {
  try {
   const query = `
  SELECT u.*
  FROM users u
  INNER JOIN (
    SELECT mobile, MAX(id) AS max_id
    FROM users
    WHERE otp_verified = 1
    GROUP BY mobile
  ) t ON u.id = t.max_id
  WHERE u.otp_verified = 1
  ORDER BY u.id DESC
`;

    const [rows] = await pool.query(query);
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
