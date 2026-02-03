-- =========================
-- DATABASE
-- =========================
CREATE DATABASE music_player;
USE music_player;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SONGS TABLE
-- =========================
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100),
    audio_url VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    play_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- LIKES TABLE ❤️
-- (One user can like a song only once)
-- =========================
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, song_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- =========================
-- PLAY HISTORY TABLE 🎧
-- (Every play is stored)
-- =========================
CREATE TABLE play_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    song_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- =========================
-- INDEXES (Performance boost)
-- =========================
CREATE INDEX idx_song_play_count ON songs(play_count);
CREATE INDEX idx_likes_song ON likes(song_id);
CREATE INDEX idx_play_history_song ON play_history(song_id);
