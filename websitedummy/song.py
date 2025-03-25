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

def createSong(name, artist_id, release_date, time, unreleased, apl_plays, spt_plays, soundcloud_plays, release_id, song_pic):
    with Session(engine) as session:
        song = Song(name=name, artist_id=artist_id, release_date=release_date, time=time, unreleased=unreleased, apl_plays=apl_plays, spt_plays=spt_plays, soundcloud_plays=soundcloud_plays, release_id=release_id, song_pic=song_pic)
        session.add(song)
        session.commit()

def get_song_id(name: str):
    with Session(engine) as session:
        return session.execute(select(Song.song_id).where(Song.name == name)).all()

def get_name(song_id: int):
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

def get_release_id(song_id: int):
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

def set_song_pic(song_id: int, song_pic: str):
    with Session(engine) as session:
        session.execute(update(Song).where(Song.song_id == song_id).values(song_pic=song_pic))
        session.commit()

#releases

def create_release(name, artist_id, release_date, time, unreleased, is_album, is_EP, is_Song, release_pic):
    with Session(engine) as session:
        release = Release(name=name, artist_id=artist_id, release_date=release_date, time=time, unreleased=unreleased, is_album=is_album, is_EP=is_EP, is_Song=is_Song, release_pic=release_pic)
        session.add(release)
        session.commit()

def get_name(release_id: int):
    with Session(engine) as session:
        return session.execute(select(Release.name).where(Release.release_id == release_id)).all()

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

def get_release_pic(release_id: int):
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

def set_release_pic(release_id: int, release_pic: str):
    with Session(engine) as session:
        session.execute(update(Release).where(Release.release_id == release_id).values(release_pic=release_pic))
        session.commit()