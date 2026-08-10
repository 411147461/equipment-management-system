// =========================
// Borrow Controller
// =========================

// 載入設備 Model
// 用來查詢與修改設備資料
const equipmentModel =
    require("../models/equipmentModel");

// 載入借用 Model
// 用來處理借用紀錄
const borrowModel =
    require("../models/borrowModel");


// =========================
// 借用設備
// =========================

// POST /borrow/:equipmentId
//
// 使用者借用指定設備
async function borrowEquipment(req, res) {

    try {

        // =========================
        // 取得使用者資訊
        // =========================

        // authMiddleware 驗證 JWT 後，
        // 會把使用者資料放進 req.user
        const userId = req.user.id;


        // =========================
        // 取得設備 ID
        // =========================

        const equipmentId =
            Number(req.params.equipmentId);


        // 確認 equipmentId 是有效的數字
        if (isNaN(equipmentId)) {

            return res.status(400).json({
                message: "設備 ID 無效"
            });
        }


        // =========================
        // 查詢設備
        // =========================

        const equipment =
            await equipmentModel.getEquipmentById(
                equipmentId
            );


        // 設備不存在
        if (!equipment) {

            return res.status(404).json({
                message: "找不到指定設備"
            });
        }


        // =========================
        // 確認設備目前是否可以借用
        // =========================

        if (equipment.status !== "available") {

            return res.status(409).json({
                message: "此設備目前無法借用"
            });
        }


        // =========================
        // 確認是否已經存在借用紀錄
        // =========================

        const activeBorrow =
            await borrowModel.findActiveBorrowByEquipment(
                equipmentId
            );


        // 如果已經有人借用
        if (activeBorrow) {

            return res.status(409).json({
                message: "此設備目前已被借用"
            });
        }


        // =========================
        // 建立借用紀錄
        // =========================

        const borrowId =
            await borrowModel.createBorrowRecord(
                userId,
                equipmentId
            );


        // =========================
        // 更新設備狀態
        // =========================

        await equipmentModel.updateEquipmentStatus(
            equipmentId,
            "borrowed"
        );


        // =========================
        // 回傳成功
        // =========================

        res.status(201).json({

            message: "設備借用成功",

            borrowId: borrowId,

            equipmentId: equipmentId,

            userId: userId

        });


    } catch (error) {

        // 將錯誤顯示在 Backend Console
        console.error(
            "借用設備失敗：",
            error
        );


        // 回傳伺服器錯誤
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}


// =========================
// 查詢自己的借用紀錄
// =========================

// GET /borrow/my
//
// 使用者只能看到自己的借用紀錄
async function getMyBorrows(req, res) {

    try {

        // 從 JWT 取得目前登入者 ID
        const userId = req.user.id;


        // 查詢該使用者的借用紀錄
        const records =
            await borrowModel.findBorrowsByUser(
                userId
            );


        // 回傳資料
        res.status(200).json(records);


    } catch (error) {

        console.error(
            "查詢借用紀錄失敗：",
            error
        );

        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}

// =========================
// 歸還設備
// =========================

// POST /borrow/:borrowId/return
//
// 使用者歸還自己借用的設備
async function returnEquipment(req, res) {

    try {

        // =========================
        // 取得登入使用者
        // =========================

        const userId = req.user.id;


        // =========================
        // 取得借用紀錄 ID
        // =========================

        const borrowId =
            Number(req.params.borrowId);


        // 確認 ID 是否為有效數字
        if (isNaN(borrowId)) {

            return res.status(400).json({
                message: "借用紀錄 ID 無效"
            });
        }


        // =========================
        // 查詢借用紀錄
        // =========================

        const borrow =
            await borrowModel.findBorrowById(
                borrowId
            );


        // 找不到借用紀錄
        if (!borrow) {

            return res.status(404).json({
                message: "找不到指定的借用紀錄"
            });
        }


        // =========================
        // 確認是不是自己的借用紀錄
        // =========================

        if (borrow.user_id !== userId) {

            return res.status(403).json({
                message: "你沒有權限歸還這筆設備"
            });
        }


        // =========================
        // 確認設備目前是否還在借用中
        // =========================

        if (borrow.status !== "borrowed") {

            return res.status(409).json({
                message: "這筆設備已經歸還"
            });
        }


        // =========================
        // 更新借用紀錄
        // =========================

        const affectedRows =
            await borrowModel.returnBorrowRecord(
                borrowId
            );


        // 確認是否成功更新
        if (affectedRows === 0) {

            return res.status(409).json({
                message: "設備歸還失敗"
            });
        }


        // =========================
        // 更新設備狀態
        // =========================

        await equipmentModel.updateEquipmentStatus(
            borrow.equipment_id,
            "available"
        );


        // =========================
        // 回傳成功
        // =========================

        res.status(200).json({

            message: "設備歸還成功",

            borrowId: borrowId,

            equipmentId: borrow.equipment_id,

            userId: userId

        });


    } catch (error) {

        // 顯示錯誤資訊
        console.error(
            "歸還設備失敗：",
            error
        );


        // 回傳伺服器錯誤
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}
// =========================
// 查詢所有借用紀錄
// =========================

// GET /borrow
//
// 這個 API 預計只允許 admin 使用
async function getAllBorrows(req, res) {

    try {

        // 查詢所有借用紀錄
        const records =
            await borrowModel.findAllBorrows();


        // 回傳所有紀錄
        res.status(200).json(records);


    } catch (error) {

        console.error(
            "查詢所有借用紀錄失敗：",
            error
        );

        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
}


// =========================
// 匯出 Controller
// =========================

module.exports = {
    borrowEquipment,
    getMyBorrows,
    getAllBorrows,
    returnEquipment
};