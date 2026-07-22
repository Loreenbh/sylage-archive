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

-- FOLLOW
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(follower_id, following_id),
    CHECK (follower_id <> following_id)
);

--SILHOUETTES
CREATE TABLE silhouettes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moodboard_id INTEGER NOT NULL REFERENCES moodboards(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


--LIKES
CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moodboard_id INTEGER REFERENCES moodboards(id) ON DELETE CASCADE,
    silhouette_id INTEGER REFERENCES silhouettes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (
        (moodboard_id IS NOT NULL AND silhouette_id IS NULL)
        OR
        (moodboard_id IS NULL AND silhouette_id IS NOT NULL)
    )
);

CREATE UNIQUE INDEX unique_user_moodboard_like
ON likes(user_id, moodboard_id)
WHERE moodboard_id IS NOT NULL;

CREATE UNIQUE INDEX unique_user_silhouette_like
ON likes(user_id, silhouette_id)
WHERE silhouette_id IS NOT NULL;