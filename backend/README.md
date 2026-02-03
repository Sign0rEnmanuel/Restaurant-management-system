# Restaurant Management API - Backend

A comprehensive REST API for managing restaurant operations including authentication, menu management, table management, and order processing.

## 🛠️ Technologies

- **Node.js** + **Express** - Server framework
- **JWT (JSON Web Tokens)** - Secure authentication
- **Bcryptjs** - Password hashing
- **ES Modules** - Modern JavaScript modules
- **File-based Database** - JSON data persistence

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Business logic for each resource
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── tableController.js
│   ├── database/             # JSON database files
│   │   ├── menu.json
│   │   ├── orders.json
│   │   ├── tables.json
│   │   └── users.json
│   ├── middleware/           # Express middleware
│   │   └── authMiddleware.js
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── tableRoutes.js
│   ├── utils/                # Utility functions
│   │   ├── createAdmin.js
│   │   └── fileHandler.js
│   └── server.js             # Main server file
├── .env                       # Environment variables
└── package.json
```

## � Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file in the root directory:**
```env
PORT=5000
JWT_SECRET=your_secret_key_here
```

3. **Create default admin user:**
```bash
node src/utils/createAdmin.js
```

4. **Start the development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | Create new user | Admin only |

### Menu Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/menu` | Get all menu items | Public |
| POST | `/api/menu` | Add new menu item | Admin only |
| PUT | `/api/menu/:id` | Update menu item | Admin only |
| DELETE | `/api/menu/:id` | Delete menu item | Admin only |

### Table Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tables` | Get all tables | Authenticated |
| POST | `/api/tables` | Create new table | Admin only |
| PUT | `/api/tables/:id/status` | Update table status | Authenticated |

### Order Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get all orders | Authenticated |
| POST | `/api/orders` | Create new order | Authenticated |
| POST | `/api/orders/:orderId/items` | Add item to order | Authenticated |
| DELETE | `/api/orders/:orderId/items/:menuItemId` | Remove item from order | Authenticated |
| PUT | `/api/orders/:orderId/close` | Close order | Authenticated |

## 👤 Default Admin Account

```
Username: admin
Password: 12Enma*
```

⚠️ **Important:** Change the default password after first login for security reasons.

## 🔐 Role-Based Access Control

| Feature | Admin | Operator |
|---------|-------|----------|
| Manage Menu (Create, Update, Delete) | ✅ | ❌ |
| Manage Users | ✅ | ❌ |
| Manage Orders | ✅ | ✅ |
| Manage Tables | ✅ | ✅ |
| View Menu | ✅ | ✅ |

## 🔑 Authentication

This API uses JWT (JSON Web Token) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for signing tokens | `your_secret_key` |

## 🐛 Troubleshooting

- **Cannot create admin user:** Ensure the `database/` folder exists
- **JWT errors:** Verify `JWT_SECRET` is set in `.env`
- **Port already in use:** Change `PORT` in `.env` or kill the process using the port

## 📄 License

This project is part of the Restaurant Management System.