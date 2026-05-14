Smart Complaint & Escalation Management System
A production-oriented full-stack complaint management platform built using the MERN stack.
The system supports role-based workflows, priority-based resolution logic, escalation handling, and audit logging.
🚀 Features
🔐 Authentication & Authorization
JWT-based authentication
Password hashing using bcrypt
Role-Based Access Control (RBAC)
Roles:
User → Create and view own complaints
Agent → Work on assigned complaints
Admin → Assign, escalate, and monitor complaints
📋 Complaint Workflow
Create complaints with priority levels:
LOW
MEDIUM
HIGH
Complaint lifecycle:
Plain text
OPEN → IN_PROGRESS → RESOLVED → REOPEN
Reopen resolved complaints if issue persists
⚡ Priority Enforcement
The system enforces business rules:
Agents can work on multiple complaints simultaneously
Lower-priority complaints cannot be resolved while HIGH priority complaints remain unresolved
This ensures critical issues are handled first.
🔁 Escalation System
Admins can:
Reassign complaints through escalation
Add escalation remarks
Track reassignment history
Escalation improves workflow flexibility while maintaining accountability.
📝 Activity Audit Logging
Every major action is tracked:
Complaint assignment
Status changes
Escalation
Reopen actions
Each log stores:
Action type
Previous value
New value
Performed by
Timestamp
Remarks
This creates a complete audit trail.
🎨 Frontend Features
Role-based dashboards
Protected frontend routes
Toast notifications
Complaint statistics dashboard
Responsive UI
🛠️ Tech Stack
Frontend
React (Vite)
React Router DOM
Axios
React Toastify
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Deployment
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
🧠 System Architecture
Plain text
Frontend (React)
       ↓
REST APIs
       ↓
Express Routes
       ↓
Middleware (Auth + RBAC)
       ↓
Controllers
       ↓
MongoDB Database
🔐 Authentication Flow
Plain text
User Login
   ↓
Password verification using bcrypt
   ↓
JWT token generated
   ↓
Token stored in localStorage
   ↓
Token sent in Authorization header
   ↓
Backend middleware verifies token
📂 Folder Structure
Plain text
complaint-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
📌 Key APIs
Auth
Http
POST /api/auth/register
POST /api/auth/login
Complaints
Http
POST /api/complaints
GET /api/complaints/my
PUT /api/complaints/:id/status
PUT /api/complaints/:id/assign
PUT /api/complaints/:id/escalate
Logs
Http
GET /api/complaints/:id/logs
🔥 Key Learnings
JWT Authentication
Role-Based Authorization
REST API Design
Workflow Enforcement
Priority-Based Resolution Logic
Audit Logging
Frontend Route Protection
Full-Stack Deployment
📈 Future Improvements
Email notifications
Redis caching
Real-time updates using Socket.io
Analytics dashboard
SLA-based auto escalation
File attachments
👨‍💻 Author
Varad
⭐ Resume Highlights
Designed a workflow-driven complaint management system with role-based access control
Implemented priority enforcement and escalation handling
Built audit logging system for lifecycle tracking
Developed secure REST APIs using JWT authentication
Deployed full-stack MERN application using Render and Vercel
