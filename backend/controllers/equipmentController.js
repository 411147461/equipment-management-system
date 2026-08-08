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
const createEquipment = async (req, res) => {

    try {

        const { name, category, status, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "設備名稱為必填"
            });
        }

        const equipmentId = await equipmentModel.createEquipment({
            name,
            category,
            status,
            description
        });

        res.status(201).json({
            message: "設備新增成功",
            id: equipmentId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "新增設備失敗"
        });
    }
};
module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment
};