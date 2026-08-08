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
// 修改指定 ID 的設備資料
const updateEquipment = async (id, equipment) => {

    // 從傳入的設備物件中取出需要修改的欄位
    const {
        name,
        category,
        status,
        description
    } = equipment;

    // 使用 ? 參數傳遞資料，避免直接拼接使用者輸入
    const [result] = await db.query(
        `UPDATE equipment
         SET name = ?,
             category = ?,
             status = ?,
             description = ?
         WHERE id = ?`,
        [name, category, status, description, id]
    );

    // 回傳實際被修改的資料筆數
    return result.affectedRows;
};
// 刪除指定 ID 的設備
const deleteEquipment = async (id) => {

    // 根據設備 ID 刪除資料
    const [result] = await db.query(
        "DELETE FROM equipment WHERE id = ?",
        [id]
    );

    // 回傳實際被刪除的資料筆數
    return result.affectedRows;
};
module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};