# 🍽️ Restaurant Management System

Full-stack system for restaurant management with table control, orders, and menu.

![Restaurant System](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)

## 📋 Description

Complete management system for restaurants that allows:
- User authentication with roles (Admin/Operator)
- Menu management with categories and availability
- Table management with status control
- Order system with automatic total calculation
- User administration

## 🚀 Technologies

### Backend
- Node.js + Express
- JWT Authentication
- Bcryptjs for password encryption
- ES Modules
- JSON file storage

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Context API

## 📂 Project Structure
```
restaurant-system/
├── backend/          # REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── README.md
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── README.md
└── README.md
```

## 🔧 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Backend
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
```

Create admin user:
```bash
node src/utils/createAdmin.js
```

Start server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 Default Users

**Admin:**
- Username: `admin`
- Password: `12Enma*` (change in createAdmin.js)

## 📡 Main Features

### Authentication
- JWT-based login
- Role-based access control
- Secure password storage

### Menu Management
- CRUD operations for dishes
- Categories and descriptions
- Price control
- Availability status

### Table Management
- Create and manage tables
- Status: Available/Occupied
- Capacity control
- Delete only available tables

### Order System
- Create orders per table
- Add/remove items
- Automatic total calculation
- Close orders and free tables

### User Management
- Create operators and admins
- Role-based permissions
- User listing

## 🔐 Permissions

| Action | Admin | Operator |
|--------|-------|----------|
| Manage menu | ✅ | ❌ |
| Create users | ✅ | ❌ |
| Create/delete tables | ✅ | ❌ |
| Manage orders | ✅ | ✅ |
| Change table status | ✅ | ✅ |

## 📸 Screenshots

_Add screenshots here after deployment_

## 🚀 Deployment

### Backend
- Recommended: Railway, Render, or Heroku
- Set environment variables
- Use PostgreSQL or MongoDB for production

### Frontend
- Recommended: Vercel or Netlify
- Update API_URL in production

## 👨‍💻 Author

Emmanuel Marzal

## 📄 License

MIT