# 設備管理系統（Equipment Management System）

## 專案簡介

本專案為一套全端設備管理系統，提供設備管理、設備借用、設備歸還、使用者管理與借用紀錄查詢等功能，協助管理設備使用情況，降低人工管理成本。

本系統採用前後端分離架構：

- 前端使用 HTML、CSS、JavaScript 開發
- 後端使用 Node.js 與 Express 建立 RESTful API
- 資料庫使用 MySQL
- 使用 JWT（JSON Web Token）進行登入驗證
- 使用 Role-Based Access Control（RBAC）進行管理員與一般使用者的權限控管

---

# 專案功能

## 一般使用者

一般使用者登入後可以：

- 使用者註冊
- 使用者登入
- 查看設備列表
- 搜尋設備
- 篩選設備
- 查看設備目前狀態
- 借用可借用設備
- 歸還自己借用的設備
- 查看自己的借用紀錄
- 登出

---

## 管理員

管理員登入後除了可以使用一般使用者功能外，還可以：

- 新增設備
- 修改設備資訊
- 刪除設備
- 查看所有借用紀錄
- 根據使用者查詢借用紀錄
- 根據借用狀態篩選紀錄
- 清除借用紀錄篩選條件

---

# 使用者權限

系統目前分為兩種角色：

| 角色 | 功能 |
|---|---|
| `user` | 查看設備、搜尋／篩選、借用設備、歸還設備、查看自己的借用紀錄 |
| `admin` | 包含 user 所有功能，並可新增、修改、刪除設備，以及查看所有借用紀錄 |

系統使用 JWT 驗證使用者身份，並透過 Middleware 判斷使用者角色。

權限驗證流程：

```text
使用者登入
    ↓
Backend 驗證帳號密碼
    ↓
建立 JWT Token
    ↓
Frontend 儲存 Token
    ↓
Request 時帶入 Authorization Header
    ↓
authenticateToken
    ↓
取得 req.user
    ↓
requireRole("admin")
    ↓
判斷是否具有管理員權限
```

---

# 設備管理功能

## 查看設備

使用者可以查看目前系統中的所有設備。

設備資訊包含：

- 設備名稱
- 設備分類
- 設備狀態
- 設備描述

設備狀態：

- `available`：可借用
- `borrowed`：借出中

---

## 搜尋與篩選設備

使用者可以透過搜尋／篩選功能快速找到需要的設備。

可以依照設備資訊進行查詢，並即時更新設備列表。

---

## 新增設備

只有管理員可以新增設備。

新增設備時可以設定：

- 設備名稱
- 設備分類
- 設備狀態
- 設備描述

---

## 修改設備

管理員可以修改現有設備資訊，包括：

- 設備名稱
- 設備分類
- 設備狀態
- 設備描述

---

## 刪除設備

管理員可以刪除設備。

系統在前端會先要求確認，避免誤刪設備。

---

# 設備借用系統

使用者可以直接從設備列表借用目前狀態為「可借用」的設備。

借用流程：

```text
使用者登入
    ↓
查看設備
    ↓
選擇可借用設備
    ↓
點擊「借用設備」
    ↓
Backend 驗證 JWT
    ↓
確認設備存在
    ↓
確認設備目前可借用
    ↓
建立 borrow_records
    ↓
更新設備狀態為 borrowed
    ↓
借用成功
```

借用成功後：

```text
equipment.status
available
    ↓
borrowed
```

同時會在 `borrow_records` 建立借用紀錄。

---

# 設備歸還

使用者只能歸還自己借用的設備。

歸還流程：

```text
使用者進入「我的借用紀錄」
    ↓
找到借用中的設備
    ↓
點擊「歸還」
    ↓
Backend 驗證 JWT
    ↓
確認借用紀錄存在
    ↓
確認紀錄屬於目前使用者
    ↓
更新 borrow_records
    ↓
更新設備狀態為 available
    ↓
歸還成功
```

歸還後：

```text
borrow_records.status
borrowed
    ↓
returned
```

並記錄：

```text
returned_at
```

---

# 我的借用紀錄

一般使用者可以查看自己的借用紀錄。

顯示資訊包含：

- 設備名稱
- 設備分類
- 借用時間
- 歸還時間
- 借用狀態

使用者只能查看自己的紀錄，無法查看其他使用者的借用資料。

---

# 管理員借用紀錄

管理員可以查看系統中的所有借用紀錄。

紀錄包含：

- 使用者姓名
- 使用者帳號
- 設備名稱
- 設備分類
- 借用時間
- 歸還時間
- 借用狀態

管理員可以：

