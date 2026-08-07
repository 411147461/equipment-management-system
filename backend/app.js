// 載入 Express
const express = require("express");

// 建立 Express 應用程式
const app = express();

// 設定埠號
const PORT = 3000;

// 建立首頁 API
app.get("/", (req, res) => {
    res.send("Equipment Management System API");
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});