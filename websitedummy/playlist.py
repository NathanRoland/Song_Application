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

#add playlist and delete playlist
def add_playlist(user_id, name, bio, order, pic_path):
    with Session(engine) as session:
        playlist = Playlist(user_id=user_id, name=name, bio=bio, order=order, pic_path=pic_path)
        session.add(playlist)
        session.commit()

def del_playlist(playlist_id: int):
    with Session(engine) as session:
        session.execute(delete(Playlist).where(Playlist.playlist_id == playlist_id))
        session.execute(delete(PlaylistSongs).where(PlaylistSongs.playlist_id == playlist_id))
        session.commit()

def searchForLikePlaylists(search):
    with Session(engine) as session:
        return session.execute(select(Playlist.playlist_id, Playlist.name).where(Playlist.name.like(search))).all()


def get_playlist_id(user_id:int, name:str):
    with Session(engine) as session:
        return session.execute(select(Playlist.playlist_id).where(Playlist.user_id==user_id and Playlist.name==name))

def get_playlist_user_id(playlist_id:int):
    with Session(engine) as session:
        return session.execute(select(Playlist.user_id).where(Playlist.playlist_id == playlist_id)).all()

def get_playlist_name(playlist_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist.name).where(Playlist.playlist_id == playlist_id)).all()

def update_playlist_name(playlist_id: int, name: str):
    with Session(engine) as session:
        session.execute(update(Playlist).where(Playlist.playlist_id == playlist_id).values(name=name))
        session.commit()

def get_playlist_bio(playlist_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist.bio).where(Playlist.playlist_id == playlist_id)).all()

def update_playlist_bio(playlist_id: int, bio: str):
    with Session(engine) as session:
        session.execute(update(Playlist).where(Playlist.playlist_id == playlist_id).values(bio=bio))
        session.commit()

def get_playlist_order(playlist_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist.order).where(Playlist.playlist_id == playlist_id)).all()

def update_playlist_order(playlist_id: int, order: str):
    with Session(engine) as session:
        session.execute(update(Playlist).where(Playlist.playlist_id == playlist_id).values(order=order))
        session.commit()

def get_playlist_pic_path(playlist_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist.pic_path).where(Playlist.playlist_id == playlist_id)).all()

def update_playlist_pic_path(playlist_id: int, pic_path: str):
    with Session(engine) as session:
        session.execute(update(Playlist).where(Playlist.playlist_id == playlist_id).values(pic_path=pic_path))
        session.commit()

def add_playlist_song(playlist_id, song_id, date):
    with Session(engine) as session:
        playlist_song = PlaylistSongs(playlist_id=playlist_id, song_id=song_id, date=date)
        session.add(playlist_song)
        session.commit()

def get_playlist_song_date(playlist_song_id: int):
    with Session(engine) as session:
        return session.execute(select(PlaylistSongs.date).where(PlaylistSongs.playlist_song_id == playlist_song_id)).all()

def get_playlist_song_id(playlist_id: int, song_id: int):
    with Session(engine) as session:
        return session.execute(select(PlaylistSongs.playlist_song_id).where(PlaylistSongs.playlist_id == playlist_id and PlaylistSongs.song_id == song_id)).all()
    
def get_playlist_id(playlist_song_id: int):
    with Session(engine) as session:
        return session.execute(select(PlaylistSongs.playlist_id).where(PlaylistSongs.playlist_id == playlist_song_id)).all()

def get_song_id(playlist_song_id: int):
    with Session(engine) as session:
        return session.execute(select(PlaylistSongs.song_id).where(PlaylistSongs.playlist_song_id == playlist_song_id)).all()