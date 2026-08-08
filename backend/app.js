const equipmentRoutes = require("./routes/equipment");

// 載入 Express
const express = require("express");

// 載入 CORS Middleware
// 允許前端網頁向後端 API 發送 Request
const cors = require("cors");

// 建立 Express 應用程式
const app = express();

app.use(express.json());

// 啟用 CORS
// 讓不同來源的前端可以存取 API
app.use(cors());

// 設定埠號
const PORT = 3000;

app.use("/equipment", equipmentRoutes);
// 首頁
app.get("/", (req, res) => {

    console.log(req.headers);

    res.send("Equipment Management System API");

});


// 關於我們
app.get("/about", (req, res) => {

    console.log(req.method);

    console.log(req.url);

    res.send("About Equipment Management System");

});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});