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

module.exports = {
    getAllEquipment
};