- 查看全部紀錄
- 根據使用者篩選
- 根據借用狀態篩選
- 清除篩選條件

使用者篩選方式為下拉選單，可以直接選擇指定使用者。

---

# Dashboard

系統首頁提供設備統計資訊：

- 設備總數
- 可借用設備數
- 借出中設備數

讓使用者可以快速了解目前設備使用狀況。

---

# 技術架構

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap

Frontend 主要負責：

- 使用者介面
- 表單操作
- 設備列表顯示
- 搜尋與篩選
- 登入狀態管理
- JWT Token 儲存
- 呼叫 Backend API

---

## Backend

- Node.js
- Express
- RESTful API
- CORS
- JWT
- bcrypt

Backend 主要負責：

- 使用者註冊
- 使用者登入
- JWT 驗證
- 使用者權限驗證
- 設備 CRUD
- 設備借用
- 設備歸還
- 借用紀錄管理

---

## Database

- MySQL 8.0

目前資料庫包含三個主要資料表：

```text
users
equipment
borrow_records
```

---

# 資料庫設計

## users

儲存系統使用者資訊。

主要欄位：

```text
id
username
password
name
role
created_at
updated_at
```

其中：

```text
role = admin
role = user
```

用來區分管理員與一般使用者。

---

## equipment

儲存設備資訊。

主要包含：

```text
id
name
category
status
description
created_at
updated_at
```

設備狀態：

```text
available
borrowed
```

---

## borrow_records

儲存設備借用紀錄。

主要包含：

```text
id
user_id
equipment_id
borrowed_at
returned_at
status
created_at
updated_at
```

其中：

```text
user_id
    ↓
users.id

equipment_id
    ↓
equipment.id
```

透過資料表關聯，可以查詢：

```text
誰借了什麼設備
何時借用
是否歸還
何時歸還
```

---

# API

## User API

### 註冊

```http
POST /users/register
```

---

### 登入

```http
POST /users/login
```

登入成功後 Backend 會回傳 JWT Token 與使用者資訊。

例如：

```json
{
    "message": "登入成功",
    "token": "JWT_TOKEN",
    "user": {
        "id": 1,
        "username": "admin",
        "name": "系統管理員",
        "role": "admin"
    }
}
```

---

# Equipment API

### 取得所有設備

```http
GET /equipment
```

---

### 取得單一設備

```http
GET /equipment/:id
```

---

### 新增設備

```http
POST /equipment
```

需要：

```text
JWT
+
admin 權限
```

---

### 修改設備

```http
PUT /equipment/:id
```

---

### 刪除設備

```http
DELETE /equipment/:id
```

---

# Borrow API

### 借用設備

```http
POST /borrow/:equipmentId
```

需要登入。

---

### 查看自己的借用紀錄

```http
GET /borrow/my
```

需要登入。

---

### 歸還設備

```http
POST /borrow/:borrowId/return
```

需要登入，且只能歸還自己的借用紀錄。

---

### 查看所有借用紀錄

```http
GET /borrow
```

需要：

```text
JWT
+
admin 權限
```

---

# Middleware

系統使用 Middleware 進行 API 權限控制。

## authenticateToken

負責：

- 驗證 JWT Token
- 確認使用者是否登入
- 解析 Token
- 將使用者資訊放入 `req.user`

例如：

```javascript
req.user
```

可以取得：

```text
id
username
name
role
```

---

## requireRole

負責確認使用者是否具有指定角色。

例如：

```javascript
requireRole("admin")
```

只有 `admin` 可以通過。

---

# 專案架構

```text
equipment-management-system
│
├── backend
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── borrowController.js
│   │   ├── equipmentController.js
│   │   └── userController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateEquipment.js
│   │
│   ├── models
│   │   ├── borrowModel.js
│   │   ├── equipmentModel.js
│   │   └── userModel.js
│   │
│   ├── routes
│   │   ├── borrow.js
│   │   ├── equipment.js
│   │   └── user.js
│   │
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   │
│   ├── js
│   │   ├── my-borrows.js
│   │   └── admin-borrows.js
│   │
│   ├── index.html
│   ├── my-borrows.html
│   ├── admin-borrows.html
│   ├── login.html
│   ├── register.html
│   ├── app.js
│   └── style.css
│
├── database
│
├── docs
│
├── .gitignore
│
└── README.md
```

---

# 系統操作流程

## 一般使用者

```text
註冊
 ↓
登入
 ↓
查看設備
 ↓
搜尋／篩選設備
 ↓
借用設備
 ↓
我的借用紀錄
 ↓
歸還設備
```

---

## 管理員

