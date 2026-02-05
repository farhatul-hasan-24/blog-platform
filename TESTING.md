# Testing Guide

## Manual Testing Checklist

### 1. Authentication Tests

#### Registration
- [ ] Register with valid credentials
  - Username: 3-30 characters
  - Valid email format
  - Password: minimum 6 characters
  - Passwords match
- [ ] Try registering with existing email (should fail)
- [ ] Try registering with existing username (should fail)
- [ ] Try short username (< 3 chars) - should show error
- [ ] Try short password (< 6 chars) - should show error
- [ ] Try mismatched passwords - should show error
- [ ] Verify automatic login after registration
- [ ] Check token stored in localStorage

#### Login
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Login with empty fields (should fail)
- [ ] Verify redirect to dashboard after login
- [ ] Check user data stored in localStorage

#### Logout
- [ ] Logout successfully
- [ ] Verify token removed from localStorage
- [ ] Verify redirect to home page
- [ ] Try accessing protected route after logout (should redirect)

### 2. Public Routes (Not Logged In)

#### Home Page
- [ ] View all posts without logging in
- [ ] See correct author names on posts
- [ ] See "Get Started" and "Sign In" buttons
- [ ] Verify can't see delete buttons on posts
- [ ] Click on navigation links work

#### Navigation
- [ ] "Home" link works
- [ ] "Login" link works
- [ ] "Sign Up" button works
- [ ] Navbar shows correctly for logged-out users

### 3. User Role Tests

#### User Dashboard Access
- [ ] Login as regular user
- [ ] Access dashboard successfully
- [ ] See "My Dashboard" heading
- [ ] See create post form
- [ ] See list of only user's own posts
- [ ] Verify correct post count

#### Creating Posts
- [ ] Create post with valid title and content
- [ ] Try creating post with title < 3 chars (should fail)
- [ ] Try creating post with content < 10 chars (should fail)
- [ ] Try creating post with title > 200 chars (should fail)
- [ ] Verify new post appears immediately in dashboard
- [ ] Verify new post appears on home page
- [ ] Verify author name is correct

#### Deleting Own Posts
- [ ] Delete own post from dashboard
- [ ] Confirm deletion dialog appears
- [ ] Post removed from list after deletion
- [ ] Post count updates correctly
- [ ] Try to delete another user's post (button shouldn't show)

#### Viewing Posts
- [ ] View all posts on home page
- [ ] See delete button only on own posts
- [ ] Navigate between dashboard and home
- [ ] Verify posts display correctly everywhere

### 4. Admin Role Tests

#### Admin Access
- [ ] Login as admin
- [ ] See "Admin" link in navbar
- [ ] Access admin dashboard successfully
- [ ] Regular users can't see admin link
- [ ] Regular users redirected if try to access /admin

#### Admin Dashboard
- [ ] View platform statistics
  - Total users count
  - Total posts count
  - Regular users count
  - Admins count
- [ ] Statistics are accurate
- [ ] All posts from all users displayed
- [ ] Can see delete button on all posts

#### Admin Moderation
- [ ] Delete any user's post
- [ ] Confirm deletion works
- [ ] Stats update after deletion
- [ ] Post removed from home page too

#### Admin Privileges
- [ ] Can create posts (same as users)
- [ ] Can access user dashboard
- [ ] Can access admin dashboard
- [ ] Has all user capabilities + moderation

### 5. Protected Routes

#### Authentication Guards
- [ ] Try accessing /dashboard when logged out → redirects to /login
- [ ] Try accessing /admin when logged out → redirects to /login
- [ ] Try accessing /admin as regular user → redirects to /dashboard
- [ ] Login successfully allows access to protected routes

### 6. API Endpoint Tests

Use Postman, curl, or similar tool:

#### Auth Endpoints

**Register**
```bash
POST http://localhost:5000/api/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
Expected: 201, user object + token
```

**Login**
```bash
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
Expected: 200, user object + token
```

**Get Current User**
```bash
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <token>
Expected: 200, user object
```

#### Post Endpoints

**Get All Posts**
```bash
GET http://localhost:5000/api/posts
Expected: 200, array of posts
```

**Create Post**
```bash
POST http://localhost:5000/api/posts
Headers: Authorization: Bearer <token>
Body: {
  "title": "Test Post",
  "content": "This is test content..."
}
Expected: 201, post object
```

