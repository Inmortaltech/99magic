const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

/* ---------- GLOBAL CORS ---------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ---------- Required for new Express ---------- */
app.options(/.*/, cors());

app.use(bodyParser.json());
app.use(express.json());

/* ---------- IMAGE FOLDER WITH CORS ---------- */
app.use("/image", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, express.static("C:/inetpub/vhosts/magic_tricks/public/image"));

/* ---------- VIDEO FOLDER WITH CORS ---------- */
app.use("/video", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, express.static("C:/inetpub/vhosts/magic_tricks/public/video"));

/* ---------- ROUTES ---------- */
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const magicRoutes = require("./routes/magicRoutes");
app.use("/api", magicRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 8878;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
