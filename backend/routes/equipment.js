// =========================
// Equipment Routes
// =========================

// 載入 Express
const express = require("express");

// 建立 Router
const router = express.Router();


// =========================
// 載入 Middleware
// =========================

// JWT 驗證 Middleware
// 用來確認使用者是否已登入
const {
    authenticateToken
} = require("../middleware/authMiddleware");


// 權限驗證 Middleware
// 用來確認使用者是否具有指定角色
const {
    requireRole
} = require("../middleware/roleMiddleware");


// 設備資料驗證 Middleware
// 檢查新增 / 修改設備時傳入的資料是否正確
const validateEquipment =
    require("../middleware/validateEquipment");


// =========================
// 載入 Controller
// =========================

const equipmentController =
    require("../controllers/equipmentController");


// =========================
// GET /equipment
// =========================
// 取得所有設備
//
// 目前先不要求登入
router.get(
    "/",
    equipmentController.getAllEquipment
);


// =========================
// GET /equipment/:id
// =========================
// 取得單一設備
//
// 目前先不要求登入
router.get(
    "/:id",
    equipmentController.getEquipmentById
);


// =========================
// POST /equipment
// =========================
// 新增設備
//
// 需要：
// 1. JWT Token
// 2. admin 權限
// 3. 設備資料驗證
router.post(
    "/",
    authenticateToken,
    requireRole("admin"),
    validateEquipment,
    equipmentController.createEquipment
);


// =========================
// PUT /equipment/:id
// =========================
// 修改設備
//
// 需要：
// 1. JWT Token
// 2. admin 權限
// 3. 設備資料驗證

router.put(
    "/:id",
    authenticateToken,
    requireRole("admin"),
    validateEquipment,
    equipmentController.updateEquipment
);

// =========================
// DELETE /equipment/:id
// =========================
// 刪除設備
//
// 需要：
// 1. JWT Token
// 2. admin 權限

router.delete(
    "/:id",
    authenticateToken,
    requireRole("admin"),
    equipmentController.deleteEquipment
);

// =========================
// 匯出 Router
// =========================

module.exports = router;