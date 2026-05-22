# 🚀 FROLIC Management System

![FROLIC Logo](frontend/public/logo.png)

A premium, full-stack **SaaS Web Application** designed to effortlessly manage university-level sports, technical, and cultural festivals. Built with a modern tech stack and a stunning glassmorphism UI, FROLIC provides seamless coordination between administrators, event managers, and students.

## ✨ Key Features

### 🔐 Advanced Role-Based Access Control (RBAC)
The platform dynamically routes users to personalized dashboards based on their clearance level:
- **God-Mode Admin:** Complete oversight of the entire university, global statistics, and access to all institutes, departments, and events.
- **Institute Coordinator:** Manages departments and overarching events within a specific university institute.
- **Event Coordinator:** Dedicated tools for managing specific competitions, taking attendance, and verifying payments.
- **Student / Participant:** A sleek portal to browse events, register teams, and manage group members.

### 📊 Interactive Analytics Dashboards
- Beautifully animated, real-time data visualization using **Recharts**.
- Instant metrics on total registrations, active events, and participant demographics.

### 👥 Real-Time Group & Team Management
- Students can seamlessly create teams, assign leadership roles, and invite members.
- Built-in **Business Logic:** The moment an Event Coordinator marks a team as "Present" for an event, the platform automatically **locks** the group from further edits, preventing mid-competition cheating.

### 🎨 Premium UI / UX
- **Glassmorphism Design System:** Translucent cards, subtle neon glows, and a cohesive midnight-purple theme.
- **Framer Motion Animations:** Smooth page transitions, staggered list loading, and interactive hover states.
- Fully responsive layout that looks incredible on both desktop and mobile.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Utility-first styling & Glassmorphism)
- Framer Motion (Micro-animations & Transitions)
- Recharts (Data Visualization)
- React Router (Routing & Protected Routes)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (NoSQL Database)
- JSON Web Tokens (JWT) for secure authentication
- bcrypt.js for password hashing

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/gajerayash-exploit/Frolic-Management.git
cd Frolic-Management
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. You're Live!
Open your browser and navigate to `http://localhost:5173` to see the application in action.

---

## 📸 Screenshots
*(Add your LinkedIn demo screenshots or GIFs here)*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
