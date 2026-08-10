// =========================
// Borrow Routes
// =========================

// 載入 Express
const express = require("express");

// 建立 Router
const router = express.Router();


// =========================
// 載入 Middleware
// =========================

// JWT 驗證
// 確認使用者是否已經登入
const {
    authenticateToken
} = require("../middleware/authMiddleware");


// 權限驗證
// 用來限制 admin 才能查看所有借用紀錄
const {
    requireRole
} = require("../middleware/roleMiddleware");


// =========================
// 載入 Controller
// =========================

const borrowController =
    require("../controllers/borrowController");


// =========================
// POST /borrow/:equipmentId
// =========================
// 借用指定設備
//
// 只要登入即可借用
//
// 例如：
// POST /borrow/1
//
// 代表借用 ID = 1 的設備

router.post(
    "/:equipmentId",
    authenticateToken,
    borrowController.borrowEquipment
);
// =========================
// POST /borrow/:borrowId/return
// =========================
// 歸還自己的設備
//
// 需要登入
//
// 例如：
// POST /borrow/1/return
//
// 代表歸還 borrow_records ID = 1 的紀錄

router.post(
    "/:borrowId/return",
    authenticateToken,
    borrowController.returnEquipment
);

// =========================
// GET /borrow/my
// =========================
// 查看自己的借用紀錄
//
// 只有登入使用者可以查看
//
// JWT 中的 user ID
// 會決定可以看到哪些紀錄

router.get(
    "/my",
    authenticateToken,
    borrowController.getMyBorrows
);


// =========================
// GET /borrow
// =========================
// 查看所有借用紀錄
//
// 只有 admin 可以使用

router.get(
    "/",
    authenticateToken,
    requireRole("admin"),
    borrowController.getAllBorrows
);


// =========================
// 匯出 Router
// =========================

module.exports = router;