require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

// ✅ بررسی اتصال دیتابیس
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => console.error("❌ Database connection failed:", error));

// ✅ راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});