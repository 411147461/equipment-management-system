// =========================
// User Controller
// =========================

// bcrypt：負責密碼加密與驗證
const bcrypt = require("bcrypt");

// jsonwebtoken：負責建立登入 Token
const jwt = require("jsonwebtoken");

// 載入 User Model
// 負責與 MySQL users 資料表溝通
const {
    createUser,
    findUserByUsername
} = require("../models/userModel");


// =========================
// 使用者註冊
// =========================

async function register(req, res) {

    try {

        // 從前端取得註冊資料
        const {
            username,
            password,
            name
        } = req.body;


        // =========================
        // 基本資料驗證
        // =========================

        // 確認帳號、密碼、姓名都有填寫
        if (!username || !password || !name) {

            return res.status(400).json({
                message: "帳號、密碼與姓名皆為必填"
            });
        }


        // =========================
        // 檢查帳號是否已存在
        // =========================

        const existingUser =
            await findUserByUsername(username);


        if (existingUser) {

            return res.status(409).json({
                message: "此帳號已存在"
            });
        }


        // =========================
        // 加密密碼
        // =========================

        // bcrypt 的 salt rounds 設定為 10
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // =========================
        // 建立使用者
        // =========================

        const userId =
            await createUser(
                username,
                hashedPassword,
                name
            );


        // =========================
        // 回傳成功
        // =========================

        res.status(201).json({

            message: "註冊成功",

            id: userId,

            username: username,

            name: name

        });


    } catch (error) {

        // 將錯誤印在 Backend Console
        console.error(
            "使用者註冊失敗：",
            error
        );


        // 回傳伺服器錯誤
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}
// =========================
// 使用者登入
// =========================

async function login(req, res) {

    try {

        // 取得前端傳來的帳號與密碼
        const {
            username,
            password
        } = req.body;


        // =========================
        // 基本資料驗證
        // =========================

        if (!username || !password) {

            return res.status(400).json({
                message: "帳號與密碼皆為必填"
            });
        }


        // =========================
        // 查詢使用者
        // =========================

        const user =
            await findUserByUsername(username);


        // 如果找不到使用者
        if (!user) {

            return res.status(401).json({
                message: "帳號或密碼錯誤"
            });
        }


        // =========================
        // 比對密碼
        // =========================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        // 密碼錯誤
        if (!passwordMatch) {

            return res.status(401).json({
                message: "帳號或密碼錯誤"
            });
        }


        // =========================
        // 登入成功
        // =========================

        // =========================
        // 建立 JWT Token
        // =========================

        const token = jwt.sign(

            {
                // Token 裡保存使用者 ID
                id: user.id,

                // 保存使用者帳號
                username: user.username,

                // 保存使用者權限
                role: user.role
            },

            // 使用 .env 裡面的 JWT_SECRET
            process.env.JWT_SECRET,

            {
                // Token 有效期限
                expiresIn: "2h"
            }
        );


        // =========================
        // 回傳登入結果
        // =========================

        res.status(200).json({

            message: "登入成功",

            // 把 JWT Token 傳給前端
            token: token,

            // 回傳使用者基本資料
            user: {

                id: user.id,

                username: user.username,

                name: user.name,

                role: user.role

            }

        });


    } catch (error) {

        // Backend Console 顯示錯誤
        console.error(
            "使用者登入失敗：",
            error
        );


        // 回傳伺服器錯誤
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}

// 匯出 Controller
module.exports = {
    register,
    login
};