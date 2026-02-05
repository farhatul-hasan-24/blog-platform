# Getting Started - Step by Step Guide

Welcome to the Blog Platform! This guide will walk you through setting up and running the application for the first time.

## Prerequisites Check

Before you begin, make sure you have:

- [ ] **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- [ ] **npm** (comes with Node.js)
- [ ] **Git** (optional, for version control)
- [ ] A code editor (VS Code recommended)

### Verify Installation

Open a terminal and run:

```bash
node --version    # Should show v14 or higher
npm --version     # Should show 6 or higher
mongod --version  # Should show MongoDB version
```

## Step 1: Project Setup

### Option A: Automated Setup (Recommended)

**On Windows:**
1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```bash
   cd Blog-Platform
   ```
3. Run the setup script:
   ```bash
   setup.bat
   ```

**On Mac/Linux:**
1. Open Terminal
2. Navigate to the project folder:
   ```bash
   cd Blog-Platform
   ```
3. Make the script executable and run:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Option B: Manual Setup

**1. Install Backend Dependencies:**
```bash
cd backend
npm install
```

**2. Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

**3. Create Environment Files:**

Backend:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

Frontend (optional):
```bash
cd frontend
cp .env.example .env
```

## Step 2: Start MongoDB

### Windows
```bash
# If installed as a service
net start MongoDB

# Or manually
"C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe"
```

### Mac
```bash
# If installed via Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux
```bash
# Using systemd
sudo systemctl start mongod

# Or manually
sudo mongod
```

### Verify MongoDB is Running
```bash
# Should connect without errors
mongo
# Or for newer versions
mongosh
```

## Step 3: Seed the Database (Optional)

Create test users and sample posts:

```bash
cd backend
npm run seed
```

This will create:
- Admin user: admin@example.com / admin123
- Regular user: john@example.com / user123
- Regular user: jane@example.com / user123
- 6 sample blog posts

## Step 4: Start the Application

You'll need **two terminal windows** (or tabs).

### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

**Keep this terminal open!**

### Terminal 2 - Frontend Server

```bash
cd frontend
npm start
```

Your browser will automatically open to `http://localhost:3000`

You should see:
```
Compiled successfully!
You can now view blog-platform-frontend in the browser.
  Local:            http://localhost:3000
```

**Keep this terminal open too!**

## Step 5: Test the Application

### 5.1 View Home Page
- Open http://localhost:3000
- You should see the blog platform home page
- Sample posts will be displayed (if you ran the seed script)

### 5.2 Register a New Account
1. Click "Sign Up" button
2. Fill in the form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"
4. You should be redirected to your dashboard

### 5.3 Create Your First Post
1. On your dashboard, you'll see "Create New Post" form
2. Fill in:
   - Title: "My First Blog Post"
   - Content: "This is my first post on this platform!"
3. Click "Create Post"
4. Your post should appear below the form

### 5.4 View All Posts
1. Click "Home" in the navigation
2. You should see your post along with sample posts
3. You can only delete your own posts

### 5.5 Test Admin Features

**Option 1: Use Seeded Admin Account**
1. Logout (if logged in)
2. Click "Login"
3. Login with:
   - Email: admin@example.com
   - Password: admin123
4. You should see "Admin" link in navigation
5. Click "Admin" to see admin dashboard
6. You can delete any post

**Option 2: Make Your Account Admin**
1. Open MongoDB shell:
   ```bash
   mongosh blog-platform
   ```
2. Update your user role:
   ```javascript
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Logout and login again
4. You should now see the "Admin" link

## Step 6: Explore the Features

### As a Regular User:
- ✅ Create blog posts
- ✅ View all posts
- ✅ Delete only your own posts
- ✅ Access your dashboard
- ❌ Cannot delete others' posts
- ❌ Cannot access admin dashboard

### As an Admin:
- ✅ All user features
- ✅ Delete any post
- ✅ Access admin dashboard
- ✅ View platform statistics
- ✅ Moderate all content

## Common Issues and Solutions

### Issue: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod

# If not running, start it (see Step 2)
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Change the port in backend/.env
PORT=5001

# Restart the backend server
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Run frontend on different port
PORT=3001 npm start
```

