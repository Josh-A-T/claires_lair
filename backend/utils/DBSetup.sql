-- Claries (music) Lair DB Setup
-- Run this script in PSQL or pgAdmin to create all tables
-- Setup for Users, Labels, Artists, Albums, Artist social media links, Artist Genre, Ratings, user generated Lists, and List items

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    founded_year INTEGER,
    country VARCHAR(100),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    location VARCHAR(255),
    formed_year INTEGER,
    label_id INTEGER REFERENCES labels(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER REFERENCES artists(id),
    release_year INTEGER,
    label VARCHAR(255),
    label_id INTEGER REFERENCES labels(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artist_links (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artist_genres (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    genre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    album_id INTEGER REFERENCES albums(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, album_id)
);

CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    share_id UUID UNIQUE DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(id),
    item_type VARCHAR(20) CHECK (item_type IN ('artist', 'album')),
    artist_id INTEGER REFERENCES artists(id),
    album_id INTEGER REFERENCES albums(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (item_type = 'artist' AND artist_id IS NOT NULL AND album_id IS NULL) OR
        (item_type = 'album' AND album_id IS NOT NULL AND artist_id IS NULL)
    )
);

CREATE INDEX idx_artists_name ON artists(name);
CREATE INDEX idx_albums_title ON albums(title);
CREATE INDEX idx_labels_name ON labels(name);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_album_id ON ratings(album_id);
CREATE INDEX idx_artist_genres_genre ON artist_genres(genre);
CREATE INDEX idx_lists_user_id ON lists(user_id);
CREATE INDEX idx_lists_share_id ON lists(share_id);
CREATE INDEX idx_lists_is_public ON lists(is_public);
CREATE INDEX idx_list_items_list_id ON list_items(list_id);
CREATE INDEX idx_list_items_type ON list_items(item_type);

SELECT 'Database setup completed successfully!' as message;