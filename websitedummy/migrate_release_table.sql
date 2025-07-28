ALTER TABLE release RENAME TO release_old;

CREATE TABLE release (
    release_id TEXT PRIMARY KEY,
    name TEXT,
    artist_id TEXT,
    artist_id_2 TEXT,
    artist_id_3 TEXT,
    artist_id_4 TEXT,
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

-- Set new columns to NULL for existing data
UPDATE release SET artist_id_2 = NULL, artist_id_3 = NULL, artist_id_4 = NULL;

DROP TABLE release_old; 