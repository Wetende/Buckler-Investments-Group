# 🔐 Authentication Endpoints - Complete JWT System

## 🚀 **Production-Ready JWT Authentication**

Your **Buckler Investment Group** super platform now has a complete JWT authentication system with all essential endpoints for production use.

---

## 📋 **Available Endpoints**

### **🔑 Core Authentication**

#### **1. Login (Get Tokens)**
```http
POST /api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=user@example.com
password=your_password
```
**Response:**
```json
{
  "access_token": "<jwt-token>",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "<refresh-token>"
}
```

#### **2. Refresh Access Token**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "<refresh-token>"
}
```
**Response:**
```json
{
  "access_token": "<new-jwt-token>",
  "token_type": "bearer", 
  "expires_in": 900,
  "refresh_token": "<refresh-token>"
}
```

#### **3. Logout**
```http
POST /api/v1/auth/logout
Authorization: Bearer <access-token>
```
**Response:**
```json
{
  "ok": true,
  "message": "Successfully logged out"
}
```

#### **4. Revoke Refresh Token**
```http
POST /api/v1/auth/revoke
Content-Type: application/json

{
  "refresh_token": "<refresh-token>"
}
```
**Response:**
```json
{
  "ok": true,
  "message": "Refresh token revoked successfully"
}
```

---

### **👤 User Management**

#### **5. Register New User**
```http
POST /api/v1/users/
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "New User",
  "phone": "+254712345678",
  "role": "BUYER"
}
```
**Response (201):**
```json
{
  "id": 123,
  "email": "newuser@example.com",
  "name": "New User",
  "phone": "+254712345678",
  "role": "BUYER",
  "is_active": true,
  "created_at": "2024-01-22T10:30:00Z"
}
```

#### **6. Get Current User Profile**
```http
GET /api/v1/users/me
Authorization: Bearer <access-token>
```
**Response:**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+254712345678",
  "role": "BUYER",
  "is_active": true,
  "created_at": "2024-01-22T10:30:00Z"
}
```

#### **7. Update User Profile**
```http
POST /api/v1/users/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+254722345678"
}
```

---

### **🔐 Password Management**

#### **8. Request Password Reset**
```http
POST /api/v1/auth/password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "ok": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

#### **9. Confirm Password Reset**
```http
POST /api/v1/auth/password-reset/confirm
Content-Type: application/json

{
  "token": "<reset-token>",
  "new_password": "NewSecurePassword123!"
}
```
**Response:**
```json
{
  "ok": true,
  "message": "Password successfully reset"
}
```

#### **10. Change Password (Authenticated)**
```http
POST /api/v1/auth/change-password
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "old_password": "OldPassword123!",
  "new_password": "NewSecurePassword123!"
}
```
**Response:**
```json
{
  "ok": true,
  "message": "Password successfully changed"
}
```

---

## 🔧 **Testing in Swagger UI**

### **Access Swagger Documentation:**
```
http://localhost:8000/docs
```

### **Authentication Flow for Testing:**

1. **Register a new user** using `POST /api/v1/users/`
2. **Login** using `POST /api/v1/auth/token` 
3. **Copy the access_token** from the response
4. **Click "Authorize"** in Swagger UI
5. **Enter:** `Bearer <your-access-token>`
6. **Test protected endpoints** like `GET /api/v1/users/me`

---

## 🏗️ **Architecture Features**

### **✅ Security Best Practices**
- **bcrypt password hashing** with automatic salts
- **JWT tokens** with proper expiration (15 minutes)
- **Refresh tokens** for long-term authentication (30 days)
- **Protected routes** requiring Bearer token authentication
- **Input validation** on all endpoints
- **Error handling** with proper HTTP status codes

### **✅ Onion Architecture Compliance**
- **Domain Layer**: Pure user entities and business logic
- **Application Layer**: Use cases for authentication workflows
- **Infrastructure Layer**: JWT, bcrypt, database operations
- **API Layer**: HTTP controllers with dependency injection

### **✅ Platform Standards**
- **Integer IDs only** (no UUIDs)
- **GET and POST methods only** following your conventions
- **Proper error responses** (401, 400, 422)
- **Type-safe** with full Pydantic validation

---

## 🎯 **Production Considerations**

### **Current Implementation:**
- ✅ **Development Ready**: All endpoints working
- ✅ **In-memory refresh tokens**: Good for development
- ✅ **Password reset simulation**: Logs tokens to console

### **For Production Deployment:**
- 🔄 **Move refresh tokens to Redis/Database**
- 🔄 **Implement email service for password resets**
- 🔄 **Add rate limiting on auth endpoints**
- 🔄 **Add session management and monitoring**
- 🔄 **Configure proper JWT secrets via environment**

---

## 🚀 **What's Ready Now**

Your authentication system supports the complete user journey:

1. **👋 User Registration** → Create account with validation
2. **🔐 Login** → Get access + refresh tokens  
3. **🛡️ Protected API Access** → Use Bearer token
4. **🔄 Token Refresh** → Extend session without re-login
5. **🔑 Password Management** → Reset and change passwords
6. **👋 Logout** → Secure token revocation

**Ready for your super platform** with Airbnb-style rentals, tours, property listings, investments, and car rentals! 🎉
