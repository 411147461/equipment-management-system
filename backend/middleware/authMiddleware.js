// =========================
// JWT Authentication Middleware
// =========================

// 載入 jsonwebtoken
// 用來驗證使用者送過來的 JWT Token
const jwt = require("jsonwebtoken");


// =========================
// 驗證 JWT
// =========================

function authenticateToken(req, res, next) {

    // 從 HTTP Header 取得 Authorization
    const authHeader = req.headers["authorization"];


    // Authorization 通常長這樣：
    //
    // Authorization: Bearer eyJhbGciOi...
    //
    // 我們把 Bearer 後面的 Token 取出來

    const token =
        authHeader &&
        authHeader.split(" ")[1];


    // 如果沒有 Token
    if (!token) {

        return res.status(401).json({
            message: "請先登入"
        });
    }


    // =========================
    // 驗證 Token
    // =========================

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, user) => {

            // Token 無效或已過期
            if (error) {

                return res.status(403).json({
                    message: "登入已失效，請重新登入"
                });
            }


            // =========================
            // 將使用者資料放入 req.user
            // =========================

            req.user = user;


            // 驗證成功
            // 繼續執行下一個 Middleware / Controller
            next();
        }
    );
}


// 匯出 Middleware
module.exports = {
    authenticateToken
};