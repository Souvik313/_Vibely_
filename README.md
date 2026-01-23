# Vibely - Social Media Application

[🌐 Live Demo](https://vibely-mauve.vercel.app) 

A full-stack social media platform built with **React**, **Node.js**, **MongoDB**, and **Socket.IO**. Vibely allows users to create posts, comment on posts, share media, follow others, chat in real time, and see live online/offline status — built with scalability and real-world architecture in mind.

**[🚀 Quick Start](#-getting-started) • [✨ Features](#-features) • [📚 Documentation](#-documentation) • [🔗 API Routes](#-api-routes) • [🐛 Troubleshooting](#-troubleshooting--common-issues) • [📝 Contributing](#-contributing)**

---

## 🌟 Features

### 🔐 Authentication & Users

* JWT-based authentication (Login / Register)
* Secure password hashing with bcrypt
* User profiles with bio & profile picture
* Follow / Unfollow users
* Followers & following lists

### 📝 Posts & Content

* Create posts with text, images, or videos
* Home feed with all users’ posts
* Save / unsave posts
* Delete own posts
* Comment on posts

### 💬 Real-Time Chat (NEW)

* One-to-one real-time messaging using **Socket.IO**
* Auto-create conversation when chatting from a profile
* Message delivery without refresh
* Multi-tab & incognito support

### 🟢 Online / Offline Presence (NEW)

* Live online/offline user tracking
* Multiple socket connections per user supported
* Accurate status across:

  * Multiple tabs
  * Incognito windows
  * Page refreshes
* Last seen timestamp stored in DB

### 🎨 User Experience

* Responsive & modern UI
* Clean component-based design
* Fast development with Vite
* Optimized API calls via custom hooks

---

## 📋 Tech Stack

### Frontend

* React 18
* Vite
* React Router v6
* Axios
* Context API
* Socket.IO Client
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* Socket.IO
* JWT Authentication
* Multer & Cloudinary
* Bcrypt

---

## 🚀 Getting Started

### Prerequisites

* Node.js v16+
* npm v8+
* MongoDB (local or Atlas)
* Git

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/vibely

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📁 Project Structure

```
Social_App/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── config/
    ├── sockets/
    ├── server.js
    └── package.json
```

---

## 🔌 Real-Time Architecture (IMPORTANT)

### Online Presence Logic

* Each user can have **multiple socket connections**
* Server maintains:

```js
Map<userId, Set<socketId>>
```

### User is marked:

* **Online** → when first socket connects
* **Offline** → when last socket disconnects

### Events Used

| Event         | Purpose                  |
| ------------- | ------------------------ |
| `setup`       | Register user socket     |
| `onlineUsers` | Initial sync             |
| `userOnline`  | Real-time online update  |
| `userOffline` | Real-time offline update |

This design prevents race conditions and works across tabs & incognito sessions.

---

## 🔗 API Routes

Base URL: `http://localhost:5000/api/v1`

### Auth

* `POST /auth/register`
* `POST /auth/login`

### Users

* `GET /users/users`
* `GET /users/user/:id`
* `PATCH /users/update/:id`

### Posts

* `GET /all-posts`
* `POST /posts/create`
* `DELETE /posts/:id`

### Comments

* `GET /comments/post/:postId`
* `POST /comments/create`
* `DELETE /comments/:commentId`

### Follow

* `POST /follow/follow/:userId`
* `DELETE /follow/unfollow/:userId`

---

## 🐛 Troubleshooting

### Online Status Not Updating

✔ Ensure socket `setup(userId)` is emitted after login
✔ Ensure `VITE_SOCKET_URL` is correct
✔ Check multiple tabs logic on backend

### Chat Redirecting to Wrong User

✔ Verify conversation creation logic
✔ Ensure correct `otherUserId` passed in route

### CORS Errors

✔ Match frontend URL with `CORS_ORIGIN`

---

## 🔒 Security

* Password hashing with bcrypt
* JWT-based protected routes
* Secure file uploads via Cloudinary
* Input validation & sanitization

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a PR

---

## 📄 License

MIT License

---

**Vibely is built like a real-world social platform — scalable, real-time, and production-ready.** 🚀
