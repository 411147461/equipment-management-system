// ========================================
// API 設定
// ========================================

// Backend API 的根網址
const BASE_URL =
    "http://localhost:3000";

// 借用紀錄 API
const BORROW_API_URL =
    `${BASE_URL}/borrow`;


// ========================================
// 取得登入資訊
// ========================================

// 從 Local Storage 取得 JWT Token
const token =
    localStorage.getItem("token");

// 取得使用者名稱
const username =
    localStorage.getItem("username");

// 取得使用者顯示名稱
const name =
    localStorage.getItem("name");


// ========================================
// 建立 JWT Request Headers
// ========================================

// GET /borrow/my
// POST /borrow/:borrowId/return
// 都需要登入
//
// 所以要把 JWT 放進 Authorization Header
function getAuthHeaders() {

    return {

        // 告訴 Backend 傳送的是 JSON
        "Content-Type":
            "application/json",

        // 傳送 JWT
        Authorization:
            `Bearer ${token}`

    };

}


// ========================================
// 檢查登入狀態
// ========================================

function checkLogin() {

    // 如果沒有 Token
    // 代表使用者沒有登入
    if (!token) {

        alert("請先登入");

        // 導向登入頁面
        window.location.href =
            "./login.html";

        return false;

    }

    return true;

}


// ========================================
// 顯示使用者資訊
// ========================================

function showUserInfo() {

    // 找到 HTML 中的使用者名稱區域
    const userNameElement =
        document.getElementById(
            "userName"
        );


    // 優先顯示 name
    // 如果沒有 name，就顯示 username
    userNameElement.textContent =
        name || username || "未知使用者";

}


// ========================================
// 取得自己的借用紀錄
// ========================================

// API：
// GET /borrow/my
//
// Backend 會根據 JWT 裡面的 user ID
// 只回傳目前登入使用者自己的紀錄
async function loadMyBorrows() {

    // 找到借用紀錄顯示區域
    const container =
        document.getElementById(
            "borrowList"
        );


    try {

        // ========================================
        // 發送 GET Request
        // ========================================

        const response =
            await fetch(
                `${BORROW_API_URL}/my`,
                {

                    method: "GET",

                    headers:
                        getAuthHeaders()

                }
            );


        // ========================================
        // 取得 Backend 回傳資料
        // ========================================

        const result =
            await response.json();


        // ========================================
        // Token 無效
        // ========================================

        if (response.status === 401) {

            alert(
                "登入已過期，請重新登入"
            );

            // 清除登入資訊
            logout();

            return;

        }


        // ========================================
        // API 發生錯誤
        // ========================================

        if (!response.ok) {

            container.innerHTML = `

                <p>
                    ${
                        result.message ||
                        "無法取得借用紀錄"
                    }
                </p>

            `;

            return;

        }


        // ========================================
        // 沒有借用紀錄
        // ========================================

        if (
            !Array.isArray(result) ||
            result.length === 0
        ) {

            container.innerHTML = `

                <div class="equipment-card">

                    <h3>
                        目前沒有借用紀錄
                    </h3>

                    <p>
                        您目前沒有任何設備借用紀錄。
                    </p>

                </div>

            `;

            return;

        }


        // ========================================
        // 清除「載入中...」
        // ========================================

        container.innerHTML = "";


        // ========================================
        // 顯示每一筆借用紀錄
        // ========================================

        result.forEach(record => {

            // 建立借用紀錄卡片
            const card =
                document.createElement(
                    "div"
                );


            // 使用和設備列表相同的卡片樣式
            card.className =
                "equipment-card";


            // ========================================
            // 判斷借用狀態
            // ========================================

            const isBorrowed =
                record.status === "borrowed";


            // ========================================
            // 格式化借用時間
            // ========================================

            const borrowedAt =
                formatDate(
                    record.borrowed_at
                );


            // ========================================
            // 格式化歸還時間
            // ========================================

            const returnedAt =
                record.returned_at
                    ? formatDate(
                        record.returned_at
                    )
                    : "尚未歸還";


            // ========================================
            // 建立歸還按鈕
            // ========================================

            let returnButton = "";


            // 只有借用中的設備
            // 才可以按歸還
            if (isBorrowed) {

                returnButton = `

                    <button
                        class="submit-button"
                        onclick="returnEquipment(${record.id})"
                    >
                        歸還設備
                    </button>

                `;

            }


            // ========================================
            // 建立卡片內容
            // ========================================

            card.innerHTML = `

                <h3>
                    ${record.equipment_name}
                </h3>


                <p>
                    <strong>分類：</strong>
                    ${record.category || "無"}
                </p>


                <p>
                    <strong>借用時間：</strong>
                    ${borrowedAt}
                </p>


                <p>
                    <strong>歸還時間：</strong>
                    ${returnedAt}
                </p>


                <p>

                    <strong>狀態：</strong>

                    <span
                        class="status ${
                            record.status
                        }"
                    >

                        ${
                            isBorrowed
                                ? "借用中"
                                : "已歸還"
                        }

                    </span>

                </p>


                <!-- ================================= -->
                <!-- 操作按鈕 -->
                <!-- ================================= -->

                <div class="equipment-actions">

                    ${returnButton}

                </div>

            `;


            // 將卡片加入借用紀錄列表
            container.appendChild(card);

        });


    } catch (error) {

        // ========================================
        // 網路錯誤
        // ========================================

        console.error(
            "取得借用紀錄失敗：",
            error
        );


        container.innerHTML = `

            <div class="equipment-card">

                <h3>
                    無法取得借用紀錄
                </h3>

                <p>
                    請確認 Backend 是否正在執行。
                </p>

            </div>

        `;

    }

}


