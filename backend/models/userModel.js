// =========================
// User Model
// =========================

// 載入資料庫連線
const db = require("../config/db");


// =========================
// 建立使用者
// =========================

async function createUser(
    username,
    password,
    name,
    role = "user"
) {

    // SQL：新增使用者
    const sql = `
        INSERT INTO users
        (username, password, name, role)
        VALUES (?, ?, ?, ?)
    `;

    // 執行 SQL
    const [result] = await db.execute(
        sql,
        [
            username,
            password,
            name,
            role
        ]
    );

    // 回傳新增使用者的 ID
    return result.insertId;
}


// =========================
// 根據 username 查詢使用者
// =========================

async function findUserByUsername(username) {

    // SQL：查詢指定帳號
    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
    `;

    // 執行 SQL
    const [rows] = await db.execute(
        sql,
        [username]
    );

    // 找不到使用者時回傳 null
    if (rows.length === 0) {
        return null;
    }

    // 回傳第一筆資料
    return rows[0];
}


// 匯出 Model
module.exports = {
    createUser,
    findUserByUsername
};