// ========================================
// API 設定
// ========================================

// Backend API 的根網址
const BASE_URL =
    "http://localhost:3000";

// 設備 API
const API_URL =
    `${BASE_URL}/equipment`;

// 借用 API
const BORROW_API_URL =
    `${BASE_URL}/borrow`;

// =========================
// 設備資料
// =========================

// 儲存從後端取得的所有設備
let allEquipment = [];
// ========================================
// 登入狀態
// ========================================

// 從 Local Storage 取得 JWT Token
const token = localStorage.getItem("token");

// 取得登入使用者名稱
const username = localStorage.getItem("username");

// 取得使用者姓名
const name = localStorage.getItem("name");

// 取得使用者角色
const role = localStorage.getItem("role");


// ========================================
// 檢查是否登入
// ========================================

// 如果沒有 Token
// 代表使用者尚未登入
if (!token) {

    // 導向登入頁面
    window.location.href = "./login.html";
}


// ========================================
// 顯示使用者資訊
// ========================================

// 顯示使用者名稱
const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    // 優先顯示姓名
    userNameElement.textContent =
        name || username || "使用者";
}


// 顯示歡迎名稱
const welcomeNameElement =
    document.getElementById("welcomeName");

if (welcomeNameElement) {

    welcomeNameElement.textContent =
        name || username || "使用者";
}


// 顯示使用者角色
const userRoleElement =
    document.getElementById("userRole");

if (userRoleElement) {

    userRoleElement.textContent =
        role === "admin"
            ? "管理員"
            : "一般使用者";
}


// ========================================
// 管理員權限控制
// ========================================

// 取得所有只允許管理員使用的區域
const adminElements =
    document.querySelectorAll(".admin-only");


// 如果不是管理員
if (role !== "admin") {

    // 將管理員功能全部隱藏
    adminElements.forEach(element => {

        element.style.display = "none";

    });

}


// ========================================
// 登出功能
// ========================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            // 清除登入資訊
            localStorage.removeItem("token");

            localStorage.removeItem("username");

            localStorage.removeItem("name");

            localStorage.removeItem("role");


            // 回到登入頁面
            window.location.href =
                "./login.html";

        }
    );

}
// ========================================
// 前往我的借用紀錄
// ========================================

// 使用者按下「我的借用紀錄」後
// 前往 my-borrows.html
function goToMyBorrows() {

    window.location.href =
        "./my-borrows.html";

}

// ========================================
// 建立 JWT Request Headers
// ========================================

// 所有需要登入的 API
// 都可以使用這個 Header
function getAuthHeaders() {

    return {

        // 告訴後端傳送 JSON
        "Content-Type": "application/json",

        // 將 JWT 放進 Authorization Header
        Authorization: `Bearer ${token}`

    };

}



// =========================
// 顯示設備列表
// =========================

function renderEquipment(equipmentList) {

    const container =
        document.getElementById("equipmentList");

    // 清空目前列表
    container.innerHTML = "";


    // 沒有搜尋結果
    if (equipmentList.length === 0) {

        container.innerHTML = `
            <div class="loading">
                找不到符合條件的設備
            </div>
        `;

        return;
    }


    // 顯示設備
    equipmentList.forEach(equipment => {

        const card =
            document.createElement("div");

        card.className =
            "equipment-card";


        // =========================
        // 設備狀態
        // =========================

        const isAvailable =
            equipment.status === "available";


        // =========================
        // 登入資訊
        // =========================

        const role =
            localStorage.getItem("role");


        // =========================
        // 操作按鈕
        // =========================

        let actionButtons = "";


        // 可借用
        if (isAvailable) {

            actionButtons += `

                <button
                    class="borrow-button"
                    onclick="borrowEquipment(${equipment.id})"
                >
                    借用設備
                </button>

            `;

        }

        // 借出中
        else {

            actionButtons += `

                <button
                    class="borrow-button disabled"
                    disabled
                >
                    借出中
                </button>

            `;

        }


        // Admin 功能
        if (role === "admin") {

            actionButtons += `

                <button
                    class="edit-button"
                    onclick="editEquipment(${equipment.id})"
                >
                    修改
                </button>

                <button
                    class="delete-button"
                    onclick="deleteEquipment(${equipment.id})"
                >
                    刪除
                </button>

            `;

        }


        // =========================
        // 建立設備卡片
        // =========================

        card.innerHTML = `

            <h3>
                ${equipment.name}
            </h3>

            <p>
                <strong>分類：</strong>
                ${equipment.category}
            </p>

            <p>
                <strong>狀態：</strong>

                <span class="status ${equipment.status}">
                    ${
                        isAvailable
                            ? "可借用"
                            : "借出中"
                    }
                </span>

            </p>

            <p>
                <strong>描述：</strong>
                ${equipment.description || "無"}
            </p>


            <div class="equipment-actions">

                ${actionButtons}

            </div>

        `;


        container.appendChild(card);

    });

}
// =========================
// 搜尋與篩選設備
// =========================

