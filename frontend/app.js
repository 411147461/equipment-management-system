// 後端 API 的網址
const API_URL = "http://localhost:3000/equipment";


// 載入設備列表
async function loadEquipment() {

    try {

        // 向後端 API 發送 GET Request
        const response = await fetch(API_URL);

        // 將後端回傳的 JSON 轉成 JavaScript 資料
        const equipmentList = await response.json();

        // 找到 HTML 中的設備列表區域
        const container = document.getElementById("equipmentList");

        // 清空原本的「載入中...」
        container.innerHTML = "";

        // 將每一筆設備資料顯示在畫面上
        equipmentList.forEach(equipment => {

            // 建立設備卡片
            const card = document.createElement("div");

            card.className = "equipment-card";

            // 將設備資料放進卡片
            card.innerHTML = `
                <h3>${equipment.name}</h3>

                <p>
                    <strong>分類：</strong>
                    ${equipment.category}
                </p>

                <p>
                    <strong>狀態：</strong>
                    ${equipment.status}
                </p>

                <p>
                    <strong>描述：</strong>
                    ${equipment.description || "無"}
                </p>
            `;

            // 將卡片加入設備列表
            container.appendChild(card);
        });

    } catch (error) {

        // 如果 API 連線失敗，在 Console 顯示錯誤
        console.error("載入設備失敗：", error);

        // 顯示錯誤訊息
        document.getElementById("equipmentList").innerHTML =
            "<p>無法載入設備資料</p>";
    }
}


// 網頁載入完成後，自動取得設備資料
loadEquipment();