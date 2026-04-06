# Frolic Management System - Project Walkthrough

This document provides a comprehensive guide to the Frolic Management System, explaining its architecture, database, API endpoints, and frontend implementation. It is designed to help you understand "how it works" in detail.

## 1. Project Overview

**Frolic Management System** is a web-based application designed to manage university events, institutes, departments, and participation. It facilitates interaction between different roles:
- **Admin**: Manages the entire system (Institutes, Departments, Events, Users).
- **Institute/Department/Event Coordinators**: Manage their specific areas.
- **Students**: View events, register groups, and participate.

The project is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## 2. Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose for ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs (Password hashing), CORS (Cross-Origin Resource Sharing)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios

---

## 3. Top-Level Project Structure

```
FROLIC MANAGEMENT/
├── backend/                # Server-side code
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic for API endpoints
│   ├── middleware/         # Custom middleware (Auth, Error handling)
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API route definitions
│   ├── seeds/              # Scripts to seed the database with initial data
│   ├── server.js           # Entry point for the backend server
│   └── package.json        # Backend dependencies
│
└── frontend/               # Client-side code
    ├── public/             # Static assets
    ├── src/                # Source code
    │   ├── context/        # React Context (Auth)
    │   ├── pages/          # Page components (Admin, Student, Coordinator)
    │   ├── App.jsx         # Main application component & Routing
    │   ├── main.jsx        # Entry point to render React app
    │   └── index.css       # Global styles (Tailwind imports)
    └── package.json        # Frontend dependencies
```

---

## 4. Backend Deep Dive

### 4.1 Entry Point (`backend/server.js`)
- **Initialization**: Connects to MongoDB using `connectDB()`.
- **Middleware**:
    - `cors`: Allows requests from the frontend (`http://localhost:5173`).
    - `express.json()`: Parses incoming JSON request bodies.
- **Routes**: Mounts API routes under `/api/*`.
    - `/api/auth`
    - `/api/users`
    - `/api/institutes`
    - `/api/departments`
    - `/api/events`
    - `/api/groups`
    - `/api/participants`
- **Error Handling**: Global error handling middleware.

### 4.2 Database Models (`backend/models/`)
The database schema defines how data is structured in MongoDB.

1.  **User (`User.js`)**
    -   Stores user credentials and roles.
    -   **Key Fields**: `UserName`, `EmailAddress`, `UserPassword` (Hashed), `Role` (admin, student, coordinator types), `IsAdmin`.
    -   **Logic**: Has a pre-save hook to hash passwords using `bcrypt` and a method `matchPassword` to compare passwords during login.

2.  **Institute (`Institute.js`)**
    -   Represents a university institute.
    -   **Key Fields**: `InstituteName`, `InstituteCoordinatorID` (Ref to User).
    -   **Virtuals**: `departments` (Count of departments).

3.  **Department (`Department.js`)**
    -   Represents a department within an institute.
    -   **Key Fields**: `DepartmentName`, `InstituteID` (Ref to Institute), `DepartmentCoordinatorID` (Ref to User).
    -   **Virtuals**: `events` (Count of events).

4.  **Event (`Event.js`)**
    -   Represents an event organized by a department.
    -   **Key Fields**: `EventName`, `Description`, `DepartmentID`, `EventCoordinatorID`, `EventDate`, `Fees`, `GroupMinParticipants`, `GroupMaxParticipants`.
    -   **Logic**: Validates that max participants >= min participants.

5.  **Group (`Group.js`)**
    -   Represents a team registered for an event.
    -   **Key Fields**: `GroupName`, `EventID`, `CreatedBy` (Student), `IsPaymentDone`, `IsPresent`.
    -   **Compound Index**: Ensures `GroupName` is unique per `EventID`.

6.  **Participant (`Participant.js`)**
    -   Represents an individual student in a group.
    -   **Key Fields**: `Name`, `EnrollmentNum`, `GroupID`.

7.  **Winner (`Winner.js`)**
    -   Records the winners of an event.
    -   **Key Fields**: `EventID`, `GroupID`, `Sequence` (1st, 2nd, 3rd), `Prize`.

### 4.3 API Routes (`backend/routes/`)
Routes map HTTP endpoints to controller functions.

-   **`authRoutes.js`**:
    -   `POST /register`: Register a new user (Student role by default).
    -   `POST /login`: Authenticate user and return JWT token.
    -   `GET /me`: Get current user profile (Protected).

-   **`userRoutes.js`** (Admin Only):
    -   `GET /`, `POST /`: Manage users.
    -   `GET /:id`, `PUT /:id`, `DELETE /:id`: Manage specific user.

-   **`instituteRoutes.js`** & **`departmentRoutes.js`**:
    -   CRUD operations for institutes and departments.
    -   Support nested routes like `GET /institutes/:id/departments` to fetch departments of a specific institute.

-   **`eventRoutes.js`**:
    -   Public: View all events or a specific event.
    -   Protected: Create/Update/Delete events (Authorized for specific coordinator roles).

