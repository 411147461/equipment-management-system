# 設備管理系統（Equipment Management System）

## 專案簡介

本專案為一套全端設備管理系統，主要用於管理實驗室或社團中的設備，提供設備查詢、設備管理、設備借用與歸還等功能。

系統採用前後端分離架構，前端使用 HTML、CSS 與 JavaScript 開發；後端使用 Node.js 與 Express 建立 RESTful API；資料庫使用 MySQL 儲存使用者、設備及借用紀錄。

系統同時加入 JWT 登入驗證與角色權限管理，區分一般使用者與管理員的操作權限。

---

## 專案功能

### 使用者功能

* 使用者註冊
* 使用者登入
* JWT 身分驗證
* 查看設備列表
* 查看設備詳細資訊
* 借用設備
* 歸還設備
* 查看個人借用紀錄

### 管理員功能

* 管理員登入
* 新增設備
* 修改設備資訊
* 刪除設備
* 查看所有借用紀錄
* 管理設備借用狀態

---

## 權限管理

系統使用角色（Role）區分不同使用者的操作權限。

| 功能       | 一般使用者 | 管理員 |
| -------- | :---: | :-: |
| 登入       |   ✓   |  ✓  |
| 查看設備     |   ✓   |  ✓  |
| 借用設備     |   ✓   |  ✓  |
| 歸還設備     |   ✓   |  ✓  |
| 查看個人借用紀錄 |   ✓   |  ✓  |
| 新增設備     |   ✗   |  ✓  |
| 修改設備     |   ✗   |  ✓  |
| 刪除設備     |   ✗   |  ✓  |
| 查看所有借用紀錄 |   ✗   |  ✓  |

---

## 技術架構

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API
* Local Storage

### Backend

* Node.js
* Express
* RESTful API
* JWT
* bcrypt
* CORS

### Database

* MySQL

### Development Tools

* Visual Studio Code
* Postman
* Git
* GitHub

---

## 系統架構

```text
┌────────────────────────────┐
│          Frontend          │
│                            │
│ HTML / CSS / JavaScript    │
└──────────────┬─────────────┘
               │
               │ HTTP Request
               │ JSON
               ▼
┌────────────────────────────┐
│          Backend           │
│                            │
│ Node.js + Express          │
│                            │
│ ┌────────────────────────┐ │
│ │ Middleware             │ │
│ │ JWT / Role Validation  │ │
│ └───────────┬────────────┘ │
│             │              │
│ ┌───────────▼────────────┐ │
│ │ Controller             │ │
│ └───────────┬────────────┘ │
│             │              │
│ ┌───────────▼────────────┐ │
│ │ Model                  │ │
│ └───────────┬────────────┘ │
└─────────────┼──────────────┘
              │
              │ SQL
              ▼
┌────────────────────────────┐
│           MySQL            │
│                            │
│ users                      │
│ equipment                  │
│ borrow_records             │
└────────────────────────────┘
```

---

## 專案架構

```text
equipment-management-system
│
├── backend
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── equipmentController.js
│   │   ├── userController.js
│   │   └── borrowController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateEquipment.js
│   │
│   ├── models
│   │   ├── equipmentModel.js
│   │   ├── userModel.js
│   │   └── borrowModel.js
│   │
│   ├── routes
│   │   ├── equipment.js
│   │   ├── user.js
│   │   └── borrow.js
│   │
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   │
│   ├── js
│   │   └── my-borrows.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── my-borrows.html
│   ├── app.js
│   └── style.css
│
├── database
│
├── docs
│
├── .gitignore
└── README.md
```

---

## API

### 使用者 API

#### 註冊

```http
POST /users/register
```

#### 登入

```http
POST /users/login
```

登入成功後，Backend 會回傳 JWT Token 與使用者資訊。

---

### 設備 API

#### 取得所有設備

```http
GET /equipment
```

#### 取得單一設備

```http
GET /equipment/:id
```

#### 新增設備

```http
POST /equipment
```

需要：

```text
JWT + Admin
```

#### 修改設備

```http
PUT /equipment/:id
```

需要：

```text
JWT + Admin
```

#### 刪除設備

```http
DELETE /equipment/:id
```

需要：

```text
JWT + Admin
```

---

### 借用 API

#### 借用設備

```http
POST /borrow/:equipmentId
```

需要：

```text
JWT
```

#### 歸還設備

```http
POST /borrow/:borrowId/return
```

需要：

```text
JWT
```

#### 查看自己的借用紀錄

```http
GET /borrow/my
```

需要：

```text
JWT
```

#### 查看所有借用紀錄

```http
GET /borrow
```

需要：

```text
JWT + Admin
```

---

## 資料庫

目前系統主要使用以下資料表：

### users

儲存使用者資訊。

```text
id
username
password
name
role
created_at
updated_at
```

其中 `role` 用來區分：

```text
admin
user
```

### equipment

儲存設備資訊。

```text
id
name
category
status
description
created_at
updated_at
```

設備狀態目前包含：

```text
available
borrowed
```

### borrow_records

儲存設備借用紀錄。

主要記錄：

```text
user_id
equipment_id
borrowed_at
returned_at
status
```

---

## 安裝與執行

### 1. Clone Repository

```bash
git clone <repository-url>
```

### 2. 進入 Backend

```bash
cd backend
```

### 3. 安裝套件

```bash
npm install
```

### 4. 設定環境變數

在 `backend` 建立 `.env`：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=equipment_management
JWT_SECRET=your_secret
```

請依照自己的 MySQL 設定修改。

> `.env` 不應該提交至 Git Repository。

### 5. 啟動 Backend

```bash
node app.js
```

成功後：

```text
Server is running on http://localhost:3000
```

### 6. 啟動 Frontend

可以使用 VS Code Live Server 開啟：

```text
frontend/index.html
```

---

## API 測試

本專案使用 Postman 測試 RESTful API。

主要測試項目：

* 使用者註冊
* 使用者登入
* JWT 驗證
* 設備新增
* 設備查詢
* 設備修改
* 設備刪除
* 設備借用
* 設備歸還
* 借用紀錄查詢

---

## 開發進度

### 基礎環境

* [x] 建立 Git Repository
* [x] 建立 GitHub Repository
* [x] 建立 README
* [x] 建立 Node.js 專案
* [x] 建立 Express Server
* [x] 建立 MySQL 資料庫
* [x] 建立資料庫連線

### 使用者系統

* [x] 使用者註冊
* [x] 使用者登入
* [x] bcrypt 密碼加密
* [x] JWT Token
* [x] JWT Middleware
* [x] Admin / User 角色權限

### 設備管理

* [x] 查詢所有設備
* [x] 查詢單一設備
* [x] 新增設備
* [x] 修改設備
* [x] 刪除設備
* [x] 設備狀態管理
* [x] 前端設備列表
* [x] 前端設備表單

### 借還系統

* [x] 建立 borrow_records 資料表
* [x] 建立借用 Model
* [x] 建立借用 Controller
* [x] 建立借用 API Routes
* [ ] 完成前端借用功能
* [ ] 完成前端歸還功能
* [ ] 完成個人借用紀錄頁面
* [ ] 完成管理員借用紀錄頁面
* [ ] 加入資料庫 Transaction

### UI

* [x] 登入頁面
* [x] 註冊頁面
* [x] 設備管理頁面
* [ ] 完整 Dashboard
* [ ] Responsive Design
* [ ] UI / UX 最終優化

---



## 作者

陳晧綸


