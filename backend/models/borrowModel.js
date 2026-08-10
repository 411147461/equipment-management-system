// =========================
// Borrow Model
// =========================

// 載入資料庫連線
const db = require("../config/db");


// =========================
// 建立借用紀錄
// =========================

async function createBorrowRecord(userId, equipmentId) {

    // 建立新的借用紀錄
    const sql = `
        INSERT INTO borrow_records
        (user_id, equipment_id, status)
        VALUES (?, ?, 'borrowed')
    `;

    // 執行 SQL
    const [result] = await db.execute(
        sql,
        [userId, equipmentId]
    );

    // 回傳新增紀錄的 ID
    return result.insertId;
}


// =========================
// 查詢設備目前是否有借用紀錄
// =========================

async function findActiveBorrowByEquipment(equipmentId) {

    // 查詢指定設備目前是否處於借出狀態
    const sql = `
        SELECT *
        FROM borrow_records
        WHERE equipment_id = ?
        AND status = 'borrowed'
        LIMIT 1
    `;

    // 執行 SQL
    const [rows] = await db.execute(
        sql,
        [equipmentId]
    );

    // 沒有借用紀錄
    if (rows.length === 0) {
        return null;
    }

    // 回傳目前的借用紀錄
    return rows[0];
}


// =========================
// 查詢使用者自己的借用紀錄
// =========================

async function findBorrowsByUser(userId) {

    // JOIN 設備資料
    // 讓 API 可以直接取得設備名稱
    const sql = `
        SELECT
            br.id,
            br.user_id,
            br.equipment_id,
            e.name AS equipment_name,
            e.category,
            br.borrowed_at,
            br.returned_at,
            br.status
        FROM borrow_records br
        JOIN equipment e
            ON br.equipment_id = e.id
        WHERE br.user_id = ?
        ORDER BY br.created_at DESC
    `;

    // 執行 SQL
    const [rows] = await db.execute(
        sql,
        [userId]
    );

    return rows;
}


// =========================
// 查詢所有借用紀錄
// =========================

async function findAllBorrows() {

    // JOIN 使用者與設備
    // 讓管理員可以看到完整資訊
    const sql = `
        SELECT
            br.id,
            br.user_id,
            u.username,
            u.name AS user_name,
            br.equipment_id,
            e.name AS equipment_name,
            e.category,
            br.borrowed_at,
            br.returned_at,
            br.status
        FROM borrow_records br
        JOIN users u
            ON br.user_id = u.id
        JOIN equipment e
            ON br.equipment_id = e.id
        ORDER BY br.created_at DESC
    `;

    // 執行 SQL
    const [rows] = await db.execute(sql);

    return rows;
}


// =========================
// 歸還設備
// =========================

async function returnBorrowRecord(borrowId) {

    // 將借用紀錄更新為 returned
    // 同時記錄歸還時間
    const sql = `
        UPDATE borrow_records
        SET
            status = 'returned',
            returned_at = CURRENT_TIMESTAMP
        WHERE id = ?
        AND status = 'borrowed'
    `;

    // 執行 SQL
    const [result] = await db.execute(
        sql,
        [borrowId]
    );

    // 回傳受影響的資料筆數
    return result.affectedRows;
}

// =========================
// 查詢指定借用紀錄
// =========================

async function findBorrowById(borrowId) {

    // 查詢指定的借用紀錄
    const sql = `
        SELECT *
        FROM borrow_records
        WHERE id = ?
        LIMIT 1
    `;

    // 執行 SQL
    const [rows] = await db.execute(
        sql,
        [borrowId]
    );

    // 找不到紀錄
    if (rows.length === 0) {
        return null;
    }

    // 回傳借用紀錄
    return rows[0];
}


// =========================
// 匯出 Model
// =========================

module.exports = {
    createBorrowRecord,
    findActiveBorrowByEquipment,
    findBorrowsByUser,
    findAllBorrows,
    returnBorrowRecord,
    findBorrowById
};