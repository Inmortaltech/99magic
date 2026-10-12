const pool = require("../config/db");

// User Model
const User = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
  const { name, email, mobile, password } = data;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
    [name, email, mobile, hashedPassword]
  );

  return { id: result.insertId, name, email, mobile };
},
};

module.exports = User;
