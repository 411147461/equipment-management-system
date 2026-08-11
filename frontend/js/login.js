// =========================
// 登入功能
// =========================

// Backend API 網址
const API_URL = "http://localhost:3000";


// =========================
// 取得登入表單
// =========================

const loginForm =
    document.getElementById("loginForm");


// =========================
// 監聽表單送出
// =========================

loginForm.addEventListener(
    "submit",
    async function (event) {

        // 防止瀏覽器重新整理頁面
        event.preventDefault();


        // =========================
        // 取得使用者輸入
        // =========================

        const username =
            document.getElementById(
                "username"
            ).value;

        const password =
            document.getElementById(
                "password"
            ).value;


        // 取得訊息顯示區域
        const message =
            document.getElementById(
                "message"
            );


        try {

            // =========================
            // 呼叫登入 API
            // =========================

            const response =
                await fetch(
                    `${API_URL}/users/login`,
                    {

                        // 使用 POST 傳送登入資料
                        method: "POST",

                        // 告訴後端傳送的是 JSON
                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        // 將帳號密碼轉成 JSON
                        body: JSON.stringify({

                            username: username,

                            password: password

                        })

                    }
                );


            // =========================
            // 取得後端回傳資料
            // =========================

            const data =
                await response.json();


            // =========================
            // 登入失敗
            // =========================

            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "登入失敗";

                return;
            }


            // =========================
            // 登入成功
            // =========================

            // 後端回傳的使用者資料
            // 放在 data.user 裡面
            const user = data.user;


            // =========================
            // 儲存 JWT Token
            // =========================

            // Token 後面呼叫需要登入的 API 時會使用
            localStorage.setItem(
                "token",
                data.token
            );


            // =========================
            // 儲存使用者資訊
            // =========================

            // 儲存使用者 ID
            localStorage.setItem(
                "userId",
                user.id
            );


            // 儲存使用者帳號
            localStorage.setItem(
                "username",
                user.username
            );


            // 儲存使用者姓名
            localStorage.setItem(
                "name",
                user.name
            );


            // 儲存使用者角色
            // 例如：
            // admin
            // user
            localStorage.setItem(
                "role",
                user.role
            );


            // =========================
            // 顯示成功訊息
            // =========================

            message.textContent =
                "登入成功！";


            // =========================
            // 前往設備管理頁面
            // =========================

            setTimeout(
                function () {

                    window.location.href =
                        "./index.html";

                },
                500
            );

        } catch (error) {

            // =========================
            // 網路錯誤
            // =========================

            console.error(
                "登入失敗：",
                error
            );


            // 顯示錯誤訊息
            message.textContent =
                "無法連線到伺服器";

        }

    }
);