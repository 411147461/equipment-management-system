// =========================
// API 設定
// =========================

// 後端設備 API 的網址
const API_URL = "http://localhost:3000/equipment";


// =========================
// 取得設備列表
// =========================

async function loadEquipment() {

    try {

        // 向後端 API 發送 GET Request
        const response = await fetch(API_URL);

        // 將後端回傳的 JSON 轉成 JavaScript 資料
        const equipmentList = await response.json();

        // 找到 HTML 中的設備列表區域
        const container = document.getElementById("equipmentList");

        // 清除原本的「載入中...」
        container.innerHTML = "";


        // 將每一筆設備資料顯示在畫面上
        equipmentList.forEach(equipment => {

            // 建立一個新的 div
            const card = document.createElement("div");

            // 設定設備卡片的 CSS class
            card.className = "equipment-card";


            // 將設備資料放入卡片
            card.innerHTML = `
                <h3>${equipment.name}</h3>

                <p>
                    <strong>分類：</strong>
                    ${equipment.category}
                </p>
                <strong>狀態：</strong>
                <span class="status ${equipment.status}">
                    ${
                        equipment.status === "available"
                            ? "可借用"
                            : "借出中"
                    }
                </span>

                <p>
                    <strong>描述：</strong>
                    ${equipment.description || "無"}
                </p>

                <!-- 設備操作按鈕 -->
                <div class="equipment-actions">

                    <!-- 修改設備 -->
                    <button
                        class="edit-button"
                        onclick="editEquipment(${equipment.id})"
                    >
                        修改
                    </button>

                    <!-- 刪除設備 -->
                    <button
                        class="delete-button"
                        onclick="deleteEquipment(${equipment.id})"
                    >
                        刪除
                    </button>

                </div>
            `;

            // 將卡片加入設備列表
            container.appendChild(card);

        });


    } catch (error) {

        // 如果 API 連線失敗
        console.error("載入設備失敗：", error);

        // 顯示錯誤訊息
        document.getElementById("equipmentList").innerHTML =
            "<p>無法載入設備資料</p>";
    }
}



// =========================
// 新增設備
// =========================

async function addEquipment(event) {

    // 阻止 HTML Form 預設的重新整理行為
    event.preventDefault();


    // 取得使用者輸入的資料
    const name = document.getElementById("name").value;

    const category =
        document.getElementById("category").value;

    const status =
        document.getElementById("status").value;

    const description =
        document.getElementById("description").value;


    // 建立要送給後端的資料
    const equipmentData = {

        name: name,

        category: category,

        status: status,

        description: description

    };


    try {

        // 向後端發送 POST Request
        const response = await fetch(API_URL, {

            // 指定 HTTP Method
            method: "POST",

            // 告訴後端我們傳送的是 JSON
            headers: {
                "Content-Type": "application/json"
            },

            // 將 JavaScript Object 轉成 JSON 字串
            body: JSON.stringify(equipmentData)

        });


        // 取得後端回傳的 JSON
        const result = await response.json();


        // 如果 HTTP Status 不是 2xx
        if (!response.ok) {

            // 顯示後端傳回的錯誤
            alert(result.message);

            return;
        }


        // 新增成功
        alert("設備新增成功！");


        // 清空表單
        document.getElementById("equipmentForm").reset();


        // 重新取得設備列表
        await loadEquipment();


    } catch (error) {

        // 如果無法連接後端
        console.error("新增設備失敗：", error);

        alert("無法連接後端伺服器");

    }

}
// =========================
// 刪除設備
// =========================

async function deleteEquipment(id) {

    // 先詢問使用者是否確定要刪除
    const confirmed = confirm(
        "確定要刪除這台設備嗎？"
    );

    // 使用者按取消
    if (!confirmed) {
        return;
    }


    try {

        // 發送 DELETE Request
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        // 取得後端回傳資料
        const result = await response.json();


        // 如果刪除失敗
        if (!response.ok) {

            alert(result.message);

            return;
        }


        // 顯示成功訊息
        alert("設備刪除成功！");


        // 重新取得設備列表
        await loadEquipment();


    } catch (error) {

        // 顯示錯誤
        console.error(
            "刪除設備失敗：",
            error
        );

        alert(
            "無法連接後端伺服器"
        );
    }
}
// =========================
// 開啟修改設備表單
// =========================

async function editEquipment(id) {

    try {

        // 取得指定設備目前的資料
        const response = await fetch(
            `${API_URL}/${id}`
        );

        // 將 JSON 轉成 JavaScript Object
        const equipment = await response.json();


        // 如果找不到設備
        if (!response.ok) {

            alert(equipment.message);

            return;
        }


        // 將設備 ID 放進隱藏欄位
        document.getElementById("editId").value =
            equipment.id;


        // 將設備名稱放入表單
        document.getElementById("editName").value =
            equipment.name;


        // 將設備分類放入表單
        document.getElementById("editCategory").value =
            equipment.category;


        // 將設備狀態放入表單
        document.getElementById("editStatus").value =
            equipment.status;


        // 將設備描述放入表單
        document.getElementById("editDescription").value =
            equipment.description || "";


        // 顯示修改表單
        document.getElementById("editSection").style.display =
            "block";


        // 將畫面捲到修改表單的位置
        document.getElementById("editSection")
            .scrollIntoView({
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
// =========================
// 儲存修改後的設備
// =========================

async function saveEquipment(event) {

    // 阻止表單預設重新整理
    event.preventDefault();


    // 取得正在修改的設備 ID
    const id =
        document.getElementById("editId").value;


    // 取得表單資料
    const name =
        document.getElementById("editName").value;

    const category =
        document.getElementById("editCategory").value;

    const status =
        document.getElementById("editStatus").value;

    const description =
        document.getElementById("editDescription").value;


    // 建立要送給後端的資料
    const equipmentData = {

        name: name,

        category: category,

        status: status,

        description: description

    };


    try {

        // 發送 PUT Request
        const response = await fetch(
            `${API_URL}/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(
                    equipmentData
                )

            }
        );


        // 取得後端回傳資料
        const result =
            await response.json();


        // 如果修改失敗
        if (!response.ok) {

            alert(result.message);

            return;
        }


        // 顯示成功訊息
        alert("設備修改成功！");


        // 清空修改表單
        document
            .getElementById("editEquipmentForm")
            .reset();


        // 隱藏修改表單
        document.getElementById("editSection")
            .style.display = "none";


        // 重新取得設備列表
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
// =========================
// 取消修改
// =========================

function cancelEdit() {

    // 清空修改表單
    document
        .getElementById("editEquipmentForm")
        .reset();


    // 隱藏修改表單
    document.getElementById("editSection")
        .style.display = "none";
}

// =========================
// 表單事件
// =========================

// 找到修改設備表單
const editEquipmentForm =
    document.getElementById(
        "editEquipmentForm"
    );


// 當使用者按下「儲存修改」
editEquipmentForm.addEventListener(
    "submit",
    saveEquipment
);


// 找到取消按鈕
const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );


// 當使用者按下「取消」
cancelEditButton.addEventListener(
    "click",
    cancelEdit
);


// =========================
// 網頁載入時執行
// =========================

// 載入設備列表
loadEquipment();