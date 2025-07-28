ALTER TABLE songs RENAME TO old_songs;

CREATE TABLE songs (
    song_id TEXT PRIMARY KEY,
    name TEXT,
    artist_id TEXT,
    artist_id_2 TEXT,
    artist_id_3 TEXT,
    artist_id_4 TEXT,
    release_date TEXT,
    time INTEGER,
    unreleased BOOLEAN,
    apl_plays INTEGER,
    spt_plays INTEGER,
    soundcloud_plays INTEGER,
    release_id TEXT,
    song_pic TEXT
);

INSERT INTO songs (song_id, name, artist_id, artist_id_2, artist_id_3, artist_id_4, release_date, time, unreleased, apl_plays, spt_plays, soundcloud_plays, release_id, song_pic)
SELECT song_id, name, artist_id, artist_id_2, artist_id_3, artist_id_4, release_date, time, unreleased, apl_plays, spt_plays, soundcloud_plays, release_id, song_pic FROM old_songs;

DROP TABLE old_songs;