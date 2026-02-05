# Quick Setup Guide

## 1. Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 2. Configure Environment

### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## 3. Start MongoDB

```bash
# Windows (if installed as service)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 4. Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 6. Create Admin User

1. Register a new user through the UI
2. Connect to MongoDB:
   ```bash
   mongosh blog-platform
   ```
3. Update user to admin:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Default Test Accounts

Create these for testing:

**Admin:**
- Email: admin@example.com
- Password: admin123
- (Set role to "admin" in database)

**User:**
- Email: user@example.com
- Password: user123

## Troubleshooting

- **MongoDB not running**: Start MongoDB service
- **Port 3000 in use**: Close other React apps or change port
- **Port 5000 in use**: Change PORT in backend/.env
- **CORS errors**: Ensure both servers are running

Enjoy building with Blog Platform! 🚀
