// ========================================
// API 設定
// ========================================

// 後端 API 網址
const API_URL = "http://localhost:3000";


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
            `${API_URL}/borrow`,
            {

                method: "GET",

                headers: {

                    // 將 JWT Token 傳給後端
                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        // 取得後端 JSON
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


        // 找到畫面上的紀錄容器
        const container =
            document.getElementById(
                "borrowList"
            );


        // 清空載入文字
        container.innerHTML = "";


        // ========================================
        // 沒有任何紀錄
        // ========================================

        if (records.length === 0) {

            container.innerHTML = `

                <div class="loading">

                    目前沒有任何借用紀錄

                </div>

            `;

            return;

        }


        // ========================================
        // 建立每一筆借用紀錄
        // ========================================

        records.forEach(record => {


            // 建立卡片
            const card =
                document.createElement("div");


            // 使用原本設備卡片的樣式
            card.className =
                "equipment-card";


            // 判斷目前是否借用中
            const isBorrowed =
                record.status === "borrowed";


            // 狀態文字
            const statusText =
                isBorrowed
                    ? "借用中"
                    : "已歸還";


            // 狀態 CSS
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


            // 將卡片加入畫面
            container.appendChild(card);

        });


    } catch (error) {

        // ========================================
        // 網路錯誤
        // ========================================

        console.error(
            "取得所有借用紀錄失敗：",
            error
        );


        document.getElementById(
            "borrowList"
        ).innerHTML = `

            <div class="loading">

                無法連接後端伺服器

            </div>

        `;

    }

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
// 返回設備列表
// ========================================

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "./index.html";

        }
    );


// ========================================
// 登出
// ========================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            // 清除登入資訊
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("role");

            // 回到登入頁
            window.location.href =
                "./login.html";

        }
    );


// ========================================
// 網頁載入時執行
// ========================================

loadAllBorrows();