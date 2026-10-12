const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Add User
exports.createUser1 = async (req, res) => {
  try {
    const { mobile, password, email, name } = req.body;

    // Check if mobile already exists
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE mobile = ?',
      [mobile]
    );

    if (existingUser.length > 0) {
      return res.status(200).json({
        status: false,
        message: 'Mobile number already exists'
      });
    }

    let hashedPassword = null;
    let showPassword = null;
    // Hash password ONLY if provided
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
      showPassword = password;
    }

    // Insert user (password optional)
    await pool.query(
      `INSERT INTO users (mobile, password, show_password, email, name)
       VALUES (?, ?, ?, ?, ?)`,
      [mobile, hashedPassword, showPassword, email, name]
    );

    return res.status(200).json({
      status: true,
      message: 'New user created successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: 'Failed to create user'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { mobile, password, email, name } = req.body;

    if (!mobile) {
      return res.status(200).json({
        status: false,
        message: "Mobile number is required"
      });
    }

    // Check if mobile exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE mobile = ?",
      [mobile]
    );

    let hashedPassword = null;
    let showPassword = null;

    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
      showPassword = password;
    }

    //  IF USER EXISTS → UPDATE
    if (existingUser.length > 0) {
      await pool.query(
        `UPDATE users 
         SET password = ?, 
             show_password = ?, 
             email = ?, 
             name = ?
         WHERE mobile = ?`,
        [hashedPassword, showPassword, email, name, mobile]
      );

      return res.status(200).json({
        status: true,
        message: "User updated successfully"
      });
    }
    await pool.query(
      `INSERT INTO users (mobile, password, show_password, email, name)
       VALUES (?, ?, ?, ?, ?)`,
      [mobile, hashedPassword, showPassword, email, name]
    );

    return res.status(200).json({
      status: true,
      message: "New user created successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Failed to create or update user"
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
		const { mobile, password } = req.body;
		if (!mobile || !password) {
		  return res.status(200).json({ 
			message: "Mobile and password are required",
			status: "false"
		  });
		}

		const [users] = await pool.query(
		  "SELECT * FROM users WHERE mobile = ? LIMIT 1",
		  [mobile]
		);

		if (users.length === 0) {
		  return res.json({ message: "User not exists", status: "false" });
		}

		const user = users[0];
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
		  return res.json({ message: "Invalid credentials", status: "false" });
		}

		res.json({
		  userid: user.id,
		  mobile: user.mobile,
		  status: "true",
		  message: "Login Successfully!"
		});
	} catch (error) {
		console.error("Login Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};


// Add User
exports.submitUserDetail1 = async (req, res) => {
  try {
    const { user_name, mobile_no, address, date_time, event_type, company_name, email } = req.body;

    const [result] = await pool.query(
      'INSERT INTO users (name, mobile, address, date_time, event_type, company_name, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ user_name, mobile_no, address, date_time, event_type, company_name, email]
    );
	
    return res.status(200).json({ message: 'Added Successfully', status:true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create or update user' });
  }
};

// Add / Update User
exports.submitUserDetail = async (req, res) => {
  try {
    const {
      user_name,
      mobile_no,
      address,
      date_time,
      event_type,
      company_name,
      email
    } = req.body;

    //if (!mobile_no) {
      //return res.status(200).json({
       // status: false,
       // message: "Mobile number is required"
     // });
    //}
	if (!mobile_no || !event_type) {
	  return res.status(200).json({
		status: false,
		message: "Mobile number and event type are required"
	  });
	}



    // Check if mobile exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE mobile = ?",
      [mobile_no]
    );

    //  IF EXISTS → UPDATE
    if (existingUser.length > 0) {
      await pool.query(
        `UPDATE users
         SET name = ?,
             address = ?,
             date_time = ?,
             event_type = ?,
             company_name = ?,
             email = ?
         WHERE mobile = ?`,
        [user_name, address, date_time, event_type, company_name, email, mobile_no]
      );

      return res.status(200).json({
        status: true,
        message: "Updated successfully"
      });
    }

    //  IF NOT EXISTS → INSERT
    await pool.query(
      `INSERT INTO users 
       (name, mobile, address, date_time, event_type, company_name, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_name, mobile_no, address, date_time, event_type, company_name, email]
    );

    return res.status(200).json({
      status: true,
      message: "Added successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Failed to create or update user"
    });
  }
};



exports.getUserPurchasedProducts = async (req, res) => {
    try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(201).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Fetch all paid orders for given mobile number
    const query = `
      SELECT 
        p.order_id AS OrderID,
        p.created_at AS Date,
        p.status AS Status,
        p.amount AS Amount,
        pr.category_video AS VideoFile,
		 pr.tutorial_video AS tutorial_video,
        pr.name AS product_title,
        pr.descriptions AS description,
        pr.image AS product_image
      FROM payments p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.mobile = ? AND LOWER(p.status) = 'paid'
      ORDER BY p.created_at DESC
    `;

    const [rows] = await pool.query(query, [mobile]);

    if (rows.length === 0) {
      return res.status(201).json({
        success: false,
        message: "No paid orders found for this mobile number",
      });
    }

    // Base URLs for video & image
    const videoBaseUrl = "https://99magics.com:8878/uploads/";

    const imageBaseUrl = "https://99magics.com:8878/uploads/";

    // Format response data
    const data = rows.map((row) => ({
      OrderID: row.OrderID,
      Date: row.Date,
      Status: row.Status,
      Amount: row.Amount,
      product_title: row.product_title,
      description: row.description,
      productImage: row.product_image ? `${imageBaseUrl}${row.product_image}` : null,
      performance_Video: row.VideoFile ? `${videoBaseUrl}${row.VideoFile}` : null,
	  tutorial_Video: row.VideoFile ? `${videoBaseUrl}${row.tutorial_video}` : null,
    }));

    return res.status(200).json({
      success: true,
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

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// Fake SMS sender (replace with real SMS service)
const sendOtpSms1 = (mobile, otp) => {
  console.log(`Sending OTP ${otp} to mobile ${mobile}`);
  return true;
};

// Send or update OTP
exports.sendOtpValue1 = async (req, res) => {
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



const sendOtpSms = require("../utils/sendOtpSms");

// Send OTP only if user exists
exports.sendOtpValue = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(201).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    //  Check user exists
    const [users] = await pool.query(
      "SELECT id FROM users WHERE mobile = ? LIMIT 1",
      [mobile]
    );

    if (users.length === 0) {
      return res.status(201).json({
        success: false,
        message: "User does not exist"
      });
    }

    //  Generate OTP
    const otp = generateOtp();

    //  Update OTP for existing user
    await pool.query(
      "UPDATE users SET otp = ?, otp_verified = 0 WHERE mobile = ?",
      [otp, mobile]
    );

    //  Send OTP SMS
    const smsResult = await sendOtpSms(mobile, otp);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: "OTP SMS failed",
        reason: smsResult.reason
      });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully"
      //  do NOT send OTP in response (security)
    });

  } catch (err) {
    console.error("sendOtpValue error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



exports.verifyOtpAndChangePassword = async (req, res) => {
  try {
    const { mobile, otp, new_password } = req.body;

    if (!mobile || !otp || !new_password) {
      return res.status(200).json({ message: "Mobile, OTP and new password are required" });
    }

    // Check user with OTP
    const [users] = await pool.query(
      "SELECT id FROM users WHERE mobile = ? AND otp = ?",
      [mobile, otp]
    );

    if (users.length === 0) {
      return res.status(200).json({ message: "Invalid OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password + clear OTP + verify flag
    await pool.query(
      "UPDATE users SET password = ?, show_password = ?, otp = NULL, otp_verified = 1 WHERE mobile = ?",
      [hashedPassword, new_password, mobile]
    );

    res.json({ message: "Password successfully updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.sendOtpUsers = async (req, res) => {
	try {
		const { mobile } = req.body;
		if (!mobile) return res.status(200).json({ message: "Mobile number is required" });

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

}


exports.verifyUsersOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(200).json({
        message: "Mobile number and OTP are required",
		status: false
      });
    }

    // Check mobile + OTP together
    const [rows] = await pool.query(
      "SELECT id, otp FROM users WHERE mobile = ? AND otp = ?",
      [mobile, otp]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        message: "Invalid mobile number or OTP",
		status: false
      });
    }

    // Optional: clear OTP after verification
    await pool.query(
      "UPDATE users SET otp = NULL, otp_verified = 1 WHERE mobile = ?",
      [mobile]
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      user_id: rows[0].id,
	  status: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
	  status: false
    });
  }
};



		
