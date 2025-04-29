const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const blogRouter = require("./routes/blogs");
const likeRouter = require("./routes/like");

const app = express();

// ✅ تنظیمات میدلورها
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ✅ مسیرهای API
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/like", likeRouter);

// ✅ مدیریت خطاهای 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, msg: "Route not found!" });
});

// ✅ مدیریت خطاهای سرور
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, msg: "Server error", error: err.message });
});

module.exports = app;