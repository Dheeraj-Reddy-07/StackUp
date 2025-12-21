# StackUp - Student Collaboration Platform

A production-grade, full-stack web application for engineering students to form teams for hackathons, projects, startups, and study groups.

![StackUp](https://img.shields.io/badge/StackUp-Collaboration-6366f1)

## 🚀 Features

- **User Authentication** - JWT-based secure login/signup
- **Project Openings** - Create and browse team openings
- **Applications** - Apply to join teams with resume upload
- **Team Management** - Accept/reject applications, manage teams
- **Real-time Chat** - Socket.IO powered team chat
- **Notifications** - In-app notification system
- **File Uploads** - Cloudinary integration for resumes

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- Socket.IO Client
- Axios
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Cloudinary
- Multer

## 📁 Project Structure

```
StackUp/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context (Auth, Socket)
│   │   ├── services/          # API service functions
│   │   └── index.css          # Tailwind CSS
│   └── vite.config.js
│
└── server/                    # Node.js Backend
    ├── config/                # DB & Cloudinary config
    ├── controllers/           # Route controllers
    ├── middleware/            # Auth middleware
    ├── models/                # Mongoose schemas
    ├── routes/                # API routes
    └── server.js              # Entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
cd StackUp
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. **Start the application**

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

5. **Open in browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/openings` | List openings |
| POST | `/api/openings` | Create opening |
| GET | `/api/openings/:id` | Get opening details |
| POST | `/api/applications` | Submit application |
| PUT | `/api/applications/:id/accept` | Accept application |
| PUT | `/api/applications/:id/reject` | Reject application |
| GET | `/api/teams/my` | Get user's teams |
| GET | `/api/messages/:teamId` | Get team messages |
| POST | `/api/upload` | Upload file |

## 🎨 UI Features

- Modern SaaS-style design
- Responsive layout (mobile + desktop)
- Smooth animations and transitions
- Real-time chat with typing indicators
- Clean component architecture

## 📱 Pages

1. **Landing Page** - Hero section, features, CTAs
2. **Login/Signup** - Auth forms with validation
3. **Dashboard** - Tabs for openings, applications, teams, notifications
4. **Browse** - Search and filter openings
5. **Create Opening** - Post new team opening
6. **Opening Details** - Full details, apply, manage applications
7. **Team Page** - Team members and info
8. **Chat** - Real-time team messaging

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based access control
- Input validation

## 📄 License

MIT License

---

Built with ❤️ for students, by students.
