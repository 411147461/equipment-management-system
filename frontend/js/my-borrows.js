// =========================
// 我的借用紀錄
// =========================


// 後端 API 網址
const API_URL = "http://localhost:3000";


// =========================
// 載入我的借用紀錄
// =========================

async function loadMyBorrows() {

    try {

        // =========================
        // 取得登入 Token
        // =========================

        const token =
            localStorage.getItem("token");


        // 如果沒有 Token
        // 代表使用者尚未登入
        if (!token) {

            alert("請先登入");

            // 導向登入頁面
            window.location.href =
                "./login.html";

            return;
        }


        // =========================
        // 呼叫 Backend API
        // =========================

        const response =
            await fetch(
                `${API_URL}/borrow/my`,
                {

                    // 使用 GET
                    method: "GET",

                    // 傳送 JWT
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        // =========================
        // 處理登入失效
        // =========================

        if (response.status === 401) {

            alert("登入已失效，請重新登入");

            // 移除舊 Token
            localStorage.removeItem("token");

            // 回登入頁面
            window.location.href =
                "./login.html";

            return;
        }


        // =========================
        // 取得 JSON
        // =========================

        const data =
            await response.json();


        // =========================
        // 找到 HTML 容器
        // =========================

        const borrowList =
            document.getElementById(
                "borrowList"
            );


        // 清空原本內容
        borrowList.innerHTML = "";


        // =========================
        // 沒有借用紀錄
        // =========================

        if (data.length === 0) {

            borrowList.innerHTML =
                "<p>目前沒有借用紀錄。</p>";

            return;
        }


        // =========================
        // 顯示借用紀錄
        // =========================

        data.forEach(borrow => {

            // 建立卡片
            const card =
                document.createElement("div");


            // 設定卡片內容
            card.innerHTML = `

                <h2>
                    ${borrow.equipment_name}
                </h2>

                <p>
                    類別：
                    ${borrow.category}
                </p>

                <p>
                    借用時間：
                    ${formatDate(
                        borrow.borrowed_at
                    )}
                </p>

                <p>
                    歸還時間：
                    ${
                        borrow.returned_at
                            ? formatDate(
                                borrow.returned_at
                              )
                            : "尚未歸還"
                    }
                </p>

                <p>
                    狀態：
                    ${
                        borrow.status === "borrowed"
                            ? "借用中"
                            : "已歸還"
                    }
                </p>

            `;


            // 加入頁面
            borrowList.appendChild(card);

        });


    } catch (error) {

        // =========================
        // 錯誤處理
        // =========================

        console.error(
            "載入借用紀錄失敗：",
            error
        );


        const borrowList =
            document.getElementById(
                "borrowList"
            );


        borrowList.innerHTML =
            "<p>載入借用紀錄失敗。</p>";
    }
}


// =========================
// 日期格式化
// =========================

function formatDate(dateString) {

    // 將資料庫時間轉成 JavaScript Date
    const date =
        new Date(dateString);


    // 回傳台灣常用格式
    return date.toLocaleString(
        "zh-TW"
    );
}


// =========================
// 頁面載入時執行
// =========================

loadMyBorrows();