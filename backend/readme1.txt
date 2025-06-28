📌 Expense Management System — Design Documentation
📝 Project Overview
This is a secure Expense Management System built with:

Angular Frontend

Spring Boot Backend

MySQL / Supabase Database

JWT-based Authentication

Role-based Authorization

👉 Supports Admin, Manager, Employee, and optional Finance roles.

🚀 Authentication & Security Flow
All users must login through POST /api/auth/login.

Successful login issues a JWT token containing username and roles.

Each secured API endpoint requires the Authorization: Bearer <token> header.

Spring Security verifies:

Is token valid and not expired?

Does token contain required role?

Unauthorized users get 401; forbidden access gets 403.

🗺 High-Level API Design
HTTP	Endpoint	Role	Description
POST	/api/auth/login	All	User login, return JWT
POST	/api/auth/admin/create-user	ROLE_ADMIN	Create new user with role
DELETE	/api/auth/admin/delete-user/{id}	ROLE_ADMIN	Delete user
GET	/api/admin/dashboard	ROLE_ADMIN	Admin dashboard data
POST	/api/expense	ROLE_EMPLOYEE	Submit new expense
GET	/api/expense/my-expenses	ROLE_EMPLOYEE	View own expenses
GET	/api/expense/all	ROLE_MANAGER	View all employee expenses
PUT	/api/expense/approve/{id}	ROLE_MANAGER	Approve an expense
PUT	/api/expense/reject/{id}	ROLE_MANAGER	Reject an expense
DELETE	/api/expense/{id}	ROLE_ADMIN	Delete any expense (admin)

🛡 Security Rules
Admin-only APIs: /api/admin/**, /api/auth/admin/**

Employee APIs: Can create & view own expenses

Manager APIs: Can view, approve, reject expenses

Common security pattern:

hasAuthority("ROLE_ADMIN") for admin endpoints

hasAuthority("ROLE_MANAGER") for manager endpoints

hasAuthority("ROLE_EMPLOYEE") for employee endpoints

🌱 CRUD Functionalities
✅ Create
Admin: Create users

Employee: Submit expenses

✅ Read
Employee: View their expenses

Manager: View all submitted expenses

Admin: View dashboards, users

✅ Update
Manager: Approve/reject expenses

Admin: Update users (optional)

✅ Delete
Admin: Delete users, expenses

🌟 Architecture Flow
text
Copy
Edit
Frontend Angular App
    |
    | 1️⃣ Login → POST /api/auth/login
    | 2️⃣ Token received (stored in localStorage/sessionStorage)
    |
    | 3️⃣ API requests with Authorization: Bearer <token>
    |
Backend Spring Boot
    |
    | Token verified → role checked → controller called
    |
    | Service → DB actions → Response
⚡ Best Practices Followed
✅ Token expiry (~1 hr) to avoid misuse
✅ Roles enforced at backend level
✅ No sensitive info in API responses
✅ Proper error handling (401, 403, 404)
✅ RESTful endpoints (clean URLs + HTTP methods)

🌈 Future Enhancements
🔹 Expense report download (PDF, Excel)

🔹 Audit trail for actions

🔹 Soft delete (is_deleted flag)

🔹 Email notifications (approval/rejection)

🔹 Refresh token mechanism

📌 Example Secured API Flow
Employee submits expense:
bash
Copy
Edit
POST /api/expense
Authorization: Bearer <employee-token>
Response:

json
Copy
Edit
{
  "message": "Expense submitted successfully"
}
Manager approves expense:
bash
Copy
Edit
PUT /api/expense/approve/{id}
Authorization: Bearer <manager-token>
Response:

json
Copy
Edit
{
  "message": "Expense approved"
}
⚙ Tech Stack Summary
Frontend: Angular + Tailwind (optional)

Backend: Spring Boot (3.x), Spring Security

DB: MySQL / Supabase

Auth: JWT (HS256 secret key, Base64 encoded)

💡 Final Notes
✅ Project design follows real-world production security practices.
✅ Clean separation of concerns — controller → service → repo.
✅ Every secured API is role-guarded to prevent unauthorized access.

🚀 Conclusion
This README serves as the blueprint for the backend-secured API and system design for your Expense Management System.