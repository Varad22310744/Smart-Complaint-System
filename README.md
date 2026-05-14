

# 🎫 Smart Complaint & Escalation Management System

**Production-grade full-stack complaint platform — MERN stack**




## 📌 Overview

A workflow-driven complaint management platform supporting **role-based access**, **priority enforcement**, **escalation handling**, and a full **audit trail** — built to reflect real-world enterprise complaint resolution flows.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control (RBAC) across three roles:

| Role | Permissions |
|------|-------------|
| **User** | Create and view own complaints |
| **Agent** | Work on assigned complaints |
| **Admin** | Assign, escalate, and monitor all complaints |

---

### 📋 Complaint Lifecycle

Complaints move through a structured workflow:

```
OPEN → IN_PROGRESS → RESOLVED → (REOPEN if needed)
```

- Create complaints with priority: `LOW` | `MEDIUM` | `HIGH`
- Reopen resolved complaints if the issue persists

---

### ⚡ Priority Enforcement

Business rules enforced at the API level:
- Agents can work multiple complaints simultaneously
- **Lower-priority complaints cannot be resolved while HIGH priority complaints remain open**
- Ensures critical issues are always handled first

---

### 🔁 Escalation System

Admins can:
- Reassign complaints via escalation
- Add escalation remarks
- Track full reassignment history

Maintains accountability while keeping workflows flexible.

---

### 📝 Audit Logging

Every major action is tracked with a structured log entry:

| Field | Description |
|-------|-------------|
| `actionType` | Assignment / Status change / Escalation / Reopen |
| `previousValue` | State before action |
| `newValue` | State after action |
| `performedBy` | User who triggered action |
| `timestamp` | Exact time of action |
| `remarks` | Optional context |

Creates a complete, tamper-evident audit trail per complaint.

---

### 🎨 Frontend
- Role-based dashboards per user type
- Protected routes (no unauthorized access)
- Toast notifications for real-time feedback
- Complaint statistics dashboard
- Responsive UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router DOM, Axios, React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 🏗️ System Architecture

```
Frontend (React)
      │
      ▼
  REST APIs
      │
      ▼
Express Routes
      │
      ▼
Middleware (Auth + RBAC)
      │
      ▼
  Controllers
      │
      ▼
MongoDB Database
```

---

## 🔐 Authentication Flow

```
User Login
    │
    ▼
Password verification (bcrypt)
    │
    ▼
JWT token generated
    │
    ▼
Token stored in localStorage
    │
    ▼
Token sent in Authorization header
    │
    ▼
Backend middleware verifies token
```

---

## 📂 Folder Structure

```
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
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        └── App.jsx
```

---

## 📌 Key APIs

### Auth
```http
POST /api/auth/register
POST /api/auth/login
```

### Complaints
```http
POST   /api/complaints
GET    /api/complaints/my
PUT    /api/complaints/:id/status
PUT    /api/complaints/:id/assign
PUT    /api/complaints/:id/escalate
```

### Logs
```http
GET /api/complaints/:id/logs
```

---

## 🔥 Key Learnings

- JWT authentication & role-based authorization
- REST API design with Express.js
- Priority-based workflow enforcement at the business logic layer
- Audit logging for full lifecycle tracking
- Frontend route protection in React
- Full-stack deployment (Vercel + Render + MongoDB Atlas)

---

## 📈 Roadmap

- [ ] Email notifications
- [ ] Redis caching
- [ ] Real-time updates via Socket.io
- [ ] Analytics dashboard
- [ ] SLA-based auto-escalation
- [ ] File attachments on complaints

---

## 👨‍💻 Author

**Varad**

---

## ⭐ Resume Highlights

> - Designed a workflow-driven complaint management system with role-based access control (User / Agent / Admin)
> - Implemented priority enforcement logic — HIGH priority complaints block resolution of lower-priority tickets
> - Built structured audit logging system tracking every lifecycle action with full metadata
> - Developed secure REST APIs with JWT authentication and middleware-level RBAC
> - Deployed full-stack MERN application on Render (backend) and Vercel (frontend)
