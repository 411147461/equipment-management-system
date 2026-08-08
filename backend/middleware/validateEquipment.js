// 驗證設備資料是否符合規則
const validateEquipment = (req, res, next) => {

    // 從 Request Body 取得設備資料
    const {
        name,
        category,
        status
    } = req.body;

    // 檢查設備名稱是否存在
    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "設備名稱為必填"
        });
    }

    // 檢查設備分類是否存在
    if (!category || category.trim() === "") {
        return res.status(400).json({
            message: "設備分類為必填"
        });
    }

    // 定義設備允許使用的狀態
    const allowedStatus = ["available", "borrowed"];

    // 檢查 status 是否為合法值
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "設備狀態只能是 available 或 borrowed"
        });
    }

    // 驗證成功，繼續執行下一個 middleware / controller
    next();
};

module.exports = validateEquipment;