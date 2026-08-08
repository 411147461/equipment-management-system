const express = require("express");
const router = express.Router();

const equipmentController = require("../controllers/equipmentController");

// GET /equipment
// 取得所有設備
router.get("/", equipmentController.getAllEquipment);

// GET /equipment/:id
// 取得單一設備
router.get("/:id", equipmentController.getEquipmentById);

// POST /equipment
// 新增設備
router.post("/", equipmentController.createEquipment);

// PUT /equipment/:id
// 修改指定設備
router.put("/:id", equipmentController.updateEquipment);

// DELETE /equipment/:id
// 刪除指定設備
router.delete("/:id", equipmentController.deleteEquipment);

module.exports = router;