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


### Backend Structure
```
ClairesLair/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── artistController.js
│   │   ├── albumController.js
│   │   ├── ratingController.js
│   │   └── listController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── artists.js
│   │   ├── albums.js
│   │   ├── ratings.js
│   │   └── lists.js
│   ├── app.js
│   └── package.json
│   ├── images/                    
│   │   ├── artists/
│   │   │   ├── images/
│   │   │   └── banners/
│   │   ├── albums/
│   │   │   ├── covers/
│   │   │   └── backs/
└── frontend/
    └── (React app coming soon)
```


### 🔌 API End Points

#### Auth Routes (/api/auth)
```
POST /register - Create new user account
POST /login - User login
GET /me - Get current user info
PUT /profile - Update user profile
```

#### Artist Routes (/api/artist)
```
GET / - Get all artists (with pagination/filtering)
POST / - Create new artist (admin only)
GET /:id - Get artist by ID
PUT /:id - Update artist (admin only)
GET /:id/albums - Get artist's albums
GET /search?q= - Search artists
```

#### Album Routes (/api/album)
```
GET / - Get all albums (with pagination/filtering)
POST / - Create new album (admin only)
GET /:id - Get album by ID with average rating
PUT /:id - Update album (admin only)
GET /search?q= - Search albums
```

#### Rating Routes (/api/ratings)
```
GET /user/:userId - Get user's ratings
POST /album/:albumId - Rate an album
PUT /album/:albumId - Update rating
DELETE /album/:albumId - Remove rating
GET /album/:albumId - Get user's rating for specific album
```

#### List Routes (/api/lists)
```
GET / - Get public lists
GET /user/:userId - Get user's lists
POST / - Create new list
GET /:slug - Get list by slug
PUT /:id - Update list
DELETE /:id - Delete list
POST /:id/items - Add item to list
DELETE /:id/items/:itemId - Remove item from list
```