### 4.4 Authentication Logic
-   **JWT**: When a user logs in, the server signs a JSON Web Token containing the user's ID and Role.
-   **Middleware (`backend/middleware/auth.js`)**:
    -   **`protect`**: Verifies the JWT token in the `Authorization` header. If valid, attaches the user to `req.user`.
    -   **`authorize(...)`**: Checks if `req.user.Role` matches the allowed roles for a route.

---

## 5. Frontend Deep Dive

### 5.1 Structure (`frontend/src/`)
The frontend is a Single Page Application (SPA).

-   **`main.jsx`**: The entry point. Wraps the App in `AuthProvider` and `BrowserRouter`.
-   **`App.jsx`**: Defines the application routes.
    -   Uses a `ProtectedRoute` component to restrict access based on authentication status and user roles.
    -   **Routes**:
        -   `/` -> Landing Page (or redirect to Dashboard if logged in).
        -   `/admin/*` -> Admin Dashboard.
        -   `/student/*` -> Student Dashboard.
        -   `/coordinator/*` -> Coordinator Dashboard.

### 5.2 State Management (`context/AuthContext.jsx`)
-   **Purpose**: Manages global authentication state.
-   **Functionality**:
    -   On load, checks `localStorage` for a saved token and user data to persist login.
    -   **`login(email, password)`**: Calls backend API, saves token/user to state and `localStorage`.
    -   **`logout()`**: Clears state and `localStorage`.
    -   **Axios Interceptor**: Automatically adds the `Authorization: Bearer <token>` header to all outgoing requests if a token exists.

### 5.3 Pages & Logic

#### **Landing Page (`pages/Landing.jsx`)**
-   The public face of the website.
-   Contains the "Login" and "Sign Up" forms.
-   Handles user authentication interactions.

#### **Admin Pages (`pages/admin/`)**
-   **`Dashboard.jsx`**: Overview of system stats.
-   **`Institutes.jsx`**: List and manage institutes.
-   **`Departments.jsx`**: List and manage departments.
-   **`Events.jsx`**: List and manage events.
-   **`Users.jsx`**: User management interface.

#### **Coordinator Pages (`pages/coordinator/`)**
-   **`Dashboard.jsx`**: Coordinator-specific stats.
-   **`DepartmentView.jsx`**: View department details.
-   **`EventView.jsx`**: Manage specific event details.
-   **`Groups.jsx`**: View registered groups, mark attendance, verify payments.
-   **`InstituteView.jsx`**: View institute details.

#### **Student Pages (`pages/student/`)**
-   **`Dashboard.jsx`**: Student's personal dashboard to view joined events and profile.

---

## 6. How it All Connects (Example Flow: Registering a Group)
1.  **Frontend**: A student logs in. `AuthContext` stores their token.
2.  **Frontend**: Student navigates to an Event page and clicks "Register Group".
3.  **Frontend**: React sends a `POST /api/groups` request with the group details and members.
4.  **Network**: The request includes the `Authorization` header with the JWT token.
5.  **Backend**: `protect` middleware verifies the token and adds the user to `req.user`.
6.  **Backend**: `groupController` creates a new `Group` document in MongoDB, linked to the `Event` and the `User` (CreatedBy).
7.  **Backend**: `Participant` documents are created for each member, linked to the `Group`.
8.  **Database**: Data is persisted in MongoDB.
9.  **Response**: Server sends back the created group data.
10. **Frontend**: React updates the UI to show the registration success.

---

## 7. Current Feature Implementation Status

### ✅ Fully Implemented (Backend & Frontend)
-   **Authentication**:
    -   Student Sign Up / Login.
    -   Role-based Login (Admin, Coordinators).
    -   Logout and Session Persistence.
-   **Admin Management**:
    -   **Institutes**: Create, Update, Delete Institutes.
    -   **Departments**: Create, Add to Institute, Update, Delete.
    -   **Events**: Create new events, Assign Coordinators, Update, Delete.
    -   **Users**: View and Manage users.
-   **Coordinator Management**:
    -   **Events**: View assigned events, Create/Update events (based on permission).

### ⏳ Partially Implemented (Backend Only / Frontend Placeholder)
-   **Student Features**:
    -   *Backend*: API exists for browsing events and registering groups (`POST /api/groups`).
    -   *Frontend*: Dashboard is currently a static shell. "Browse Events" and "My Groups" pages are placeholders.
-   **Group Management**:
    -   *Backend*: APIs for marking attendance (`IsPresent`) and verifying payments (`IsPaymentDone`).
    -   *Frontend*: Coordinator "Attendance" and "Payments" pages are placeholders.
-   **Winners**:
    -   *Backend*: APIs to declare winners.
    -   *Frontend*: "Winners" declaration page is a placeholder.

---

## 8. Complete API Reference

