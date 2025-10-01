# 🧑‍💻 Collaborative Code Review Platform API

A backend API platform that enables developers to register, submit code for review, comment inline, and collaborate in teams. Built using **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

---

## 📦 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **PostgreSQL** (via `pg`)
- **JWT Authentication**
- **WebSockets (`ws`)** for real-time updates
- **REST API**
- **Postman** (for testing)

---

## 🏗️ Project Structure (Sprints 1 - 8)

| Sprint | Features |
|-------:|----------|
| **1** | Project setup, TypeScript, DB connection, schema creation |
| **2** | Authentication (Register/Login), JWT, user profile |
| **3** | Projects: create, list, assign/remove users |
| **4** | Code Submissions: create, list, update status, delete |
| **5** | Comments: add, list, update, delete |
| **6** | Review workflow: approve, request changes, view history |
| **7** | Notifications + Stats API, WebSocket broadcast |
| **8** | Error handling, validation middleware |

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/KGOPOTSOMANGENA/collab-code-review.git
cd collab-code-review

2. ***Install dependencies***
npm install

3. *** Configure environment***

Create a .env file:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=04032661
DB_NAME=code_review_db
JWT_SECRET=07130@Kgo

🧪 API Endpoints Summary
🔐 Auth Routes (/api/auth)
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	Login and get JWT
👤 User Routes (/api/users)
Method	Endpoint	Description
GET	/users/:id	Get user profile (protected)
PUT	/users/:id	Update profile (optional)

🗂️ Projects (/api/projects)
Method	Endpoint	Description
POST	/projects	Create new project
GET	/projects	List all projects
POST	/projects/:id/members	Assign user to project
DELETE	/projects/:id/members/:userId	Remove user from project

📄 Submissions (/api/submissions)
Method	Endpoint	Description
POST	/submissions	Create a code submission
GET	/projects/:id/submissions	Get all submissions for a project
GET	/submissions/:id	View single submission
PUT	/submissions/:id/status	Update submission status
DELETE	/submissions/:id	Delete submission

💬 Comments (/api/submissions/:id/comments)
Method	Endpoint	Description
POST	/submissions/:id/comments	Add a comment
GET	/submissions/:id/comments	List all comments on submission
PUT	/comments/:id	Update a comment
DELETE	/comments/:id	Delete a comment

✅ Review Workflow (/api/submissions/:id)
Method	Endpoint	Description
POST	/approve	Approve submission
POST	/request-changes	Request changes
GET	/reviews	View review history
🔔 Notifications & Stats
Method	Endpoint	Description
GET	/users/:id/notifications	User activity feed
GET	/projects/:id/stats	Project analytics
📡 WebSocket Integration

***WebSocket server is initialized in index.ts***

Real-time events: new_comment, new_review (sent to all connected clients)

To test: Use a WebSocket client like Postman WebSocket

✅ Middleware
Type	File	Purpose
Auth	middleware/authMiddleware.ts	JWT verification
Validation	middleware/validateRequest.ts	Register/Login input check
Error Handler	middleware/errorHandler.ts	Catches all API errors
Not Found	middleware/notFound.ts	404 fallback handler


***request bodies you can use to test key API endpoints in Postman:***

### 1. Register User - `POST /api/auth/register`
```json
{
  "name": "Alice Developer",
  "email": "alice@example.com",
  "password": "Password123"
}
###2. Login User - POST /api/auth/login
json
Copy code
{
  "email": "alice@example.com",
  "password": "Password123"
}
Response: { "token": "<JWT_TOKEN>" }

###3. Create Project - POST /api/projects
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "name": "Project Apollo",
  "description": "Code review platform backend"
}
###4. Assign User to Project - POST /api/projects/:id/members
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "userId": 2
}
###5. Create Submission - POST /api/submissions
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "projectId": 1,
  "title": "Refactor authentication middleware",
  "code": "export const verifyToken = (req, res, next) => { ... }",
  "status": "pending"
}
###6. Add Comment - POST /api/submissions/:id/comments
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "comment": "Great refactor! Consider adding unit tests."
}
###7. Approve Submission - POST /api/submissions/:id/approve
Headers: Authorization: Bearer <JWT_TOKEN>

No body required

###8. Request Changes - POST /api/submissions/:id/request-changes
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "reason": "Please improve error handling in the middleware."
}
###9. Update Submission Status - PUT /api/submissions/:id/status
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "status": "approved"  // or "in_review", "changes_requested"
}
###10. Update Comment - PUT /api/comments/:id
Headers: Authorization: Bearer <JWT_TOKEN>

json
Copy code
{
  "comment": "Updated comment text"
}
###11. User Notifications - GET /api/users/:id/notifications
Headers: Authorization: Bearer <JWT_TOKEN>



###12. Project Stats - GET /api/projects/:id/stats
Headers: Authorization: Bearer <JWT_TOKEN>



📡 WebSocket Testing
Use a WebSocket client and connect to:

arduino
Copy code
ws://localhost:5000
The server sends messages like:

json
Copy code
{
  "type": "new_comment",
  "data": {
    "commentId": 5,
    "submissionId": 12,
    "comment": "Looks good!",
    "author": "Bob"
  }
}