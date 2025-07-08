
# 🔗 Authenticated URL Shortener (MERN Stack)

This is a full-stack URL shortener web application built with the **MERN stack (MongoDB, Express, React, Node.js)**. The app allows users to register, log in, and create shortened URLs. All URL shortening features are accessible only to authenticated users. The system implements JWT-based authentication and secure password handling to protect user data.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (with Vite or CRA)
* **Backend:** Node.js + Express.js (JWT Authentication)
* **Database:** MongoDB
* **Authentication:** JWT, bcrypt
* **Deployment:** Frontend (Vercel/Netlify), Backend (Render/Heroku)

---

## 🚀 Features

* 🔐 Secure user authentication (Register, Login, Logout)
* 🧾 JWT-based access to authenticated routes
* ✂️ Shorten long URLs into shareable short links
* 🔁 Redirection from short URL to original URL
* 📜 User dashboard showing shortened URLs
* ⚠️ Proper validation and error handling
* 🧹 Clean, minimal, and responsive UI

---

## 📂 Project Structure

```bash
project-root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── .env
    └── vite.config.js
```

---

## ⚙️ Environment Variables

### Frontend `.env`

```
VITE_SERVER_BASEURL=http://localhost:5000
```

### Backend `.env`

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
FRONTEND_URI=http://localhost:3000
```

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Server will run at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 🧑‍💻 Using the App

1. Navigate to `http://localhost:3000`
2. Register a new user or log in.
3. Use the form to input long URLs and shorten them.
4. Copy and share short URLs. Users are redirected to the original link when accessed.

---

## 📦 Deployment

### Frontend

Deploy using **Vercel** or **Netlify**. Make sure to:

* Update `VITE_SERVER_BASEURL` to the deployed backend URL.

### Backend

Deploy using **Render** or **Heroku**. Make sure to:

* Set `FRONTEND_URI`, `MONGO_URI`, and `JWT_SECRET` in the environment.
* Enable CORS for your frontend origin.

---

## 📸 Sample UI

### Login / Register

* Email and password fields
* Real-time error handling

### URL Shortener Page

* Form to submit long URL
* Table listing created short URLs
* Copy-to-clipboard feature

---

## 🔒 Security Considerations

* Passwords are hashed using `bcrypt`
* JWTs are stored securely and used for protected endpoints
* CORS implemented to restrict unauthorized frontend access
* Input validation and sanitization on both frontend and backend

---

## 📃 License

This project is licensed under the **MIT License**. For educational/demo purposes only.

---

## 🤖 AI Assistance Acknowledgement

This project was enhanced using **ChatGPT**, which assisted in:

* Structuring the backend with proper modularity
* Implementing JWT-based auth flow
* Frontend state management for user sessions
* Writing and organizing this README

---

## 📬 Contact

For issues or contributions, please open a GitHub issue or submit a PR at:
https://github.com/Arshad-Rahim/URL_Shortner
