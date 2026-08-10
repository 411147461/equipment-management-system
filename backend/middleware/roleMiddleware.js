// =========================
// Role Authorization Middleware
// =========================

// 檢查使用者是否具有指定角色
function requireRole(...allowedRoles) {

    return (req, res, next) => {

        // authMiddleware 驗證 JWT 後，
        // 會把使用者資料放到 req.user
        if (!req.user) {

            return res.status(401).json({
                message: "請先登入"
            });
        }


        // 取得目前使用者的角色
        const userRole = req.user.role;


        // 檢查角色是否在允許的角色清單中
        if (!allowedRoles.includes(userRole)) {

            return res.status(403).json({
                message: "沒有權限執行此操作"
            });
        }


        // 權限確認成功
        next();
    };
}


// 匯出 Middleware
module.exports = {
    requireRole
};