// ========================================
// 歸還設備
// ========================================

// API：
// POST /borrow/:borrowId/return
//
// borrowId 是 borrow_records 的 ID
async function returnEquipment(
    borrowId
) {

    // ========================================
    // 確認是否真的要歸還
    // ========================================

    const confirmed =
        confirm(
            "確定要歸還這台設備嗎？"
        );


    // 使用者取消
    if (!confirmed) {

        return;

    }


    try {

        // ========================================
        // 發送歸還 Request
        // ========================================

        const response =
            await fetch(
                `${BORROW_API_URL}/${borrowId}/return`,
                {

                    method: "POST",

                    headers:
                        getAuthHeaders()

                }
            );


        // ========================================
        // 取得 Backend 回傳資料
        // ========================================

        const result =
            await response.json();


        // ========================================
        // Token 無效
        // ========================================

        if (response.status === 401) {

            alert(
                "登入已過期，請重新登入"
            );

            logout();

            return;

        }


        // ========================================
        // 歸還失敗
        // ========================================

        if (!response.ok) {

            alert(
                result.message ||
                "設備歸還失敗"
            );

            return;

        }


        // ========================================
        // 歸還成功
        // ========================================

        alert(
            "設備歸還成功！"
        );


        // 重新載入借用紀錄
        //
        // 這樣畫面會立即更新成「已歸還」
        await loadMyBorrows();


    } catch (error) {

        // ========================================
        // 網路錯誤
        // ========================================

        console.error(
            "歸還設備失敗：",
            error
        );


        alert(
            "無法連接後端伺服器"
        );

    }

}


// ========================================
// 日期格式化
// ========================================

// 將 MySQL / Backend 回傳的時間
// 轉成比較容易閱讀的格式
function formatDate(dateString) {

    // 沒有日期
    if (!dateString) {

        return "無";

    }


    const date =
        new Date(dateString);


    // 如果日期無效
    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    // 使用台灣常用格式
    return date.toLocaleString(
        "zh-TW",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ========================================
// 登出
// ========================================

function logout() {

    // 清除登入 Token
    localStorage.removeItem(
        "token"
    );

    // 清除使用者名稱
    localStorage.removeItem(
        "username"
    );

    // 清除使用者姓名
    localStorage.removeItem(
        "name"
    );

    // 清除使用者角色
    localStorage.removeItem(
        "role"
    );


    // 回到登入頁面
    window.location.href =
        "./login.html";

}


// ========================================
// 返回設備列表
// ========================================

function goToEquipmentPage() {

    window.location.href =
        "./index.html";

}


// ========================================
// 網頁載入時執行
// ========================================

// 先檢查登入狀態
if (checkLogin()) {

    // 顯示使用者資訊
    showUserInfo();

    // 載入借用紀錄
    loadMyBorrows();

}