--USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

--MOODBOARD
CREATE TABLE moodboards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    image_url TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    CONSTRAINT tags_between_3_and_7 CHECK (cardinality(tags) BETWEEN 3 AND 7)
);

-- SESSIONS
CREATE TABLE sessions(
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL
);