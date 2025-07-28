ALTER TABLE artists RENAME TO artists_old;

CREATE TABLE artists (
    artist_id TEXT PRIMARY KEY,
    username TEXT,
    password TEXT,
    bio TEXT,
    pfp_path TEXT,
    insta_link TEXT,
    spotify_link TEXT,
    apple_music_link TEXT,
    soundcloud_link TEXT,
    email TEXT,
    country TEXT,
    genre TEXT
);

INSERT INTO artists (artist_id, username, password, bio, pfp_path, insta_link, spotify_link, apple_music_link, soundcloud_link, email)
SELECT CAST(artist_id AS TEXT), username, password, bio, pfp_path, insta_link, spotify_link, apple_music_link, soundcloud_link, email
FROM artists_old;

DROP TABLE artists_old; 

ALTER TABLE artists ADD COLUMN country TEXT;
ALTER TABLE artists ADD COLUMN genre TEXT; 

ALTER TABLE release RENAME TO release_old;

CREATE TABLE release (
    release_id TEXT PRIMARY KEY,
    name TEXT,
    artist_id TEXT,
    release_date TEXT,
    time INTEGER,
    unreleased BOOLEAN,
    is_album BOOLEAN,
    is_EP BOOLEAN,
    is_Song BOOLEAN,
    release_pic TEXT
);

INSERT INTO release (release_id, name, artist_id, release_date, time, unreleased, is_album, is_EP, is_Song, release_pic)
SELECT CAST(release_id AS TEXT), name, CAST(artist_id AS TEXT), release_date, time, unreleased, is_album, is_EP, is_Song, release_pic
FROM release_old;

DROP TABLE release_old; 