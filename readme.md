# Claire's Lair - Music DB 💀🎶

## Claire's Lair is a goth music database

A PERN stack web application for discovering, rating, and cataloging goth and goth-adjacent music.
## 🎯 Features

- **User Accounts**: No email required - just username and password
- **Album Ratings**: 1-5 star rating system
- **Music Catalog**: Artist bios, albums, labels, and genre tags
- **Custom Lists**: Create and share personal music collections
- **Public Profiles**: Share your ratings and lists with others

---
## Installing
```
cd backend
npm install
```
Create a .env file in the backend directory and fill in your config
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=music_db
DB_PASSWORD=your_password_here
DB_PORT=5432
JWT_SECRET=your_secret_jwt_key_here_make_it_long_and_random
PORT=5000
```
Connect to the database and run the sql schema
```
-- Connect to PostgreSQL as admin
psql -U postgres

-- Create the database
CREATE DATABASE music_db;

-- Connect 
\c music_db

-- Run DBSetup script to create all fields and tables
\i /utils/DBSetup.sql
```
---

### Backend Structure
```
ClairesLair/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── images/                    
│   │   ├── (Images not implemented yet)
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Album.js
│   │   ├── Artist.js
│   │   ├── Label.js
│   │   ├── List.js
│   │   ├── Ratings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── albums.js
│   │   ├── artists.js
│   │   ├── auth.js
|   |   ├── labels.js
│   │   ├── lists.js
│   │   └── ratings.js
│   ├── utils/
│   │   ├── DBSetup.sql
│   ├── .env
│   ├── app.js
│   └── package.json
└── frontend/
    └── (React app coming soon)
```


### 🔌 API End Points

#### ✋ Auth Routes (/api/auth)
```
POST /register - Create new user account
POST /login - User login
GET /me - Get current user info
```

#### 👥 Artist Routes (/api/artist)
```
GET / - Get all artists (with pagination/filtering)
POST / - Create new artist (admin only)
GET /:id - Get artist by ID
PUT /:id - Update artist (admin only)
GET /:id/albums - Get artist's albums
GET /- Search artists
```

#### 💿 Album Routes (/api/album)
```
GET / - Get all albums (with pagination/filtering)
POST / - Create new album (admin only)
GET /:id - Get album by ID with average rating
PUT /:id - Update album (admin only)
GET /search?q= - Search albums
```

#### ⭐ Rating Routes (/api/ratings)
```
GET /user/:userId - Get user's ratings
POST /album/:albumId - Rate an album
PUT /album/:albumId - Update rating
DELETE /album/:albumId - Remove rating
GET /album/:albumId - Get user's rating for specific album
```

#### 📓 List Routes (/api/lists)
```
GET /my-lists -Private, shows all lists created by the user
GET /public
GET /public/search
POST / - Create new list
GET /:id - Show list by ID
GET /share/:shareID - Get public lists by ID, public
PUT /:id - update list, user level
DELETE /:id - delete list by ID, user level
GET /:id/items - get items on list
POST /:id/items - add items to list
DELETE /:id/items/:itemId - Delete item from list
GET /:id/items/check - Check for duplicates
```