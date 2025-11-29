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
run dev and check the back end to ensure the server is running
```
npm run dev

curl http://localhost:5000/api/health
```
---

### 💾 Backend Structure
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
│   │   ├── Tracks.js
│   │   └── User.js
│   ├── routes/
│   │   ├── albums.js
│   │   ├── artists.js
│   │   ├── auth.js
|   |   ├── labels.js
│   │   ├── lists.js
│   │   ├── ratings.js
│   │   └── tracks.js
│   ├── utils/
│   │   ├── DBSetup.sql
│   ├── .env
│   ├── app.js
│   └── package.json
└── frontend/
    └── (React app coming soon)
```


### 🔌 API End Points

List of all endpoints for the backend API. Testing implementation forthcoming. 
---

#### ✋ Auth Routes (/api/auth)
```
POST /register - Create new user account
POST /login - User login
GET /me - Get current user info
```


#### 👥 Artist Routes (/api/artist)
```
GET / - Get all artists, public
GET /search - Search for artist, public
GET /:id/with-albums - Get all albums for an artist ID, public
GET /:id  - Get specific artist by ID
POST /  - Create artist, admin only
PUT /:id - Update artist by ID, admiin only
DELETE /:id - delete artist by ID, admin only
```

#### 💿 Album Routes (/api/album)
```
GET / - Get all albums, public
GET /artist/:artistId - get all albums by artistId, public
GET /:id/with-tracks - returns all tracks on an album
GET /search?q= - Search albums, public
GET /:id - Get albumID, public
POST / - create album, admin only
PUT /:id - update album, admiin only
DELETE /:id - delete album, admin only
```

#### 🎵 Track Routes (/api/tracks)
```
GET /:id - Get track by ID
GET /albums/:albumId - Get album the track is on
GET /artists/:artistId - Get tracks by artist
POST / - Create new track, admin only
PUT /:id - update track, admin only
DELETE /:id  - delete track, admin onlu
```

#### 🏷️ Label Routes (/api/label)
```
GET / - list all labels, public
GET /search - Search, public
GET /:id - Get all artists/albums for a given label ID
GET /:id/artists - Get artists for given label ID, public
GET /:id/albums - Get albums for a given label ID, public
POST / - create label, admin
PUT /:id - update label, admin 
DELETE /:id - Delete label, admin
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
GET /my-lists - shows all lists created by the user, user
GET /public - Shows public lists, public
GET /public/search - Search public lists, public
POST / - Create new list, user
GET /:id - Show list by ID, user
GET /share/:shareID - Get public lists by ID, public
PUT /:id - update list by ID, user
DELETE /:id - Delete list by ID, user
GET /:id/items - get items on list by ID
POST /:id/items - add items to list, user
DELETE /:id/items/:itemId - Delete item from list, user
GET /:id/items/check - Check for duplicates, user
```