Here is a list of every API endpoint available in the project.

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (Student). |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token. |
| `GET` | `/api/auth/me` | Protected | Get profile of currently logged-in user. |
| `POST` | `/api/auth/logout` | protected | Logout (Client-side token removal). |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin Only | Get list of all users. Supports filtering. |
| `POST` | `/api/users` | Admin Only | Create a new user manually. |
| `GET` | `/api/users/:id` | Admin Only | Get details of a specific user. |
| `PUT` | `/api/users/:id` | Admin Only | Update user details. |
| `DELETE` | `/api/users/:id` | Admin Only | Delete a user. |

### Institutes (`/api/institutes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/institutes` | Public | Get all institutes. |
| `GET` | `/api/institutes/:id` | Public | Get details of a specific institute. |
| `POST` | `/api/institutes` | Admin Only | Create a new institute. |
| `PUT` | `/api/institutes/:id` | Admin Only | Update an institute. |
| `DELETE` | `/api/institutes/:id` | Admin Only | Delete an institute (Soft delete). |
| `GET` | `/api/institutes/:id/departments` | Public | Get all departments of a specific institute. |

### Departments (`/api/departments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/departments` | Public | Get all departments. |
| `GET` | `/api/departments/:id` | Public | Get details of a specific department. |
| `POST` | `/api/departments` | Admin Only | Create a new department. |
| `PUT` | `/api/departments/:id` | Admin Only | Update a department. |
| `DELETE` | `/api/departments/:id` | Admin Only | Delete a department. |
| `GET` | `/api/departments/:id/events` | Public | Get all events of a specific department. |

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | Get all events. Supports filtering. |
| `GET` | `/api/events/:id` | Public | Get details of a specific event. |
| `POST` | `/api/events` | Coordinators* | Create a new event. (*Admin, Inst/Dept Coordinator) |
| `PUT` | `/api/events/:id` | Coordinators* | Update an event. (*Admin, Inst/Dept/Event Coordinator) |
| `DELETE` | `/api/events/:id` | Coordinators* | Delete an event. (*Admin, Inst/Dept Coordinator) |

### Groups (`/api/groups`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/groups` | Protected | Register a new group for an event. |
| `GET` | `/api/groups` | Coordinators* | Get list of groups. (*Admin, All Coordinators) |
| `GET` | `/api/groups/:id` | Protected | Get details of a specific group. |
| `PUT` | `/api/groups/:id` | Coordinators* | Update group (e.g. Verify Payment, Mark Attendance). |

### Participants (`/api/participants`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/participants` | Protected | Add a participant to a group. |
| `PUT` | `/api/participants/:id` | Protected | Update participant details. |
| `DELETE` | `/api/participants/:id` | Protected | Remove a participant from a group. |

---

---

## 9. Default Credentials

Use the following credentials to log in and test different roles in the application.

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Admin User | `admin@frolic.com` | `admin123` |
| **Coordinator** | Coordinator User | `coordinator@frolic.com` | `coord123` |
| **Student** | Student User | `student@frolic.com` | `student123` |


---

## 10. Key Evaluation Points (Viva/Defense Preparation)

Use these points to defend your project during evaluation or detailed questioning.

### 🌟 Unique Selling Points (USP)
- **Centralized Control**: specific dashboards for Institutes and Departments allow decentralized management while keeping the Super Admin in control.
- **Role-Based Access Control (RBAC)**: secure separation of duties. Students cannot see Admin panels; Coordinators can only edit their own events.
- **Smart Validation**: automatic checks for "Min/Max Participants" prevent invalid group registrations at the source.

### 🛡️ Security Measures
- **Password Hashing**: We use `bcryptjs` to hash passwords. Even if the database is compromised, user passwords remain secure.
- **JWT Authentication**: Stateless authentication using JSON Web Tokens. The server doesn't need to store session files, making it scalable.
- **Authorization Middleware**: Custom middleware (`adminOnly`, `protect`) ensures no unauthorized API access, even if someone tries to use Postman/Curl.

### 🏗️ Design Decisions
- **Why MERN Stack?**:
    -   **JavaScript Everywhere**: Same language for Frontend and Backend means better developer productivity.
    -   **JSON Native**: MongoDB stores data in BSON (Binary JSON), which maps directly to JavaScript objects, avoiding complex ORM mapping layers found in SQL.
- **Soft Deletes**:
    -   Instead of permanently deleting Institutes/Departments/Events, we use an `IsActive` flag.
    -   *Why?* To maintain historical data integrity (e.g., you don't want to lose past event records just because a department is inactive).
- **Separation of Concerns**:
    -   **Models**: Define data structure.
    -   **Controllers**: Handle logic.
    -   **Routes**: Handle API endpoints.
    -   **Frontend**: Handles UI.
    -   *Benefit*: Makes the code modular, easy to debug, and easy to test.

### 🚀 Future Enhancements (Scope for Improvement)
-   **Payment Gateway Integration**: currently payments are verified manually by coordinators. Integrating Stripe/Razorpay would automate this.
-   **Real-time Notifications**: using Socket.io to alert students when a winner is declared or an event is cancelled.
-   **Mobile Application**: using React Native to build a mobile version of the student dashboard.


