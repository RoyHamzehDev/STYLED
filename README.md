# STYLED: Smart Wardrobe Web App

STYLED is a smart wardrobe web app that helps you know what you own, wear more of it, and get dressed faster. Upload photos of your clothes, organise them by category, style, colour and season, mix and match outfits, and save your favourite combinations.

It is a full-stack rebuild of **Styld**, an Android app I originally built for a previous university project, redesigned for the web with React, TypeScript and NestJS for **CSIS 279: Advances in Computer Science** at the University of Balamand.

**Live demo:** https://styled-client.onrender.com

> The demo runs on free hosting, so the server sleeps when idle. The first request may take up to a minute to wake it up.
>
> The live demo runs the earlier Express version of the API, which exposes identical endpoints. This repository contains the NestJS version.

**Demo account:** `TODO: email` / `TODO: password` (or register your own account)

---

## Features

- **Authentication:** register and log in with hashed passwords (bcrypt) and JWT sessions.
- **Digital wardrobe:** add clothing items with a photo, category, styles, colours and seasons.
- **Image upload:** drag-and-drop upload to Cloudinary, validated by type (JPEG, PNG, WEBP) and size (5 MB max).
- **Filters and search:** filter by category, colour and season, and search by name (filters stay in the URL).
- **Outfit builder:** pick one item per category, with smart rules (a dress replaces a top and bottom, multiple accessories allowed).
- **Surprise Me:** generates a random outfit from your wardrobe, optionally for a given season.
- **Saved outfits:** save, rename, edit items, favourite (optimistic UI) and delete outfits.
- **Profile:** edit your name, preferred styles and favourite colours.
- **Security:** every user only ever sees and edits their own data; passwords and secrets never reach the browser.
- **Responsive design:** works on phones, tablets and desktops.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, lucide-react |
| **Backend** | NestJS (modules, controllers, services), TypeScript, JWT, bcrypt, Multer |
| **Validation** | Zod schemas shared between frontend and backend |
| **Database** | PostgreSQL (Neon) with Prisma ORM 7 |
| **File storage** | Cloudinary |
| **Tooling** | npm workspaces (monorepo), Git and GitHub |
| **Hosting** | Render (API and static site) |

---

## Architecture

The project is an **npm workspaces monorepo** with three packages:

```
styled/
├── client/   React frontend (runs in the browser)
├── server/   NestJS REST API (auth, database, uploads)
└── shared/   @styled/shared: Zod schemas and types used by both
```

- **client** displays the data and handles the user interface. It never holds secrets.
- **server** handles everything that must be trusted: passwords, tokens, database queries, ownership checks and uploads.
- **shared** contains the DTOs (Zod schemas). The same rules validate forms in the browser and requests on the server, so they can never drift apart.

### Backend structure (NestJS)

```
server/src/
├── main.ts              app bootstrap: CORS, body parsing, global filter, port
├── app.module.ts        root module importing every feature module
├── config/              fail-fast environment variable validation
├── prisma/              global PrismaService (database client)
├── common/              ZodValidationPipe, ParseIdPipe, global exception filter
├── health/              health and database checks
├── auth/                register, login, profile, JwtAuthGuard, @UserId() decorator
├── items/               wardrobe CRUD, filters and search
├── uploads/             image upload to Cloudinary
└── outfits/             outfit CRUD, favourites, transactions, Surprise Me
```

Each feature module has a **controller** (HTTP only) and a **service** (business logic and database access). A request flows through:

```
middleware → guard (JWT) → interceptor (file upload) → pipes (validation) → controller → service
```

with a global exception filter turning every error into a consistent JSON response.

### Database

```
User ──< ClothingItem
User ──< Outfit
Outfit >──< ClothingItem   (explicit join table OutfitClothingItem, composite key)
Outfit ──< Feedback
User ──< Feedback
```

Enums (`Category`, `Style`, `Color`, `Season`) keep the data clean, and `onDelete: Cascade` keeps it consistent when a user, item or outfit is deleted.

---

## API Endpoints

All routes except register, login and health require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the logged-in user |
| PATCH | `/api/auth/me` | Update name, preferred styles and favourite colours |
| POST | `/api/uploads/image` | Upload an image (multipart, field `image`) |
| GET | `/api/items` | List items (`?category`, `style`, `color`, `season`, `search`) |
| POST | `/api/items` | Create an item |
| GET | `/api/items/:id` | Get one item |
| PATCH | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/outfits` | List outfits with their items |
| POST | `/api/outfits` | Create an outfit |
| GET | `/api/outfits/surprise` | Random outfit suggestion (`?season`) |
| GET | `/api/outfits/:id` | Get one outfit |
| PATCH | `/api/outfits/:id` | Update an outfit (name, occasion, items, favourite) |
| DELETE | `/api/outfits/:id` | Delete an outfit |

Errors use consistent status codes: `400` validation, `401` authentication, `404` not found (also for other users' resources), `409` conflict, `500` server error.

---

## Running Locally

### Prerequisites

- Node.js 24 (20.19 or newer)
- A PostgreSQL database (for example a free [Neon](https://neon.com) project)
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone and install

```bash
git clone https://github.com/RoyHamzehDev/styled.git
cd styled
npm install
```

One install at the root covers all three packages. It also generates the Prisma client.

### 2. Environment variables

Create `server/.env`:

```env
PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET=a-long-random-string
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
# Optional: restrict CORS to the frontend's URL in production
# CLIENT_URL=https://your-frontend.example.com
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

### 3. Create the database tables

```bash
cd server
npx prisma migrate deploy
cd ..
```

### 4. Start the app

In two terminals, from the root:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

Open http://localhost:5173.

---

## Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- JWTs are signed with a server-side secret and expire after 7 days.
- Every query is scoped to the logged-in user; other users' resources return `404` without revealing that they exist.
- All input is validated with Zod; route ids are validated before reaching the database.
- Secrets live only in environment variables and are never committed.
- In production, CORS only allows the deployed frontend.

---

## Next Steps

- **AI outfit generator:** describe a mood or occasion and get an outfit chosen from your own wardrobe, with every AI suggestion validated against the database.
- **AI feedback loop:** rate suggestions to build a preference profile that improves future outfits (the `Feedback` table and user style preferences are already in the schema).
- Shareable outfit links, wardrobe insights dashboard, background removal for clothing photos, dark theme.

---

## Author

**Roy Hamzeh**, University of Balamand ([@RoyHamzehDev](https://github.com/RoyHamzehDev))
