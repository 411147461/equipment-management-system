# 設備管理系統（Equipment Management System）

## 專案簡介

本專案為一套全端設備管理系統，主要用於管理設備資訊、設備借用與歸還紀錄。

系統採用前後端分離架構，前端負責使用者介面與操作，後端提供 RESTful API，並透過 MySQL 儲存使用者、設備與借用紀錄。

本專案同時實作 JWT 登入驗證與角色權限管理，區分一般使用者（User）與管理員（Admin）的操作權限。

---

## 專案功能

### 一般使用者（User）

- 使用者註冊
- 使用者登入
- JWT 身份驗證
- 查看設備列表
- 查看設備目前狀態
- 借用可用設備
- 歸還自己借用的設備
- 查看自己的借用紀錄

### 管理員（Admin）

- 查看設備列表
- 新增設備
- 修改設備資訊
- 刪除設備
- 查看所有借用紀錄
- 查看所有使用者的借用狀態

---

## 權限設計

系統使用 JWT 進行身份驗證，並透過使用者角色限制 API 操作權限。

| 功能 | User | Admin |
|---|:---:|:---:|
| 查看設備 | ✓ | ✓ |
| 借用設備 | ✓ | ✓ |
| 歸還設備 | ✓ | ✓ |
| 查看自己的借用紀錄 | ✓ | ✓ |
| 新增設備 | ✗ | ✓ |
| 修改設備 | ✗ | ✓ |
| 刪除設備 | ✗ | ✓ |
| 查看所有借用紀錄 | ✗ | ✓ |

---

## 技術架構

### Frontend

- HTML
- CSS
- Bootstrap
- JavaScript
- Fetch API
- LocalStorage

### Backend

- Node.js
- Express
- RESTful API
- JWT
- bcrypt
- CORS

### Database

- MySQL

---

## 系統架構

```text
┌─────────────────────────┐
│        Frontend         │
│                         │
│ HTML / CSS / JavaScript │
│                         │
│ Fetch API               │
└────────────┬────────────┘
             │ HTTP Request
             │
             ▼
┌─────────────────────────┐
│        Backend          │
│                         │
│ Node.js + Express       │
│                         │
│ JWT Authentication      │
│ Role Authorization      │
│ RESTful API             │
└────────────┬────────────┘
             │
             │ SQL
             ▼
┌─────────────────────────┐
│         MySQL           │
│                         │
│ users                   │
│ equipment               │
│ borrow_records          │
└─────────────────────────┘