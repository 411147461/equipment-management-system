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
const createEquipment = async (equipment) => {
    const {
        name,
        category,
        status,
        description
    } = equipment;

    const [result] = await db.query(
        `INSERT INTO equipment
        (name, category, status, description)
        VALUES (?, ?, ?, ?)`,
        [name, category, status, description]
    );

    return result.insertId;
};
module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment
};