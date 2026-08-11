// =========================
// 註冊功能
// =========================


// Backend API 網址
const API_URL = "http://localhost:3000";


// =========================
// 取得註冊表單
// =========================

const registerForm =
    document.getElementById("registerForm");


// =========================
// 監聽表單送出
// =========================

registerForm.addEventListener(
    "submit",
    async function (event) {

        // 防止瀏覽器重新整理
        event.preventDefault();


        // =========================
        // 取得使用者輸入
        // =========================

        const username =
            document.getElementById(
                "username"
            ).value.trim();

        const name =
            document.getElementById(
                "name"
            ).value.trim();

        const password =
            document.getElementById(
                "password"
            ).value;

        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        // 訊息顯示區域
        const message =
            document.getElementById(
                "message"
            );


        // =========================
        // 檢查兩次密碼是否一致
        // =========================

        if (password !== confirmPassword) {

            message.textContent =
                "兩次輸入的密碼不一致";

            return;
        }


        try {

            // =========================
            // 呼叫註冊 API
            // =========================

            const response =
                await fetch(
                    `${API_URL}/users/register`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            username: username,

                            password: password,

                            name: name

                        })

                    }
                );


            // 取得 Backend 回傳資料
            const data =
                await response.json();


            // =========================
            // 處理註冊失敗
            // =========================

            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "註冊失敗";

                return;
            }


            // =========================
            // 註冊成功
            // =========================

            message.textContent =
                "註冊成功！即將前往登入頁面";


            // 等待一下再跳轉
            setTimeout(
                function () {

                    window.location.href =
                        "./login.html";

                },
                1000
            );


        } catch (error) {

            // =========================
            // 網路錯誤
            // =========================

            console.error(
                "註冊失敗：",
                error
            );

            message.textContent =
                "無法連線到伺服器";

        }

    }
);