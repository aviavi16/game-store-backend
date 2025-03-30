# 🎲 GameStore Backend

Backend service for a Tinder-style board game app that helps you discover new games, track your favorites, and stay up to date with game deals.

---

## 🚀 Project Goals

This is the backend foundation for a larger full-stack app that will eventually be a **React Native mobile app** where users can:

- Swipe left/right on board games (Tinder-style)
- Discover trending games from BoardGameGeek (BGG)
- Get notified about games they haven't played in a while
- See price drops on games they like

---

## 🔧 Technologies Used

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB**
- **OpenAI API** – auto-generates game descriptions
- **Unsplash API** – provides free commercial-use game images
- **Postman Extension** in VS Code – used for testing API endpoints

---

## 📦 Key API Endpoints

### Import a Game
```http
POST /api/game/import?name=Splendor
```
- Generates description via OpenAI
- Fetches image from Unsplash
- Saves to MongoDB

### Get Games From Date
```http
GET /api/game/from-date?fromDate=2025-03-30T00:00&includeMissing=true
```
- Returns all games created from a specific date onward
- Optionally includes older entries missing a timestamp

---

## ⚙️ Setup Instructions

1. Clone the repo:
```bash
git clone https://github.com/aviavi16/game-store-backend.git
cd game-store-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3030
MONGO_URL=mongodb://localhost:27017
DB_NAME=BoardGamesDB
OPENAI_API_KEY=your-openai-api-key
UNSPLASH_API_KEY=your-unsplash-access-key
```

4. Start the server:
```bash
npx ts-node src/server.ts
```

---

## 🧭 Next Steps

- Build the mobile app with **React Native**
- Add login/auth system
- Track user preferences
- Support notifications + real-time deals

---

## 📬 Contact & Ideas

Got an idea for a feature? Love board games? Let me know — I'm always happy to hear from fellow devs and game lovers!

---

[⭐ Check out the repo on GitHub](https://github.com/aviavi16/game-store-backend)

