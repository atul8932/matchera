# 💫 Companion – Find Your Perfect Partner for Everything

> **Intent-based companionship platform** — not just dating. Find partners for walking, travel, food, work, fitness, dating, and more.

---

## 🚀 Live Preview

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Dark theme + Glassmorphism) |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Realtime | Socket.IO |
| Auth | JWT (bcryptjs) |

---

## 📁 Project Structure

```
companion_app/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Responsive navbar with auth state
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Global auth state
│   │   │   └── ToastContext.jsx # Toast notifications
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Hero + Features + CTA
│   │   │   ├── Login.jsx       # Sign in page
│   │   │   ├── Register.jsx    # 3-step sign up
│   │   │   ├── Explore.jsx     # Swipe/discover profiles
│   │   │   ├── Sessions.jsx    # Create + join sessions
│   │   │   ├── Matches.jsx     # Your matches + compatibility
│   │   │   ├── Chat.jsx        # Real-time messaging
│   │   │   ├── Profile.jsx     # View + edit profile
│   │   │   ├── Safety.jsx      # SOS, report, rate
│   │   │   └── Admin.jsx       # Admin panel
│   │   ├── utils/
│   │   │   ├── api.js          # Axios instance with auth
│   │   │   └── constants.js    # Intent configs, helpers
│   │   ├── App.jsx             # Routes + protected routes
│   │   ├── main.jsx
│   │   └── index.css           # Global design system
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Node.js Backend
    ├── models/
    │   ├── User.js             # Full user schema
    │   ├── Session.js          # Companion sessions
    │   ├── Message.js          # Chat messages (with TTL)
    │   ├── Match.js            # Mutual matches
    │   └── Report.js           # Reports + Ratings
    ├── routes/
    │   ├── auth.js             # Register, login, profile
    │   ├── users.js            # Explore, like/pass, matches
    │   ├── sessions.js         # CRUD + join requests
    │   ├── chat.js             # Message history
    │   ├── safety.js           # Report, rate, SOS
    │   └── admin.js            # Admin dashboard
    ├── index.js                # Express + Socket.IO server
    ├── .env
    └── package.json
```

---

## ▶️ Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Backend
```bash
cd server
npm install
npm start
# Server: http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
# App: http://localhost:5173
```

---

## 🔥 Features

### 🎯 Intent-Based Matching (Core USP)
Users pick their intent before matching:
- 🚶 Walking Partner
- ✈️ Travel Buddy
- 🍽️ Food Partner
- 💻 Work / Study
- ❤️ Dating
- ☕ Casual Dating
- 🏃 Fitness Buddy
- 🎉 Events / Outings

### 🧠 Smart Compatibility Score
- Scores based on shared intents, interests, mood
- Shows "82% compatible" on match

### 🔐 Auth System
- JWT-based (email + password)
- Role-based (user / admin)
- Protected routes

### 📅 Session Creation
- Post companion sessions (breakfast, trek, study, etc.)
- Join requests + approval system
- Budget, time, location, max participants

### 💬 Real-Time Chat (Socket.IO)
- 1-on-1 messaging between matches
- Typing indicators
- Read receipts
- AI icebreaker prompts
- Disappearing message support (TTL)

### 🛡️ Safety Center
- SOS emergency button
- Safe check-in system
- Report users (7 reasons)
- Rate after meeting (1-5 stars + tags)
- Safety tips dashboard

### ⚙️ Admin Panel
- Platform stats (users, sessions, matches, reports)
- User management (search, ban, verify)
- Reports handling (review, resolve, dismiss)
- Blue-tick verification

---

## 🔑 Environment Variables

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/companion
JWT_SECRET=companion_super_secret_key_2024
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

---

## 🔥 Next Steps (Recommended)

- [ ] Phone OTP via Twilio
- [ ] Profile photo upload (Cloudinary)
- [ ] Push notifications (FCM)
- [ ] Razorpay payment for Premium
- [ ] AI matching & icebreakers (OpenAI)
- [ ] Google Maps location integration
- [ ] Mobile app (React Native)
