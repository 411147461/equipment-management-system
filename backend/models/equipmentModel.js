const db = require("../config/db");

const getAllEquipment = async () => {
    const [rows] = await db.query("SELECT * FROM equipment");

    return rows;
};

module.exports = {
    getAllEquipment
};