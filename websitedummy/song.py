from sqlalchemy import create_engine, select, delete, func, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from classes import *

from pathlib import Path

# creates the database directory
Path("database").mkdir(exist_ok=True)

# "database/main.db" specifies the database file
# change it if you wish
# turn echo = True to display the sql output
engine = create_engine("sqlite:///database/main.db", echo=False)

# initializes the database
Base.metadata.create_all(engine)

#songs

def create_song(song_id, name, artist_id, artist_id_2, artist_id_3, artist_id_4, release_date, time, unreleased, apl_plays, spt_plays, soundcloud_plays, release_id, song_pic):
    with Session(engine) as session:
        song = Song(song_id=song_id, name=name, artist_id=artist_id, artist_id_2=artist_id_2, artist_id_3=artist_id_3, artist_id_4=artist_id_4, release_date=release_date, time=time, unreleased=unreleased, apl_plays=apl_plays, spt_plays=spt_plays, soundcloud_plays=soundcloud_plays, release_id=release_id, song_pic=song_pic)
        session.add(song)
        session.commit()

def get_song_info_from_release(release_id: str):
    with Session(engine) as session:
        return session.execute(select(Song.song_id, Song.name, Song.artist_id, Song.artist_id_2, Song.artist_id_3, Song.artist_id_4, Song.release_date, Song.time, Song.unreleased, Song.apl_plays, Song.spt_plays, Song.soundcloud_plays, Song.release_id, Song.song_pic).where(Song.release_id == release_id)).all()

def searchForLikeSongs(search):
    with Session(engine) as session:
        return session.execute(select(Song.song_id).where(Song.name.like(f"%{search}%"))).all()

def get_song_info(song_id: str):
    with Session(engine) as session:
        return session.execute(select(Song.song_id, Song.name, Song.artist_id, Song.artist_id_2, Song.artist_id_3, Song.artist_id_4, Song.release_date, Song.time, Song.unreleased, Song.apl_plays, Song.spt_plays, Song.soundcloud_plays, Song.release_id, Song.song_pic).where(Song.song_id == song_id)).all()

def get_artists_songs(artist_id: str):
    with Session(engine) as session:
        return session.execute(select(Song.song_id).where(Song.artist_id== artist_id)).all()

def get_song_id(name: str):
    with Session(engine) as session:
        return session.execute(select(Song.song_id).where(Song.name == name)).all()

def get_song_name(song_id: str):
    with Session(engine) as session:
        return session.execute(select(Song.name).where(Song.song_id == song_id)).all()

def get_artist_id(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.artist_id).where(Song.song_id == song_id)).all()

def get_release_date(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.release_date).where(Song.song_id == song_id)).all()

def get_time(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.time).where(Song.song_id == song_id)).all()

def get_unreleased(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.unreleased).where(Song.song_id == song_id)).all()

def get_apl_plays(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.apl_plays).where(Song.song_id == song_id)).all()

def get_spt_plays(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.spt_plays).where(Song.song_id == song_id)).all()

def get_soundcloud_plays(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.soundcloud_plays).where(Song.song_id == song_id)).all()

def get_release_id(song_id: str):
    with Session(engine) as session:
        return session.execute(select(Song.release_id).where(Song.song_id == song_id)).all()

def get_song_pic(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.song_pic).where(Song.song_id == song_id)).all()

def set_name(song_id: int, name: str):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(name=name))
        session.commit()

def set_artist_id(song_id: int, artist_id: int):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(artist_id=artist_id))
        session.commit()

def set_release_date(song_id: int, release_date: str):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(release_date=release_date))
        session.commit()

def set_time(song_id: int, time: int):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(time=time))
        session.commit()

def set_unreleased(song_id: int, unreleased: bool):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(unreleased=unreleased))
        session.commit()

def set_apl_plays(song_id: int, apl_plays: int):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(apl_plays=apl_plays))
        session.commit()

def set_spt_plays(song_id: int, spt_plays: int):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(spt_plays=spt_plays))
        session.commit()

def set_soundcloud_plays(song_id: int, soundcloud_plays: int):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(soundcloud_plays=soundcloud_plays))
        session.commit()

def set_release_id(song_id: int, release_id: str):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(release_id=release_id))
        session.commit()

