const db = require("../config/db");

const getAllEquipment = async () => {
    const [rows] = await db.query("SELECT * FROM equipment");

    return rows;
};


const getEquipmentById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM equipment WHERE id = ?",
        [id]
    );

    return rows[0];
};

module.exports = {
    getAllEquipment,
    getEquipmentById
};