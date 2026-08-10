// =========================
// User Routes
// =========================

const express = require("express");

// 建立 Router
const router = express.Router();

// 載入 User Controller
const {
    register,
    login
} = require("../controllers/userController");


// =========================
// 使用者註冊
// =========================

// POST /users/register
router.post(
    "/register",
    register
);

// =========================
// 使用者登入
// =========================

// POST /users/login
router.post(
    "/login",
    login
);

// 匯出 Router
module.exports = router;