```text
登入
 ↓
設備 Dashboard
 ↓
新增／修改／刪除設備
 ↓
查看設備狀態
 ↓
查看所有借用紀錄
 ↓
依使用者篩選
 ↓
依狀態篩選
```

---

# 安裝與執行

## 1. Clone Repository

```bash
git clone https://github.com/411147461/equipment-management-system.git
```

進入專案：

```bash
cd equipment-management-system
```

---

## 2. 安裝 Backend 套件

```bash
cd backend
npm install
```

---

## 3. 設定 MySQL

建立資料庫：

```sql
CREATE DATABASE equipment_management;
```

建立以下資料表：

```text
users
equipment
borrow_records
```

並確認 Backend 的資料庫連線設定正確。

---

## 4. 啟動 Backend

在：

```text
backend
```

目錄執行：

```bash
node app.js
```

成功後應看到：

```text
Server is running on http://localhost:3000
```

---

## 5. 啟動 Frontend

使用 VS Code 的 Live Server 或其他 HTTP Server 開啟：

```text
frontend/index.html
```

即可使用系統。

---

# 環境需求

目前開發環境：

```text
Node.js v24.18.0
npm 11.16.0
MySQL 8.0.46
```

主要 Backend 套件：

```text
express
cors
bcrypt
jsonwebtoken
mysql2
```

---

# 安全性設計

本專案目前加入以下基本安全機制：

### 密碼加密

使用 `bcrypt` 處理使用者密碼，避免直接將明文密碼儲存在資料庫。

---

### JWT Authentication

登入成功後由 Backend 發行 JWT Token。

Frontend 後續呼叫需要登入的 API 時，會透過：

```http
Authorization: Bearer <token>
```

傳送 Token。

---

### Role-Based Authorization

透過使用者的 `role` 判斷權限。

例如：

```javascript
requireRole("admin")
```

避免一般使用者直接呼叫管理員 API。

---

### 使用者資料隔離

一般使用者查看自己的借用紀錄時，Backend 會從 JWT 取得：

```javascript
req.user.id
```

而不是讓使用者自行指定 `user_id`。

因此使用者無法透過修改前端參數查看其他人的借用紀錄。

---

# Git 版本控制

本專案使用 Git 進行版本控制，並使用 GitHub 儲存 Repository。

Repository：

```text
https://github.com/411147461/equipment-management-system
```

主要分支：

```text
main
```

---

# 開發進度

目前主要功能已完成：

- [x] 建立 Git Repository
- [x] 建立 GitHub Repository
- [x] 建立 README
- [x] 建立 Node.js Backend
- [x] 建立 Express RESTful API
- [x] 建立 MySQL 資料庫
- [x] 建立 users 資料表
- [x] 建立 equipment 資料表
- [x] 建立 borrow_records 資料表
- [x] 使用者註冊
- [x] 使用者登入
- [x] bcrypt 密碼加密
- [x] JWT Authentication
- [x] Admin / User 權限控制
- [x] 設備列表
- [x] 設備搜尋
- [x] 設備篩選
- [x] 新增設備
- [x] 修改設備
- [x] 刪除設備
- [x] 設備借用
- [x] 設備歸還
- [x] 我的借用紀錄
- [x] Admin 所有借用紀錄
- [x] Admin 使用者篩選
- [x] Admin 借用狀態篩選
- [x] Dashboard 設備統計
- [x] 前端登入狀態管理
- [x] 登出功能
- [x] 基本錯誤處理
- [x] 完成功能與權限測試

---

# 未來規劃

目前系統已完成核心設備管理與借還功能，後續可以再加入：

- [ ] 使用者管理介面
- [ ] Admin 管理使用者
- [ ] 設備圖片上傳
- [ ] 設備借用申請／審核流程
- [ ] 借用期限
- [ ] 逾期提醒
- [ ] Email 通知
- [ ] 更完整的 Dashboard 統計圖表
- [ ] 操作紀錄（Audit Log）
- [ ] API 文件
- [ ] 部署至雲端伺服器

---

# 專案特色

本專案除了基本的設備 CRUD 外，也實作了完整的設備借還流程。

主要特色包括：

```text
使用者系統
    ↓
JWT Authentication
    ↓
Role-Based Authorization
    ↓
設備 CRUD
    ↓
設備借用
    ↓
設備歸還
    ↓
借用紀錄
    ↓
Admin 管理與查詢
```

透過前後端分離架構，Frontend 負責使用者介面與操作，Backend 負責 API、商業邏輯與權限驗證，MySQL 負責資料持久化。

---

# 作者

陳晧綸