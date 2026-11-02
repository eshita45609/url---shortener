# Linkly – URL Shortener

Linkly is a full-stack URL shortener I built with React, Express and MongoDB. You paste a long URL and get a short link back. When someone opens the short link, the server sends them to the original URL and adds one to the click count.

You can use it without an account to quickly shorten a link. If you sign up and log in, you get a dashboard where you can see all your links, how many clicks each one has, and delete the ones you don't need.

## Features

**Without an account (landing page)**
- Shorten a long URL
- Optional custom alias (for example `my-link` instead of a random code)
- Pick an expiry: 1 day, 7 days, 30 days or never
- Copy the short link to the clipboard

**With an account**
- Sign up with name, email and password
- Log in and get a JWT token (valid for 1 hour)
- Protected dashboard (redirects to login if there is no token)
- Create short links with an optional custom alias and expiry date
- Stats cards: total links, total clicks, active links and expired links
- Table of your links with search, filter (all / active / expired) and sort (newest, oldest, most clicks)
- Pagination (5 links per page)
- Copy and delete links
- Logout

**Backend behaviour**
- Random 8-character short codes generated with `nanoid`, checked for duplicates
- Custom aliases are rejected if already taken
- URLs are validated before saving
- Passwords are hashed with `bcryptjs` before they are stored
- Expired links return an error instead of redirecting
- A 404 page on the frontend for unknown routes

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router DOM 7
- lucide-react (icons)
- Plain CSS (one CSS file per component)

**Backend**
- Node.js
- Express 5
- MongoDB with Mongoose
- jsonwebtoken (JWT auth)
- bcryptjs (password hashing)
- nanoid (short code generation)
- cors, dotenv
- nodemon (for development)

## Folder Structure

```
url-shortener/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   │
│   └── url-shortener/
│       │
│       ├── backend/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── package.json
│       │   ├── package-lock.json
│       │   └── server.js
│       │
│       └── frontend/
│           └── components/
│               ├── AuthCard.jsx
│               ├── AuthCard.css
│               ├── Dashboard.jsx
│               ├── Dashboard.css
│               ├── ErrorPage.jsx
│               ├── ErrorPage.css
│               ├── Global.css
│               ├── HeroSection.jsx
│               ├── HeroSection.css
│               ├── LandingPage.jsx
│               ├── LandingPage.css
│               ├── Login.jsx
│               ├── Login.css
│               ├── Navbar.jsx
│               ├── Navbar.css
│               ├── ProtectedRoute.jsx
│               ├── SignUp.jsx
│               └── SignUp.css
│
├── .gitignore
├── README.md
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```


## How It Works

### Frontend and backend connection
The React app runs on `http://localhost:5173` (Vite default) and calls the Express API on `http://localhost:3000` using `fetch`. The backend only allows CORS requests from `http://localhost:5173`. The API URLs are written directly in the components.

### Authentication
1. **Sign up** – the backend validates the input, checks the email isn't already used, hashes the password and saves the user.
2. **Log in** – the backend checks the password and returns a JWT (valid for 1 hour). The frontend stores the `token` and `user` in `localStorage`.
3. Protected requests send `Authorization: Bearer <token>`, which `auth.middleware.js` verifies.
4. `ProtectedRoute.jsx` sends the user to `/login` if there is no token.

### URL shortening
1. The backend validates `longUrl`, then uses the custom alias (if it's free) or generates an 8-character code with `nanoid`.
2. The URL is saved in MongoDB, with the user's id if they are logged in. Guest links have no user id, so they don't appear in any dashboard.
3. Visiting `http://localhost:3000/<shortCode>` increases the click count, checks the expiry date and redirects to the original URL.

### Database
`config/db.js` connects to MongoDB using Mongoose and the `MONGO_URL` environment variable. There are two collections:

- **User** – `name`, `email` (unique), `password` (hashed), plus `createdAt` / `updatedAt`
- **url** – `userId` (optional), `longUrl`, `shortCode` (unique), `createdAt`, `expiryDate`, `clicks`

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | Health check, returns a simple message |
| GET | `/:shortCode` | No | Redirects to the original URL |
| POST | `/auth/signup` | No | Create a new account |
| POST | `/auth/login` | No | Log in and get a JWT |
| POST | `/url/guest/shorten` | No | Shorten a URL as a guest |
| POST | `/url/shorten` | Yes | Shorten a URL for the logged-in user |
| GET | `/url/urls` | Yes | Get all URLs of the logged-in user |
| DELETE | `/url/:id` | Yes | Delete one of the user's URLs |
| GET | `/auth-test` | Yes | Test route to check if a token works |

Example body for the shorten routes:

```json
{
  "longUrl": "https://example.com/some/very/long/path",
  "customAlias": "my-link",
  "expiryDate": "2026-12-31"
}
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URL=your_mongodb_connection_string
BASE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

- `MONGO_URL` – MongoDB connection string (local MongoDB or MongoDB Atlas)
- `BASE_URL` – used to build the `shortUrl` returned by the API. It should point to the backend, since that's where the redirect happens.
- `JWT_SECRET` – any long random string used to sign tokens

The `.env` file is ignored by git. Don't commit it.

## Running Locally

### Requirements
- Node.js (v18 or newer)
- MongoDB (local install or a MongoDB Atlas cluster)

### 1. Start the backend

```bash
src/url-shortener/backend
npm install
npm run dev
```


The server runs on `http://localhost:3000`. You should see "database connected successfullly" in the terminal if MongoDB is connected.

### 2. Start the frontend

from the project root folder (the one containing vite.config.js, index.html,and package.json);

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend must run on port 5173, because that's the only origin the backend allows through CORS.

## Known Limitations

Some things I may improve later:

- API URLs and the CORS origin are hard-coded to `localhost` instead of using environment variables.
- The frontend doesn't handle JWT expiry. After 1 hour you need to log in again.
- Visits to expired links still increase the click count.
- Guest links can't be managed after they are created.
