# Quick Reference Card

## 🚀 Common Commands

### Setup
```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Or use automated setup
./setup.sh          # Mac/Linux
setup.bat           # Windows
```

### Development
```bash
# Start MongoDB
mongod

# Start Backend (Terminal 1)
cd backend
npm start           # Production mode
npm run dev         # Development with nodemon

# Start Frontend (Terminal 2)
cd frontend
npm start           # Opens at http://localhost:3000

# Seed Database (Optional)
cd backend
npm run seed        # Creates test users and posts
```

### Build
```bash
# Build frontend for production
cd frontend
npm run build
```

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | john@example.com | user123 |
| User | jane@example.com | user123 |

Run `npm run seed` in backend to create these accounts.

## 📡 API Endpoints Quick Reference

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)

### Posts
- `GET /api/posts` - Get all posts (Public)
- `GET /api/posts/:id` - Get post by ID (Public)
- `POST /api/posts` - Create post (Protected)
- `PUT /api/posts/:id` - Update post (Protected, Owner)
- `DELETE /api/posts/:id` - Delete post (Protected, Owner/Admin)
- `GET /api/posts/user/:userId` - Get user's posts (Protected)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Protected)
- `GET /api/users/stats/overview` - Get stats (Admin)

## 🗺️ Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page with all posts |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/dashboard` | User | User dashboard |
| `/admin` | Admin | Admin dashboard |

## 🔑 Key Files

### Backend
```
backend/
├── server.js              # Entry point
├── models/User.js         # User schema
├── models/Post.js         # Post schema
├── middleware/auth.js     # Auth middleware
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   └── userController.js
└── routes/
    ├── authRoutes.js
    ├── postRoutes.js
    └── userRoutes.js
```

### Frontend
```
frontend/src/
├── App.js                 # Main component
├── context/AuthContext.js # Auth state
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   └── AdminDashboard.js
└── components/
    ├── Navbar.js
    ├── PostCard.js
    ├── CreatePostForm.js
    ├── ProtectedRoute.js
    └── AdminRoute.js
```

## 🛠️ Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env - optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 💡 Common Tasks

### Create Admin User
```javascript
// In MongoDB shell
use blog-platform
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### Clear Database
```javascript
// In MongoDB shell
use blog-platform
db.users.deleteMany({})
db.posts.deleteMany({})
```

### Check Running Servers
```bash
# Check if port 5000 is in use (Backend)
netstat -ano | findstr :5000        # Windows
lsof -i :5000                       # Mac/Linux

# Check if port 3000 is in use (Frontend)
netstat -ano | findstr :3000        # Windows
lsof -i :3000                       # Mac/Linux
```

## 🐛 Quick Fixes

### MongoDB not starting
```bash
# Check if already running
ps aux | grep mongod        # Mac/Linux
tasklist | findstr mongod   # Windows

# Start MongoDB
sudo service mongod start   # Linux
brew services start mongodb-community  # Mac
net start MongoDB           # Windows
```

### Port already in use
```bash
# Change backend port
# Edit backend/.env: PORT=5001

# Change frontend port
PORT=3001 npm start
```

### Clear localStorage (Browser)
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Reset npm modules
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- `README.md` - Main documentation
- `SETUP.md` - Setup instructions
- `API_DOCUMENTATION.md` - API details
- `ARCHITECTURE.md` - System diagrams
- `LEARNING.md` - Learning concepts
- `TESTING.md` - Testing guide
- `PROJECT_SUMMARY.md` - Complete overview

## 🎯 Testing Checklist

1. ✅ Register new user
2. ✅ Login with user
3. ✅ Create a post
4. ✅ Delete own post
5. ✅ Login as admin
6. ✅ View admin dashboard
7. ✅ Delete any post
8. ✅ Check responsive design
9. ✅ Verify protected routes
10. ✅ Test error handling

## 🔗 Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MongoDB Compass**: mongodb://localhost:27017

## 💻 Tech Stack

**Frontend**: React, React Router, Axios, CSS3  
**Backend**: Node.js, Express, MongoDB, Mongoose  
**Auth**: JWT, bcrypt  
**Validation**: express-validator

## ⚡ Pro Tips

1. Use `npm run dev` in backend for auto-reload
2. Run `npm run seed` for test data
3. Use browser dev tools for debugging
4. Check console for error messages
5. Use Postman to test API directly
6. Keep MongoDB running in background
7. Clear cache if UI doesn't update

---

**Keep this card handy while developing!** 📌
