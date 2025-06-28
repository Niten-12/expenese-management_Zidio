

# 💼 Expense Management System (ZIDIO Internal ERP Module)

> A role-based full-stack web application to streamline expense submissions, approvals, and audit workflows across employees, managers, finance, and admins.

---

## 🚀 Project Overview

This system enables a seamless, multi-level approval process for expense claims inside an enterprise. Users can submit expenses, attach supporting files, and track approval status through intuitive dashboards.

---

## 🔧 Tech Stack

### 🔹 Frontend
- **Framework**: Angular 17 (Standalone Components + Modular Routing)
- **Styling**: Tailwind CSS, Material UI
- **State Management**: Angular Services
- **Auth**: JWT + Role-Based Guards
- **UX Tools**: Charts.js, Modals, Tooltips, Responsive Design

### 🔹 Backend
- **Framework**: Spring Boot 3
- **Architecture**: Layered (Controller, Service, Repository, DTO, Model)
- **Security**: Spring Security + JWT
- **Database**: Supabase PostgreSQL
- **File Upload**: Multipart + PDF + Storage Integration
- **Enums**: Dynamic Workflow with Status Constants

---

## 🧠 Roles & Features

| Role      | Capabilities |
|-----------|--------------|
| **Employee** | Submit expenses, upload files |
| **Manager**  | View & approve/reject team submissions |
| **Finance**  | Review approved expenses, row-wise validation |
| **Admin**    | Final approval, user creation, analytics & history |

---

## 📁 Folder Structure

```bash
📦frontend/
 ┣ 📂app/
 ┃ ┣ 📂pages/
 ┃ ┃ ┣ 📂admin/
 ┃ ┃ ┣ 📂employee/
 ┃ ┃ ┣ 📂manager/
 ┃ ┃ ┣ 📂finance/
 ┃ ┣ 📂services/
 ┃ ┣ 📂shared/
 ┃ ┗ app.routes.ts
📦backend/
 ┣ 📂controller/
 ┣ 📂service/
 ┣ 📂repository/
 ┣ 📂model/
 ┣ 📂dto/
 ┣ 📂payload/
 ┣ 📂config/
 ┣ 📂exception/
 ┣ 📜application.properties
 ┣ 📜MainApplication.java
