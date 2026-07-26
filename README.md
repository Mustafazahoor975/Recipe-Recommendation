# 🥘 Lazeez - Pakistani Recipe Recommendation App

Welcome to **Lazeez**, a modern, full-stack Pakistani Recipe Recommendation Application. The project comprises a robust, secure **Node.js/Express backend** connected to a **MongoDB database**, and an **Expo Router-powered React Native mobile application frontend**.

---

## 🚀 Features

### 💻 Backend API
- **User Authentication**: Secure signup and login endpoints using JWT (JSON Web Tokens) and passwords hashed with `bcryptjs`.
- **Recipe Management**: Create, read, update, and delete (CRUD) recipes, mark recipes as public or private, and toggle likes.
- **Categorization**: Group recipes by category (`Breakfast`, `Lunch`, `Dinner`, `Fast Food`) with dynamic count updates.
- **Advanced Querying**: Text search across recipe names and ingredients, plus sorting and pagination.
- **Security Protocols**: Armed with API rate-limiting (`express-rate-limit`) and security header protection (`helmet`).

### 📱 Frontend Client
- **Interactive UI**: Native cross-platform UI built on React Native.
- **Expo Router Navigation**: Modern stack navigation layout (`_layout.tsx`) with dynamic route passing.
- **State Integration**: Screen-specific logic managing state dynamically (`categories.tsx`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend Core** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose (ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Security & Utilities** | Helmet, Express Rate Limit, Multer (file upload), Dotenv, Express Validator |
| **Frontend Framework** | React Native, Expo Router, TypeScript |

---

## 📂 Project Structure

```bash
Recipe-Recommendation/
├── Recipe Recmendation App/
│   ├── controllers/         # Express route controllers (auth, recipes, users, categories)
│   ├── data/                # Seed JSON files (breakfast, lunch, dinner, fastfood)
│   ├── middleware/          # JWT protect, error handling, and 404 middlewares
│   ├── models/              # Mongoose database schemas (User, Recipe, Category)
│   ├── routes/              # Express API route endpoints
│   ├── scripts/             # Database seeding scripts (seedData.js)
│   ├── src/                 # Expo Router React Native client screens and local data
│   │   ├── data/            # Local frontend JSON mock data
│   │   ├── _layout.tsx      # Main Expo Stack Navigation layout
│   │   └── categories.tsx   # React Native categories screen
│   ├── package.json         # Node.js dependencies and scripts configuration
│   └── server.js            # Server entry point
└── README.md                # Project documentation (this file)
```

---

## ⚙️ Backend Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally or a MongoDB Atlas URI)

### 2. Installation
Navigate to the app folder and install the Node.js dependencies:
```bash
cd "Recipe Recmendation App"
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of `"Recipe Recmendation App"` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CORS_ORIGINS=http://localhost:3000,http://localhost:8081
NODE_ENV=development
```

### 4. Seed the Database
Populate your MongoDB database with pre-configured Pakistani recipe categories and meals (Breakfast, Lunch, Dinner, Fast Food):
```bash
npm run seed
# or manually: node scripts/seedData.js
```
*(Note: Seeding creates an Admin user with email `admin@recipeapp.com` and password `password123`)*

### 5. Run the Server
Run in development mode with hot-reloading (via nodemon):
```bash
npm run dev
```
The server will boot on `http://localhost:5000`. You can test connection via the Health Check API:
`http://localhost:5000/api/health`

---

## 📱 Mobile Frontend Setup

The mobile application utilizes **Expo Router**. If you're running it, ensure you have Expo CLI installed:

1. Globally install expo CLI (if not done already):
   ```bash
   npm install -g expo-cli
   ```
2. Navigate to the client directory (if split, or using the entry-point) and start the bundler:
   ```bash
   npx expo start
