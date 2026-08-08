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
module.exports = {
    getAllEquipment,
    getEquipmentById
};