def set_song_pic(song_id: str, song_pic: str):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(song_pic=song_pic))
        session.commit()

#releases

def create_release(release_id, name, artist_id, artist_id_2, artist_id_3, artist_id_4, release_date, time, unreleased, is_album, is_EP, is_Song, release_pic):
    with Session(engine) as session:
        release = Release(release_id=release_id, name=name, artist_id=artist_id, artist_id_2=artist_id_2, artist_id_3=artist_id_3, artist_id_4=artist_id_4, release_date=release_date, time=time, unreleased=unreleased, is_album=is_album, is_EP=is_EP, is_Song=is_Song, release_pic=release_pic)
        session.add(release)
        session.commit()

def get_release_info(release_id: str):
    with Session(engine) as session:
        return session.execute(select(Release.release_id, Release.name, Release.artist_id, Release.artist_id_2, Release.artist_id_3, Release.artist_id_4, Release.release_date, Release.time, Release.unreleased, Release.is_album, Release.is_EP, Release.is_Song, Release.release_pic).where(Release.release_id == release_id)).all()

def get_release_info_from_artist(artist_id: str):
    print(f"Searching for releases with artist_id: {artist_id}")
    with Session(engine) as session:  
        result = session.execute(
            select(Release.release_id).where(Release.artist_id == artist_id)
        ).all()
        result += session.execute(
            select(Release.release_id).where(Release.artist_id_2 == artist_id)
        ).all()
        result += session.execute(
            select(Release.release_id).where(Release.artist_id_3 == artist_id)
        ).all()
        result += session.execute(
            select(Release.release_id).where(Release.artist_id_4 == artist_id)
        ).all()
        
        return result

def searchForLikeReleases(search):
    with Session(engine) as session:
        return session.execute(select(Release.release_id).where(Release.name.like(f"%{search}%"))).all()


def get_artists_releasess(artist_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.release_id).where(Release.artist_id== artist_id)).all()

def get_release_name(release_id: str):
    with Session(engine) as session:
        return session.execute(select(Release.name).where(Release.release_id == release_id)).all()

def check_song_exists(song_id: int):
    with Session(engine) as session:
        return session.execute(select(Song.song_id).where(Song.song_id == song_id)).all()

def check_release_exists(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.release_id).where(Release.release_id == release_id)).all()

def get_artist_id(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.artist_id).where(Release.release_id == release_id)).all()

def get_release_date(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.release_date).where(Release.release_id == release_id)).all()

def get_time(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.time).where(Release.release_id == release_id)).all()

def get_unreleased(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.unreleased).where(Release.release_id == release_id)).all()

def get_is_album(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.is_album).where(Release.release_id == release_id)).all()

def get_is_EP(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.is_EP).where(Release.release_id == release_id)).all()

def get_is_Song(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.is_Song).where(Release.release_id == release_id)).all()

def get_release_pic(release_id: str):
    with Session(engine) as session:
        return session.execute(select(Release.release_pic).where(Release.release_id == release_id)).all()

def set_name(release_id: int, name: str):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(name=name))
        session.commit()

def set_artist_id(release_id: int, artist_id: int):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(artist_id=artist_id))
        session.commit()

def set_release_date(release_id: int, release_date: str):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(release_date=release_date))
        session.commit()

def set_time(release_id: int, time: int):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(time=time))
        session.commit()

def set_unreleased(release_id: int, unreleased: bool):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(unreleased=unreleased))
        session.commit()

def set_is_album(release_id: int, is_album: bool):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(is_album=is_album))
        session.commit()

def set_is_EP(release_id: int, is_EP: bool):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(is_EP=is_EP))
        session.commit()

def set_is_Song(release_id: int, is_Song: bool):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(is_Song=is_Song))
        session.commit()

def set_release_pic(release_id: str, release_pic: str):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(release_pic=release_pic))
        session.commit()

def find_cover_art_for_release():
    with Session(engine) as session:    
        all_rows = session.execute(select(Release.release_id, Release.release_pic)).all()
        return all_rows

def find_cover_art_for_song():
    with Session(engine) as session:
        all_rows = session.execute(select(Song.song_id, Song.song_pic)).all()
        return all_rows

