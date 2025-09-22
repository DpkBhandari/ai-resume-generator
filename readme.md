# User Management System 
A simple **User Management System** built with Node.js, Express, MongoDB, and JWT for authentication.  
Supports **user registration, login, email verification, password reset**, and basic **role-based access** for admin.

---

## Features

- ✅ User Registration with email verification  
- ✅ User Login with JWT authentication  
- ✅ Password Reset (Forgot Password)  
- ✅ Resend OTP / Verification Code  
- ✅ Role-based access for Admin (future use)  
- ✅ Secure password hashing using bcryptjs  
- ✅ Email notifications via Nodemailer (Gmail SMTP)

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JWT, cookies  
- **Email Service:** Nodemailer  
- **Validation:** Joi

---

## API Endpoints

### **User Routes**

| Method | Endpoint                  | Description                         | Auth Required |
|--------|---------------------------|-------------------------------------|---------------|
| POST   | `/api/v1/users/register`  | Register a new user                  | ❌             |
| POST   | `/api/v1/users/login`     | Login user                           | ❌             |
| POST   | `/api/v1/users/verify`    | Verify email with OTP                | ❌             |
| POST   | `/api/v1/users/forgot`    | Request password reset OTP           | ❌             |
| POST   | `/api/v1/users/reset`     | Reset password using OTP             | ❌             |
| POST   | `/api/v1/users/resendmail`| Resend verification OTP              | ❌             |
| POST   | `/api/v1/users/logout`    | Logout user                          | ✅             |
| GET    | `/api/v1/users/refresh`   | Refresh access token                 | ✅             |

### **Admin Routes**

| Method | Endpoint                  | Description                         | Auth Required |
|--------|---------------------------|-------------------------------------|---------------|
| GET    | `/api/v1/admin/users`     | Get all registered users             | ✅ (Admin)    |

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/user-management-system.git
cd user-management-system
Install dependencies:```

```bash
Copy code
npm install
Setup environment variables (.env):```

env
Copy code
PORT=8000
MONGO_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
PASS_EMAIL=your_email_app_password
NODE_ENV=development
Start the server:

bash
Copy code
npm run dev
Usage
Use Postman or Insomnia to test the API endpoints.

Emails (OTP, welcome, password reset) will be sent via your configured Gmail SMTP.

Notes
Password Hashing: bcryptjs

Token Expiry:

Access Token: 15 minutes

Refresh Token: 7 days

OTP Expiry: 15 minutes for registration/resend, 5 minutes for password reset

Future Improvements
Role-based access control with multiple roles (user, admin, moderator)

User profile management (update info, avatar)

Logging and monitoring admin actions

Rate limiting for login and OTP endpoints

License
This project is licensed under the MIT License.

yaml
Copy code



I can also make a **more compact “developer-friendly” version** with **example cURL requests for every endpoint** so anyone can test quickly without reading the code.  

Do you want me to create that version too?