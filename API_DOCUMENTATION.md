# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated requests require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Access:** Public

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Login
**POST** `/auth/login`

**Access:** Public

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Get Current User
**GET** `/auth/me`

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

## Post Endpoints

### Get All Posts
**GET** `/posts`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "post_id",
      "title": "My First Post",
      "content": "This is the content...",
      "author": {
        "_id": "user_id",
        "username": "johndoe"
      },
      "authorName": "johndoe",
      "createdAt": "2026-02-04T10:00:00.000Z",
      "updatedAt": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

### Get Single Post
**GET** `/posts/:id`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "My First Post",
    "content": "This is the content...",
    "author": {
      "_id": "user_id",
      "username": "johndoe"
    },
    "authorName": "johndoe",
    "createdAt": "2026-02-04T10:00:00.000Z"
  }
}
```

### Create Post
**POST** `/posts`

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "My New Post",
  "content": "This is my blog post content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "post_id",
    "title": "My New Post",
    "content": "This is my blog post content...",
    "author": "user_id",
    "authorName": "johndoe",
    "createdAt": "2026-02-04T10:00:00.000Z"
  }
}
```

### Update Post
**PUT** `/posts/:id`

**Access:** Private (Owner only)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "post_id",
    "title": "Updated Title",
    "content": "Updated content...",
    "updatedAt": "2026-02-04T11:00:00.000Z"
  }
}
```

### Delete Post
**DELETE** `/posts/:id`

**Access:** Private (Owner or Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### Get User's Posts
**GET** `/posts/user/:userId`

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "post_id",
      "title": "My Post",
      "content": "Content...",
      "author": {
        "_id": "user_id",
        "username": "johndoe"
      },
      "createdAt": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

---

## User Endpoints

### Get All Users
**GET** `/users`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-02-01T10:00:00.000Z"
    }
  ]
}
```

### Get User by ID
**GET** `/users/:id`

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
}
```

### Get Platform Statistics
**GET** `/users/stats/overview`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalPosts": 25,
    "totalAdmins": 2,
    "regularUsers": 8
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

### Common Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

### Validation Errors

When validation fails, the response includes an errors array:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Username must be between 3 and 30 characters",
      "param": "username",
      "location": "body"
    }
  ]
}
```