**Delete Post**
```bash
DELETE http://localhost:5000/api/posts/:id
Headers: Authorization: Bearer <token>
Expected: 200, success message
```

#### Admin Endpoints

**Get Stats**
```bash
GET http://localhost:5000/api/users/stats/overview
Headers: Authorization: Bearer <admin_token>
Expected: 200, statistics object
```

**Get All Users**
```bash
GET http://localhost:5000/api/users
Headers: Authorization: Bearer <admin_token>
Expected: 200, array of users
```

### 7. Error Handling

#### Frontend
- [ ] Network error shows user-friendly message
- [ ] Validation errors display correctly
- [ ] Loading states work properly
- [ ] Success messages show after actions

#### Backend
- [ ] Invalid token returns 401
- [ ] Missing required fields returns 400
- [ ] Unauthorized actions return 403
- [ ] Non-existent resources return 404
- [ ] Server errors return 500

### 8. UI/UX Tests

#### Responsive Design
- [ ] Mobile view (< 768px)
  - Navbar stacks correctly
  - Posts display properly
  - Forms are usable
  - Buttons accessible
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)

#### Visual Feedback
- [ ] Loading indicators during API calls
- [ ] Error messages are visible and clear
- [ ] Success messages show briefly
- [ ] Buttons disabled during submission
- [ ] Hover effects work

#### Navigation
- [ ] All links work correctly
- [ ] Back button works properly
- [ ] Redirects happen smoothly
- [ ] No broken links

### 9. Data Persistence

#### LocalStorage
- [ ] Token persists across page refreshes
- [ ] User data persists across page refreshes
- [ ] Login state maintained after refresh
- [ ] Logout clears all stored data

#### Database
- [ ] Posts persist after server restart
- [ ] Users persist after server restart
- [ ] Deletions are permanent
- [ ] Updates are saved

### 10. Edge Cases

#### Empty States
- [ ] No posts: Show "No posts yet" message
- [ ] User has no posts: Show appropriate message
- [ ] Empty form submission prevented

#### Long Content
- [ ] Very long post title (200 chars) displays correctly
- [ ] Very long post content displays correctly
- [ ] Long usernames display properly

#### Special Characters
- [ ] Posts with special characters (!@#$%^&*)
- [ ] Unicode characters (emojis, accents)
- [ ] Line breaks in post content

#### Concurrent Actions
- [ ] Multiple users can post simultaneously
- [ ] Deletions reflect immediately for all users
- [ ] No race conditions

## Quick Test Script

Create test accounts:
```javascript
// In MongoDB shell
db.users.insertOne({
  username: "testuser",
  email: "test@example.com",
  password: "$2a$10$<bcrypt_hash>", // Use bcrypt.hashSync('password123', 10)
  role: "user",
  createdAt: new Date()
});

db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$<bcrypt_hash>", // Use bcrypt.hashSync('admin123', 10)
  role: "admin",
  createdAt: new Date()
});
```

Create test posts:
```javascript
db.posts.insertMany([
  {
    title: "First Test Post",
    content: "This is the content of the first test post.",
    author: ObjectId("user_id"),
    authorName: "testuser",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Second Test Post",
    content: "This is the content of the second test post.",
    author: ObjectId("user_id"),
    authorName: "testuser",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## Test Results Template

```
Date: __________
Tester: __________

| Test Category        | Status | Notes |
|---------------------|--------|-------|
| Registration        | ✅ / ❌ |       |
| Login               | ✅ / ❌ |       |
| Logout              | ✅ / ❌ |       |
| Create Post         | ✅ / ❌ |       |
| Delete Own Post     | ✅ / ❌ |       |
| View Posts          | ✅ / ❌ |       |
| User Dashboard      | ✅ / ❌ |       |
| Admin Dashboard     | ✅ / ❌ |       |
| Admin Moderation    | ✅ / ❌ |       |
| Protected Routes    | ✅ / ❌ |       |
| Responsive Design   | ✅ / ❌ |       |
| Error Handling      | ✅ / ❌ |       |

Issues Found:
1. _____________________
2. _____________________
3. _____________________
```

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] API responses in < 500ms
- [ ] No memory leaks
- [ ] Smooth scrolling and interactions

Good luck with testing! 🚀