### Issue: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "JWT token invalid"

**Solution:**
```bash
# Clear browser localStorage
# Open browser console (F12) and run:
localStorage.clear()
location.reload()

# Then login again
```

### Issue: "CORS errors"

**Solution:**
- Make sure both backend and frontend servers are running
- Backend should be on http://localhost:5000
- Frontend should be on http://localhost:3000
- Check CORS configuration in `backend/server.js`

## Next Steps

1. **Read the Documentation:**
   - `README.md` - Complete project overview
   - `ARCHITECTURE.md` - Understand how it works
   - `API_DOCUMENTATION.md` - API reference
   - `LEARNING.md` - Learn the concepts

2. **Experiment:**
   - Create multiple users
   - Create various posts
   - Test role-based access
   - Try the admin features

3. **Customize:**
   - Change the styling
   - Add new features
   - Modify the color scheme
   - Add your own pages

4. **Learn:**
   - Study the code structure
   - Understand authentication flow
   - Learn about React hooks
   - Explore middleware patterns

## Project Structure Overview

```
Blog-Platform/
├── backend/              # API Server
│   ├── models/           # Database schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   └── server.js         # Entry point
│
├── frontend/             # React App
│   └── src/
│       ├── pages/        # Route pages
│       ├── components/   # Reusable UI
│       ├── context/      # Global state
│       └── utils/        # API calls
│
└── Documentation/        # Guides & docs
```

## Development Workflow

1. **Start MongoDB** (once, keep running)
2. **Start Backend** (Terminal 1)
3. **Start Frontend** (Terminal 2)
4. **Make changes** to code
5. **Save files** (auto-reload in dev mode)
6. **Test in browser**
7. **Repeat steps 4-6**

## Helpful Commands

```bash
# Backend
npm start           # Start server
npm run dev         # Start with auto-reload
npm run seed        # Seed database

# Frontend
npm start           # Start dev server
npm run build       # Build for production

# Database
mongosh             # Open MongoDB shell
mongosh blog-platform  # Connect to database
```

## Tips for Beginners

1. **Keep terminals open** - You need both servers running
2. **Check console** - Look for errors in browser and terminal
3. **Read error messages** - They usually tell you what's wrong
4. **Use browser DevTools** - F12 to inspect and debug
5. **Experiment safely** - You can always re-seed the database
6. **Read the code** - Every file is commented for learning
7. **Take it slow** - Understand each part before moving on

## Getting Help

1. **Check Documentation:**
   - Read relevant .md files
   - Look at code comments
   - Review architecture diagrams

2. **Common Resources:**
   - React: https://react.dev
   - Express: https://expressjs.com
   - MongoDB: https://www.mongodb.com/docs
   - Node.js: https://nodejs.org/docs

3. **Debugging:**
   - Use `console.log()` liberally
   - Check browser Network tab
   - Review terminal error messages
   - Use MongoDB Compass to view data

## What to Learn Next

After completing this tutorial:

1. **Add Features:**
   - User profiles
   - Post comments
   - Like/unlike posts
   - Search functionality
   - Pagination

2. **Improve Security:**
   - Rate limiting
   - Email verification
   - Password reset
   - Input sanitization

3. **Enhance UX:**
   - Loading spinners
   - Toast notifications
   - Markdown editor
   - Image uploads

4. **Deploy:**
   - Host backend on Heroku/Railway
   - Host frontend on Vercel/Netlify
   - Use MongoDB Atlas

## Success Checklist

By the end, you should be able to:

- [ ] Start the full application
- [ ] Register a new user
- [ ] Login successfully
- [ ] Create a blog post
- [ ] View all posts
- [ ] Delete your own post
- [ ] Access user dashboard
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Delete any post as admin
- [ ] Understand the code flow
- [ ] Make simple modifications

## Congratulations! 🎉

You've successfully set up a full-stack blog platform with role-based access control!

**You're ready to start learning and building!**

---

*Need help? Refer to QUICK_REFERENCE.md for commands and common tasks.*
