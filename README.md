# Lazeez — Pakistani Recipe Discovery

A recipe-discovery backend built with Node.js, Express and MongoDB, with initial React Native/Expo Router screens included in the source.

## My contribution

**Solo project — Mustafa Zahoor.** I implemented the recipe API, database models, authentication and initial mobile screens.

## Implemented scope

- Account registration and JWT login.
- Recipe CRUD, public/private visibility and likes.
- Recipe categories, ingredient/name search, sorting and pagination.
- Express middleware for request validation, rate limiting and security headers.

The mobile files are an initial client scaffold. The committed package manifest contains backend dependencies and scripts; it does not configure a complete runnable Expo application. Recipe discovery is based on queries and categories, not a trained recommendation model.

## Repository layout

The application lives in [Recipe Recmendation App](./Recipe%20Recmendation%20App/) (the directory spelling is retained).

| Path | Purpose |
| --- | --- |
| `controllers/`, `routes/` | API request handlers and routes |
| `models/` | User, recipe and category models |
| `middleware/` | Authentication and error handling |
| `data/` | Recipe seed JSON |
| `scripts/seedData.js` | Optional local seed helper |
| `src/` | Initial mobile screens and local client data |
| `server.js` | Express entry point |

## Run the backend locally

Use a Node.js version supported by the dependencies and a running MongoDB instance.

```bash
git clone https://github.com/Mustafazahoor975/Recipe-Recommendation.git
cd "Recipe-Recommendation/Recipe Recmendation App"
npm install
```

Create a local `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-app
JWT_SECRET=replace_with_a_long_random_local_secret
JWT_EXPIRE=30d
CORS_ORIGINS=http://localhost:3000,http://localhost:8081
NODE_ENV=development
```

Start the API:

```bash
npm run dev
```

Check [http://localhost:5000/api/health](http://localhost:5000/api/health). This endpoint confirms that the server responds; exercise database-backed routes separately.

### Optional seed data

From the application directory:

```bash
node scripts/seedData.js
```

**Use a disposable local database:** this helper deletes existing recipes and categories before inserting sample data, and creates a demo account if one is absent. It is not a production migration. There is no `npm run seed` script in the current package manifest.

## Mobile client status

The `src/` folder contains initial Expo Router screens. Additional Expo configuration, dependencies and integration work are needed before a standalone mobile build can be documented. The backend's `npm install` does not install a complete Expo client.

## Validation status

The seed helper's JavaScript syntax has been checked. Database seeding and end-to-end application flows have not been executed as part of this documentation update. The current `npm test` script is a placeholder.