function filterEquipment() {

    const keyword =
        document
            .getElementById("searchEquipment")
            .value
            .toLowerCase()
            .trim();


    const status =
        document
            .getElementById("filterStatus")
            .value;


    // 篩選設備
    const filteredEquipment =
        allEquipment.filter(equipment => {

            // 搜尋名稱
            const name =
                equipment.name
                    .toLowerCase();


            // 搜尋分類
            const category =
                equipment.category
                    .toLowerCase();


            // 關鍵字符合名稱或分類
            const matchKeyword =
                name.includes(keyword) ||
                category.includes(keyword);


            // 狀態符合
            const matchStatus =
                status === "all" ||
                equipment.status === status;


            return (
                matchKeyword &&
                matchStatus
            );

        });


    // 重新顯示
    renderEquipment(filteredEquipment);

}

// =========================
// 搜尋與篩選事件
// =========================

document
    .getElementById("searchEquipment")
    .addEventListener(
        "input",
        filterEquipment
    );


document
    .getElementById("filterStatus")
    .addEventListener(
        "change",
        filterEquipment
    );
// ========================================
// 取得設備列表
// ========================================

async function loadEquipment() {

    try {

        const response =
            await fetch(API_URL);

        const equipmentList =
            await response.json();


        // 儲存所有設備
        allEquipment = equipmentList;


        // 顯示設備
        renderEquipment(allEquipment);


    } catch (error) {

        console.error(
            "載入設備失敗：",
            error
        );

        document.getElementById(
            "equipmentList"
        ).innerHTML =
            "<p>無法載入設備資料</p>";

    }

}
// ========================================
// 更新設備統計
// ========================================

function updateStatistics(equipmentList) {

    // 計算設備總數
    const total =
        equipmentList.length;


    // 計算可借用數量
    const available =
        equipmentList.filter(
            equipment =>
                equipment.status === "available"
        ).length;


    // 計算借出中數量
    const borrowed =
        equipmentList.filter(
            equipment =>
                equipment.status === "borrowed"
        ).length;


    // 更新畫面上的數字
    const totalElement =
        document.getElementById(
            "totalEquipment"
        );

    const availableElement =
        document.getElementById(
            "availableEquipment"
        );

    const borrowedElement =
        document.getElementById(
            "borrowedEquipment"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (availableElement) {

        availableElement.textContent =
            available;

    }


    if (borrowedElement) {

        borrowedElement.textContent =
            borrowed;

    }

}


// ========================================
// 新增設備
// ========================================

async function addEquipment(event) {

    // 防止表單重新整理
    event.preventDefault();


    // 確認是否為管理員
    if (role !== "admin") {

        alert(
            "只有管理員可以新增設備"
        );

        return;
    }


    // 取得表單資料
    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const category =
        document.getElementById(
            "category"
        ).value.trim();


    const status =
        document.getElementById(
            "status"
        ).value;


    const description =
        document.getElementById(
            "description"
        ).value.trim();


    // 建立設備資料
    const equipmentData = {

        name: name,

        category: category,

        status: status,

        description: description

    };


    try {

        // 發送 POST Request
        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            equipmentData
                        )

                }
            );


        // 取得後端回傳資料
        const result =
            await response.json();


        // 如果 Token 無效
        if (response.status === 401) {

            logout();

            return;
        }


        // 如果沒有管理員權限
        if (response.status === 403) {

            alert(
                "你沒有權限新增設備"
            );

            return;
        }


        // 如果新增失敗
        if (!response.ok) {

            alert(
                result.message ||
                "設備新增失敗"
            );

            return;
        }


        // 新增成功
        alert(
            "設備新增成功！"
        );


        // 清空表單
        document
            .getElementById(
                "equipmentForm"
            )
            .reset();


        // 重新取得設備
        await loadEquipment();


    } catch (error) {

        console.error(
            "新增設備失敗：",
            error
        );

        alert(
            "無法連接後端伺服器"
        );

    }

}


