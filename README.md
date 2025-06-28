

# 💼 Expense Management System (ZIDIO Internal ERP Module)

> A role-based full-stack web application to streamline expense submissions, approvals, and audit workflows across employees, managers, finance, and admins.

---

## 🚀 Project Overview

This system enables a seamless, multi-level approval process for expense claims inside an enterprise. Users can submit expenses, attach supporting files, and track approval status through intuitive dashboards.

---
🧪 Key Features
🔐 Secure login per role (JWT + Route Guard)

📄 PDF upload with each submission

🔍 Real-time review modal for row-level decisions

📊 Charts for analytics (Pending, Approved, Rejected)

💬 Confirmation dialog for actions

🎨 Responsive dashboard with tooltips, badges, and status colors

📜 Auto-generated Submission Numbers: SUBM-YYYYMMDD-XXX

🛠️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/expense-management-system.git
2. Run the Backend
bash
Copy
Edit
cd backend
./mvnw spring-boot:run
3. Run the Frontend
bash
Copy
Edit
cd frontend
npm install
ng serve --open
4. Environment Config
Update the following in .env or application.properties:

properties
Copy
Edit
spring.datasource.url=...
jwt.secret=...
supabase.url=...
📸 Screenshots
Add high-quality images or GIFs here showing:

Dashboard per role

Modal drill-down

Submission workflow

Approval badges

Mobile responsiveness

📈 Roadmap
 Manager → Finance → Admin approval flow

 File attachment and storage

 Email notifications on status change

 Export reports (CSV/PDF)

📄 License
This project is licensed under the MIT License.

🤝 Acknowledgements
ZIDIO ERP Design Team

Angular & Spring Boot Documentation

Supabase Community
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
