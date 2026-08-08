const express = require("express");
const router = express.Router();

const equipmentController = require("../controllers/equipmentController");

// 載入設備資料驗證 Middleware
const validateEquipment = require("../middleware/validateEquipment");

// GET /equipment
// 取得所有設備
router.get("/", equipmentController.getAllEquipment);

// GET /equipment/:id
// 取得單一設備
router.get("/:id", equipmentController.getEquipmentById);

// POST /equipment
// 先驗證資料，再新增設備
router.post(
    "/",
    validateEquipment,
    equipmentController.createEquipment
);

// PUT /equipment/:id
// 先驗證資料，再修改設備
router.put(
    "/:id",
    validateEquipment,
    equipmentController.updateEquipment
);

// DELETE /equipment/:id
// 刪除指定設備
router.delete("/:id", equipmentController.deleteEquipment);

module.exports = router;