// ========================================
// 刪除設備
// ========================================

async function deleteEquipment(id) {

    // 確認是否為管理員
    if (role !== "admin") {

        alert(
            "只有管理員可以刪除設備"
        );

        return;
    }


    // 詢問是否確定刪除
    const confirmed =
        confirm(
            "確定要刪除這台設備嗎？"
        );


    if (!confirmed) {

        return;

    }


    try {

        // 發送 DELETE Request
        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers:
                        getAuthHeaders()

                }
            );


        // 取得回傳資料
        const result =
            await response.json();


        // Token 失效
        if (response.status === 401) {

            logout();

            return;
        }


        // 沒有權限
        if (response.status === 403) {

            alert(
                "你沒有權限刪除設備"
            );

            return;
        }


        // 刪除失敗
        if (!response.ok) {

            alert(
                result.message ||
                "設備刪除失敗"
            );

            return;
        }


        // 刪除成功
        alert(
            "設備刪除成功！"
        );


        // 重新取得設備
        await loadEquipment();


    } catch (error) {

        console.error(
            "刪除設備失敗：",
            error
        );

        alert(
            "無法連接後端伺服器"
        );

    }

}


// ========================================
// 開啟修改設備表單
// ========================================

async function editEquipment(id) {

    // 確認是否為管理員
    if (role !== "admin") {

        alert(
            "只有管理員可以修改設備"
        );

        return;
    }


    try {

        // 取得指定設備
        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        // 取得設備資料
        const equipment =
            await response.json();


        // 如果取得失敗
        if (!response.ok) {

            alert(
                equipment.message ||
                "取得設備失敗"
            );

            return;
        }


        // 將資料放入修改表單
        document.getElementById(
            "editId"
        ).value =
            equipment.id;


        document.getElementById(
            "editName"
        ).value =
            equipment.name;


        document.getElementById(
            "editCategory"
        ).value =
            equipment.category;


        document.getElementById(
            "editStatus"
        ).value =
            equipment.status;


        document.getElementById(
            "editDescription"
        ).value =
            equipment.description || "";


        // 顯示修改區域
        document.getElementById(
            "editSection"
        ).style.display =
            "block";


        // 捲動到修改區域
        document.getElementById(
            "editSection"
        ).scrollIntoView({

            behavior: "smooth"

        });


    } catch (error) {

        console.error(
            "取得設備資料失敗：",
            error
        );

        alert(
            "無法取得設備資料"
        );

    }

}


// ========================================
// 儲存設備修改
// ========================================

