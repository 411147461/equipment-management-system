// ========================================
// API 設定
// ========================================

// 後端 API 網址
const API_URL = "http://localhost:3000";

// 借用紀錄 API
const BORROW_API_URL = "http://localhost:3000/borrow";


// ========================================
// 借用紀錄資料
// ========================================

// 儲存所有從後端取得的借用紀錄
// 篩選功能會從這份資料進行篩選
let allBorrowRecords = [];


// ========================================
// 取得登入資訊
// ========================================

// 從 LocalStorage 取得 JWT Token
const token = localStorage.getItem("token");

// 取得使用者名稱
const name = localStorage.getItem("name");

// 取得使用者角色
const role = localStorage.getItem("role");


// ========================================
// 檢查登入狀態
// ========================================

// 如果沒有 Token
// 代表使用者尚未登入
if (!token) {

    window.location.href = "./login.html";

}


// ========================================
// 檢查管理員權限
// ========================================

// 這個頁面只允許 admin 使用
if (role !== "admin") {

    alert("你沒有管理員權限");

    window.location.href = "./index.html";

}


// ========================================
// 顯示管理員名稱
// ========================================

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    userNameElement.textContent =
        name || "管理員";

}


// ========================================
// 載入所有借用紀錄
// ========================================

async function loadAllBorrows() {

    try {

        // ========================================
        // 呼叫 GET /borrow
        // ========================================

        const response = await fetch(
            `${BORROW_API_URL}`,
            {

                method: "GET",

                headers: {

                    // 將 JWT Token 傳給後端
                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        // ========================================
        // 取得後端 JSON
        // ========================================

        const records =
            await response.json();


        // ========================================
        // API 失敗
        // ========================================

        if (!response.ok) {

            alert(
                records.message ||
                "無法取得借用紀錄"
            );

            return;

        }


        // ========================================
        // 儲存所有借用紀錄
        // ========================================

        allBorrowRecords = records;


        // ========================================
        // 建立使用者篩選選單
        // ========================================

        populateUserFilter(records);


        // ========================================
        // 顯示所有借用紀錄
        // ========================================

        renderBorrowRecords(records);


    } catch (error) {

        // ========================================
        // 網路錯誤
        // ========================================

        console.error(
            "取得所有借用紀錄失敗：",
            error
        );


        const container =
            document.getElementById(
                "borrowList"
            );


        if (container) {

            container.innerHTML = `

                <div class="loading">

                    無法連接後端伺服器

                </div>

            `;

        }

    }

}


// ========================================
// 顯示借用紀錄
// ========================================
//
// 這個函式負責：
// 1. 清空目前列表
// 2. 建立借用紀錄卡片
// 3. 將卡片顯示在畫面上
//
// 篩選之後也會重新呼叫這個函式
// ========================================

function renderBorrowRecords(records) {

    // 找到畫面上的紀錄容器
    const container =
        document.getElementById(
            "borrowList"
        );


    // 如果找不到容器
    if (!container) {

        console.error(
            "找不到 borrowList"
        );

        return;

    }


    // ========================================
    // 清空目前畫面
    // ========================================

    container.innerHTML = "";


    // ========================================
    // 沒有任何紀錄
    // ========================================

    if (records.length === 0) {

        container.innerHTML = `

            <div class="loading">

                找不到符合條件的借用紀錄

            </div>

        `;

        return;

    }


    // ========================================
    // 建立每一筆借用紀錄
    // ========================================

    records.forEach(record => {


        // ========================================
        // 建立卡片
        // ========================================

        const card =
            document.createElement("div");


        // 使用原本設備卡片的樣式
        card.className =
            "equipment-card";


        // ========================================
        // 判斷目前是否借用中
        // ========================================

        const isBorrowed =
            record.status === "borrowed";


        // ========================================
        // 狀態文字
        // ========================================

        const statusText =
            isBorrowed
                ? "借用中"
                : "已歸還";


        // ========================================
        // 狀態 CSS
        // ========================================

        const statusClass =
            isBorrowed
                ? "borrowed"
                : "available";


        // ========================================
        // 建立卡片內容
        // ========================================

        card.innerHTML = `

            <h3>
                ${record.equipment_name}
            </h3>


            <p>

                <strong>
                    使用者：
                </strong>

                ${record.user_name}

                （${record.username}）

            </p>


            <p>

                <strong>
                    設備分類：
                </strong>

                ${record.category}

            </p>


            <p>

                <strong>
                    借用時間：
                </strong>

                ${formatDate(
                    record.borrowed_at
                )}

            </p>


            <p>

                <strong>
                    歸還時間：
                </strong>

                ${
                    record.returned_at
                        ? formatDate(
                            record.returned_at
                        )
                        : "尚未歸還"
                }

            </p>


            <p>

                <strong>
                    狀態：
                </strong>

                <span
                    class="status ${statusClass}"
                >
                    ${statusText}
                </span>

            </p>

        `;


        // ========================================
        // 將卡片加入畫面
        // ========================================

        container.appendChild(card);

    });

}


// ========================================
// 日期格式化
// ========================================

function formatDate(dateString) {

    // 將資料庫時間轉成 JavaScript Date
    const date =
        new Date(dateString);


    // 使用台灣常用格式顯示
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
// 建立使用者篩選選單
// ========================================

function populateUserFilter(records) {

    const userFilter =
        document.getElementById(
            "userFilter"
        );


    // 如果找不到使用者篩選器
    if (!userFilter) {

        console.error(
            "找不到 userFilter"
        );

        return;

    }


    // ========================================
    // 清除原本選項
    // ========================================

    userFilter.innerHTML = `

        <option value="all">
            全部使用者
        </option>

    `;


    // ========================================
    // 用 Map 避免同一個人重複出現
    // ========================================

    const users = new Map();


    records.forEach(record => {

        users.set(
            record.user_id,
            {
                username:
                    record.username,

                name:
                    record.user_name
            }
        );

    });


    // ========================================
    // 建立使用者選項
    // ========================================

    users.forEach(
        (user, userId) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                userId;


            option.textContent =
                `${user.name} (${user.username})`;


            userFilter.appendChild(
                option
            );

        }
    );

}


// ========================================
// 篩選借用紀錄
// ========================================

function filterBorrowRecords() {

    // ========================================
    // 取得目前選擇的使用者
    // ========================================

    const userFilter =
        document.getElementById(
            "userFilter"
        );


    // ========================================
    // 取得目前選擇的狀態
    // ========================================

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    // 如果元素不存在
    if (!userFilter || !statusFilter) {

        console.error(
            "找不到篩選器"
        );

        return;

    }


    const selectedUser =
        userFilter.value;


    const selectedStatus =
        statusFilter.value;


    // ========================================
    // 篩選資料
    // ========================================

    const filteredRecords =
        allBorrowRecords.filter(
            record => {


                // ========================================
                // 使用者篩選
                // ========================================

                const matchUser =
                    selectedUser === "all" ||
                    String(record.user_id) ===
                        String(selectedUser);


                // ========================================
                // 狀態篩選
                // ========================================

                const matchStatus =
                    selectedStatus === "all" ||
                    record.status === selectedStatus;


                // 必須同時符合
                return (
                    matchUser &&
                    matchStatus
                );

            }
        );


    // ========================================
    // 重新顯示篩選後的資料
    // ========================================

    renderBorrowRecords(
        filteredRecords
    );

}


// ========================================
// 使用者篩選事件
// ========================================

const userFilter =
    document.getElementById(
        "userFilter"
    );


if (userFilter) {

    userFilter.addEventListener(
        "change",
        filterBorrowRecords
    );

}


// ========================================
// 狀態篩選事件
// ========================================

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterBorrowRecords
    );

}


// ========================================
// 清除篩選
// ========================================

const clearFilterButton =
    document.getElementById(
        "clearFilterButton"
    );


if (clearFilterButton) {

    clearFilterButton.addEventListener(
        "click",
        function () {


            // ========================================
            // 使用者恢復全部
            // ========================================

            document.getElementById(
                "userFilter"
            ).value = "all";


            // ========================================
            // 狀態恢復全部
            // ========================================

            document.getElementById(
                "statusFilter"
            ).value = "all";


            // ========================================
            // 重新顯示全部紀錄
            // ========================================

            renderBorrowRecords(
                allBorrowRecords
            );

        }
    );

}


// ========================================
// 返回設備列表
// ========================================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "./index.html";

        }
    );

}


// ========================================
// 登出
// ========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {


            // ========================================
            // 清除登入資訊
            // ========================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "name"
            );

            localStorage.removeItem(
                "role"
            );


            // ========================================
            // 回到登入頁
            // ========================================

            window.location.href =
                "./login.html";

        }
    );

}


// ========================================
// 網頁載入時執行
// ========================================

loadAllBorrows();