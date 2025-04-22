# 🚀 JWT Authentication Practice API (Node.js + Express + MongoDB)

This project is a simple demonstration of user authentication using **JSON Web Tokens (JWT)** with Node.js, Express, MongoDB (via Mongoose), and Passport.js.

---

## 📦 Technologies & Libraries Used

| Library         | Purpose                                 |
|----------------|------------------------------------------|
| `express`      | Web server framework                     |
| `mongoose`     | ODM for MongoDB                          |
| `cors`         | Enable cross-origin requests             |
| `dotenv`       | Manage environment variables             |
| `bcryptjs`     | Password hashing                         |
| `jsonwebtoken` | JWT token generation & verification      |
| `passport`     | Middleware for authentication            |
| `passport-jwt` | JWT strategy for Passport                |

---

## 📁 Project Structure Overview

```
.
├── server.js            # Main entry point for the server
├── user-service.js      # User registration, login, and DB logic
├── data-service.js      # Vehicle data handling
├── .env                 # Secret environment variables (not pushed)
├── package.json         # Dependencies & scripts
```

---

## 🔑 Features Implemented

### ✅ Register a User
**POST** `/api/register`

- Registers a new user with `userName`, `password`, `password2`, `fullName`, and `role`.
- Passwords are hashed using `bcryptjs`.

---

### ✅ Login a User
**POST** `/api/login`

- Validates user credentials.
- Returns a JWT token with the user payload.
- Uses `bcrypt.compare` to verify the password.

---

### ✅ View Vehicles (Protected Route)
**GET** `/api/vehicles`

- JWT-protected route.
- Requires a valid token passed in the `Authorization` header as `Authorization: jwt <token>`.

---

### ✅ View All Users (Protected Route for testing)
**GET** `/api/users`

- Also a protected route.
- Useful to verify token authentication and test user listing.

---

## 🔐 JWT & Passport Configuration

JWT signing:
```js
jwt.sign(payload, process.env.JWT_KEY);
```

Passport strategy setup:
```js
ExtractJwt.fromAuthHeaderWithScheme('jwt')
```

Middleware for protecting routes:
```js
passport.authenticate('jwt', { session: false })
```

---

## 🛠️ Environment Variables (.env)

Create a `.env` file in the project root with:

```
PORT=8080
MONGO_DB_CONNECTION=mongodb+srv://<your-user>:<password>@<cluster-url>/<dbname>
JWT_KEY=yourSuperSecretPrivateKey
```

> ⚠️ Ensure `.env` is added to `.gitignore` to keep it secure and private.

---

## ✅ How to Run the App

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node server.js
```

3. Use a REST client like **Thunder Client** or **Postman** to test endpoints.

---

## 🧠 Summary

This app demonstrates:

- Registering and hashing user credentials
- Authenticating and generating JWTs
- Protecting API routes with Passport.js
- Using environment variables securely

Perfect for getting hands-on with **authentication workflows** in a full-stack Node.js environment.

---
