# Frontend - Restaurant Management System

React application for restaurant management with table, menu, and order control.

## 🛠️ Technologies

- React 18
- Vite
- React Router DOM
- Axios
- Context API for state management

## 📂 Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Main pages
│   ├── context/        # Global state (AuthContext)
│   ├── services/       # API calls
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🔧 Installation
```bash
npm install
```

## 🚀 Run
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📱 Pages

- **Login** - User authentication
- **Dashboard** - Main page with overview
- **Menu** - Dish management (admin can CRUD, operator read-only)
- **Tables** - Table management with status
- **Orders** - Order system with items and totals
- **Users** - User management (admin only)

## 👤 Default Users

**Admin:**
- Username: `admin`
- Password: `12Enma*`

## 🔐 Roles

| Action | Admin | Operator |
|--------|-------|----------|
| Manage menu | ✅ | ❌ |
| Create users | ✅ | ❌ |
| Manage orders | ✅ | ✅ |
| Manage tables | ✅ | ✅ |