async function saveEquipment(event) {

    // 防止表單重新整理
    event.preventDefault();


    // 確認是否為管理員
    if (role !== "admin") {

        alert(
            "只有管理員可以修改設備"
        );

        return;
    }


    // 取得設備 ID
    const id =
        document.getElementById(
            "editId"
        ).value;


    // 取得修改後資料
    const equipmentData = {

        name:
            document.getElementById(
                "editName"
            ).value.trim(),

        category:
            document.getElementById(
                "editCategory"
            ).value.trim(),

        status:
            document.getElementById(
                "editStatus"
            ).value,

        description:
            document.getElementById(
                "editDescription"
            ).value.trim()

    };


    try {

        // 發送 PUT Request
        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            equipmentData
                        )

                }
            );


        // 取得回傳資料
        const result =
            await response.json();


        // Token 失效
        if (response.status === 401) {

            logout();

            return;
        }


        // 沒有權限
        if (response.status === 403) {

            alert(
                "你沒有權限修改設備"
            );

            return;
        }


        // 修改失敗
        if (!response.ok) {

            alert(
                result.message ||
                "設備修改失敗"
            );

            return;
        }


        // 修改成功
        alert(
            "設備修改成功！"
        );


        // 清空表單
        document
            .getElementById(
                "editEquipmentForm"
            )
            .reset();


        // 隱藏修改區域
        document.getElementById(
            "editSection"
        ).style.display =
            "none";


        // 重新載入設備
        await loadEquipment();


    } catch (error) {

        console.error(
            "修改設備失敗：",
            error
        );

        alert(
            "無法連接後端伺服器"
        );

    }

}


// ========================================
// 取消修改
// ========================================

function cancelEdit() {

    // 清空表單
    document
        .getElementById(
            "editEquipmentForm"
        )
        .reset();


    // 隱藏修改區域
    document.getElementById(
        "editSection"
    ).style.display =
        "none";

}


// ========================================
// 登出
// ========================================

function logout() {

    // 清除登入資訊
    localStorage.removeItem("token");

    localStorage.removeItem("username");

    localStorage.removeItem("name");

    localStorage.removeItem("role");


    // 導向登入頁面
    window.location.href =
        "./login.html";

}


// ========================================
// 借用設備
// ========================================

// 使用者按下「借用設備」後執行
//
// API：
// POST /borrow/:equipmentId
//
// 需要登入 JWT
async function borrowEquipment(id) {

    // ========================================
    // 確認使用者是否真的要借用
    // ========================================

    const confirmed =
        confirm(
            "確定要借用這台設備嗎？"
        );


    // 使用者取消
    if (!confirmed) {

        return;

    }


    try {

        // ========================================
        // 發送借用 Request
        // ========================================

        const response =
            await fetch(
                `${BORROW_API_URL}/${id}`,
                {

                    // 建立借用紀錄
                    method: "POST",

                    // 傳送 JWT
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
        // 借用失敗
        // ========================================

        if (!response.ok) {

            alert(
                result.message ||
                "設備借用失敗"
            );

            return;

        }


        // ========================================
        // 借用成功
        // ========================================

        alert(
            "設備借用成功！"
        );


        // ========================================
        // 重新載入設備列表
        // ========================================

        // Backend 已經將設備狀態改成 borrowed
        //
        // 所以重新載入後，
        // 畫面會顯示「借出中」

        await loadEquipment();


    } catch (error) {

        // ========================================
        // 網路錯誤
        // ========================================

        console.error(
            "借用設備失敗：",
            error
        );


        alert(
            "無法連接後端伺服器"
        );

    }

}

// ========================================
// 表單事件
// ========================================

// 新增設備表單
const equipmentForm =
    document.getElementById(
        "equipmentForm"
    );


if (equipmentForm) {

    equipmentForm.addEventListener(
        "submit",
        addEquipment
    );

}


// 修改設備表單
const editEquipmentForm =
    document.getElementById(
        "editEquipmentForm"
    );


if (editEquipmentForm) {

    editEquipmentForm.addEventListener(
        "submit",
        saveEquipment
    );

}


// 取消修改按鈕
const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );


if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        cancelEdit
    );

}


// ========================================
// 網頁載入時執行
// ========================================

// 取得設備列表
loadEquipment();