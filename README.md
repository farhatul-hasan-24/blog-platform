# Blog Platform with Role-Based Access Control

A modern, full-stack blog platform featuring role-based authentication, user dashboards, and admin moderation tools. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### User Roles

#### **User**
- ✅ Sign up and log in
- ✅ Create blog posts
- ✅ View all blog posts
- ✅ Delete only their own posts
- ✅ Personal dashboard

#### **Admin**
- ✅ Log in with admin privileges
- ✅ View all blog posts from all users
- ✅ Delete any blog post (moderation control)
- ✅ Access admin dashboard with statistics
- ✅ Platform-wide moderation

### Core Features

- 🔐 Secure JWT-based authentication
- 👥 Role-based access control (RBAC)
- 📝 Full CRUD operations for blog posts
- 🎨 Responsive, modern UI
- 🛡️ Protected routes and authorization middleware
- 📊 Admin statistics dashboard
- ⚡ RESTful API architecture

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client
- **CSS3** - Modern styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation

## 📁 Project Structure

```
Blog-Platform/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── postController.js     # Post CRUD logic
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   ├── auth.js               # JWT & role verification
│   │   └── validation.js         # Input validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Post.js               # Post schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── postRoutes.js         # Post endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── utils/
│   │   └── tokenUtils.js         # JWT utilities
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   ├── PostCard.js       # Blog post display
│   │   │   ├── CreatePostForm.js # Post creation form
│   │   │   ├── ProtectedRoute.js # Auth guard
│   │   │   └── AdminRoute.js     # Admin guard
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.js           # Public landing page
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   ├── Dashboard.js      # User dashboard
│   │   │   └── AdminDashboard.js # Admin dashboard
│   │   ├── utils/
│   │   │   ├── api.js            # Axios instance
│   │   │   └── apiService.js     # API calls
│   │   ├── App.js                # Main component
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Global styles
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Blog-Platform
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file from example
   cp .env.example .env
   ```

   Edit `.env` with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog-platform
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure frontend environment (optional)**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` if needed:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   Server will run on `http://localhost:5000`

3. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

   App will open at `http://localhost:3000`

## 👤 Creating Admin User

To create an admin user, you need to manually update a user's role in the database:

### Method 1: Using MongoDB Compass or Shell

```javascript
// Connect to your MongoDB
use blog-platform

// Update a user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Register normally, then update via MongoDB

1. Register a new account through the UI
2. Connect to MongoDB and run the command above with your email

### Demo Accounts

For testing purposes, you can create these accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123
- Role: admin (set manually in DB)

**Regular User:**
- Email: user@example.com
- Password: user123
- Role: user (default)

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Posts

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/posts` | Public | Get all posts |
| GET | `/api/posts/:id` | Public | Get single post |
| POST | `/api/posts` | Private | Create new post |
| PUT | `/api/posts/:id` | Private (Owner) | Update post |
| DELETE | `/api/posts/:id` | Private (Owner/Admin) | Delete post |
| GET | `/api/posts/user/:userId` | Private | Get user's posts |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/:id` | Private | Get user by ID |
| GET | `/api/users/stats/overview` | Admin | Get platform stats |

## 🎯 Key Learning Concepts

### 1. **React Router & Protected Routes**
- Public routes (Home, Login, Register)
- Protected routes (Dashboard)
- Role-based routes (Admin Dashboard)
- Redirect logic for unauthorized access

### 2. **Role-Based Access Control (RBAC)**
- User roles (user, admin)
- Authorization middleware
- Resource ownership validation
- Admin privileges

### 3. **Authentication Flow**
- JWT token generation
- Token storage in localStorage
- Token validation on requests
- Context API for auth state

### 4. **RESTful API Design**
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format
- Error handling

### 5. **Backend Authorization**
- Middleware pattern
- Role checking
- Resource ownership verification
- Input validation

## 🎨 UI Features

- **Responsive Design** - Works on all screen sizes
- **Modern Gradients** - Eye-catching hero sections
- **Card-Based Layout** - Clean post display
- **Loading States** - User feedback during operations
- **Error Handling** - Clear error messages
- **Success Feedback** - Confirmation messages

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected API endpoints
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ Role-based authorization

## 📝 Usage Guide

### For Users

1. **Sign Up**: Create an account with username, email, and password
2. **Login**: Access your account
3. **Create Posts**: Write blog posts from your dashboard
4. **View Posts**: Browse all posts on the home page
5. **Delete Your Posts**: Remove your own posts from your dashboard

### For Admins

1. **Login**: Use admin credentials
2. **View Statistics**: See platform overview on admin dashboard
3. **Moderate Content**: Delete any inappropriate posts
4. **Monitor Activity**: Track total users and posts

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Issues
- Backend is configured to allow all origins in development
- Frontend proxy is set up in `package.json`

### Token Errors
- Clear localStorage and login again
- Check JWT_SECRET in backend `.env`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Run on different port: `PORT=3001 npm start`

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables
2. Ensure MongoDB connection string is updated
3. Deploy following platform-specific instructions

### Frontend Deployment (Vercel/Netlify)

1. Build the app: `npm run build`
2. Update API URL in environment variables
3. Deploy build folder

## 🤝 Contributing

This is a learning project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork and modify

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🎓 Educational Value

This project demonstrates:
- Full-stack JavaScript development
- Modern React patterns (Hooks, Context API)
- RESTful API design
- MongoDB/Mongoose ODM
- Authentication & Authorization
- Role-based access control
- Protected routing
- Responsive web design

Perfect for beginners learning full-stack development with real-world authentication concepts!

## 📧 Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ for learning full-stack development**
