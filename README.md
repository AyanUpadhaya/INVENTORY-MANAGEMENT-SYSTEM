# 🛒 MERN Stack Auth Template

The project includes a secure authentication system using **access & refresh tokens**, product management UI, and smooth API handling with **RTK Query (Redux Toolkit Query)** including **optimistic UI updates** for seamless UX.

---

## 🚀 Features

### 🔐 Authentication

- Login & registration system
- Access token stored in **localStorage**
- Refresh token stored securely in **HttpOnly cookies**
- Automatic token refresh handling when expired

### 🛍 Product Management

- Add new products
- Fetch and display all products in list view
- Delete products with **optimistic UI update**
- Real-time UI update without page reload

### ⚡ API & State Handling

- Backend built with **Express + MongoDB**
- Frontend built with **React**
- **RTK Query** for fetching & mutations
- CORS handled for communication
- Modular folder structure

---

## 🧰 Tech Stack

### **Frontend**

- React
- Redux Toolkit
- RTK Query

### **Backend**

- Node.js
- Express.js
- MongoDB + Mongoose

### **Authentication**

- JWT Access Token
- HttpOnly Refresh Token

---

## Backend setup

```bash
cd server
npm i
npm run dev
```

or you can run with

```bash
npm start
```

Required env

``` .env
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=5000
````

## Frontend setup

```bash
cd client
npm i
npm run dev
```

Required env

``` .env
VITE_BASE_URL=
````
