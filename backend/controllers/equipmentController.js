const equipmentModel = require("../models/equipmentModel");

const getAllEquipment = async (req, res) => {

    try {

        const equipments = await equipmentModel.getAllEquipment();

        res.json(equipments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "取得設備資料失敗"
        });
    }
};
const getEquipmentById = async (req, res) => {

    try {

        const equipment = await equipmentModel.getEquipmentById(
            req.params.id
        );

        if (!equipment) {
            return res.status(404).json({
                message: "找不到此設備"
            });
        }

        res.json(equipment);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "取得設備資料失敗"
        });
    }
};
// 新增設備
const createEquipment = async (req, res) => {

    try {

        // 從 Request Body 取得設備資料
        const {
            name,
            category,
            status,
            description
        } = req.body;

        // 檢查設備名稱是否存在
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "設備名稱為必填"
            });
        }

        // 檢查設備分類是否存在
        if (!category || category.trim() === "") {
            return res.status(400).json({
                message: "設備分類為必填"
            });
        }

        // 定義設備允許使用的狀態
        const allowedStatus = ["available", "borrowed"];

        // 檢查 status 是否為合法值
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "設備狀態只能是 available 或 borrowed"
            });
        }

        // 將資料交給 Model 寫入資料庫
        const equipmentId = await equipmentModel.createEquipment({
            name: name.trim(),
            category: category.trim(),
            status,
            description: description || ""
        });

        // 新增成功，HTTP 201 表示 Created
        res.status(201).json({
            message: "設備新增成功",
            id: equipmentId
        });

    } catch (error) {

        // 將錯誤輸出到 Server Console
        console.error(error);

        // 回傳伺服器錯誤
        res.status(500).json({
            message: "新增設備失敗"
        });
    }
};
// 修改指定 ID 的設備
const updateEquipment = async (req, res) => {

    try {

        // 從網址取得設備 ID
        // 例如 /equipment/4 → id 就是 "4"
        const { id } = req.params;

        // 從 Request Body 取得要修改的資料
        const {
            name,
            category,
            status,
            description
        } = req.body;

        // 檢查設備名稱是否存在
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "設備名稱為必填"
            });
        }

        // 檢查設備分類是否存在
        if (!category || category.trim() === "") {
            return res.status(400).json({
                message: "設備分類為必填"
            });
        }

        // 定義設備允許使用的狀態
        const allowedStatus = ["available", "borrowed"];

        // 檢查 status 是否為合法值
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "設備狀態只能是 available 或 borrowed"
            });
        }

        // 將資料交給 Model 修改資料庫
        const affectedRows = await equipmentModel.updateEquipment(
            id,
            {
                name: name.trim(),
                category: category.trim(),
                status,
                description: description || ""
            }
        );

        // 如果沒有修改任何資料，代表找不到這個 ID
        if (affectedRows === 0) {
            return res.status(404).json({
                message: "找不到此設備"
            });
        }

        // 修改成功
        res.json({
            message: "設備修改成功"
        });

    } catch (error) {

        // 將錯誤輸出到 Server Console
        console.error(error);

        // 回傳伺服器錯誤
        res.status(500).json({
            message: "修改設備失敗"
        });
    }
};
// 刪除指定 ID 的設備
const deleteEquipment = async (req, res) => {

    try {

        // 從網址取得設備 ID
        // 例如 /equipment/4 → id 就是 "4"
        const { id } = req.params;

        // 呼叫 Model 刪除設備
        const affectedRows = await equipmentModel.deleteEquipment(id);

        // 如果沒有刪除任何資料，代表找不到這個設備
        if (affectedRows === 0) {
            return res.status(404).json({
                message: "找不到此設備"
            });
        }

        // 刪除成功
        res.json({
            message: "設備刪除成功"
        });

    } catch (error) {

        // 將錯誤印在 Server Console
        console.error(error);

        // 回傳伺服器錯誤
        res.status(500).json({
            message: "刪除設備失敗"
        });
    }
};
module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};