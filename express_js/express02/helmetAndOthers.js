const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // فقط منابع از همین سرور
            scriptSrc: ["'self'", "https://code.jquery.com"], // اجازه برای بارگذاری اسکریپت از CDN جیکوئری
        },
    })
);

app.use(express.static("public")); // فایل‌های استاتیک از پوشه public ارائه شوند

app.use(express.json()); // پشتیبانی از JSON
app.use(express.urlencoded({ extended: false })); // پشتیبانی از فرم‌های ارسال‌شده

app.post("/ajax", (req, res) => {
    console.log(req.body);
    res.json("Test");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
