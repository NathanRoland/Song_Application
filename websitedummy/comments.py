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

#class Song_Comments(Base):

def create_song_comment(song_id, user_id, comment_text, time, parent_comment_id):
    with Session(engine) as session:
        song_comment = Song_Comments(song_id=song_id, user_id=user_id, comment_text=comment_text, time=time, parent_comment_id=parent_comment_id)
        session.add(song_comment)
        session.commit()

def delete_song_comment(comment_id: int):
    with Session(engine) as session:
        session.execute(update(Song_Comments).where(comment_id==comment_id).values(comment_text = "This comment has been deleted"))
        session.execute()

#unfinished function (get comment_id)

def get_comment_id(song_id, user_id, time):
     with Session(engine) as session:
          return session.execute(select(Song_Comments.comment_id).where(Song_Comments.song_id==song_id and Song_Comments.user_id==user_id and Song_Comments.time==time)).all()

def get_song_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Song_Comments.song_id).where(Song_Comments.comment_id == comment_id)).all()

def get_user_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Song_Comments.user_id).where(Song_Comments.comment_id == comment_id)).all()

def get_comment_text(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Song_Comments.comment_text).where(Song_Comments.comment_id == comment_id)).all()

def get_time(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Song_Comments.time).where(Song_Comments.comment_id == comment_id)).all()

def get_parent_comment_id(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Song_Comments.parent_comment_id).where(Song_Comments.comment_id == comment_id)).all()


#class Release_Comments(Base):

def create_release_comment(release_id, user_id, comment_text, time, parent_comment_id):
    with Session(engine) as session:
        release_comment = Release_Comments(release_id=release_id, user_id=user_id, comment_text=comment_text, time=time, parent_comment_id=parent_comment_id)
        session.add(release_comment)
        session.commit()

def delete_release_comment(comment_id: int):
    with Session(engine) as session:
        session.execute(update(Release_Comments).where(comment_id==comment_id).values(comment_text = "This comment has been deleted"))
        session.execute()

#unfinished function (get comment_id)

def get_comment_id(release_id, user_id, time):
     with Session(engine) as session:
          return session.execute(select(Release_Comments.comment_id).where(Release_Comments.release_id==release_id and Release_Comments.user_id==user_id and Release_Comments.time==time)).all()


def release_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Release_Comments.release_id).where(Release_Comments.comment_id == comment_id)).all()

def get_user_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Release_Comments.user_id).where(Release_Comments.comment_id == comment_id)).all()

def get_comment_text(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Release_Comments.comment_text).where(Release_Comments.comment_id == comment_id)).all()

def get_time(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Release_Comments.time).where(Release_Comments.comment_id == comment_id)).all()

def get_parent_comment_id(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Release_Comments.parent_comment_id).where(Release_Comments.comment_id == comment_id)).all()


#class Playlist_Comments(Base):

def create_playlist_comment(playlist_song_id, user_id, comment_text, time, parent_comment_id):
    with Session(engine) as session:
        release_comment = Release_Comments(playlist_song_id=playlist_song_id, user_id=user_id, comment_text=comment_text, time=time, parent_comment_id=parent_comment_id)
        session.add(release_comment)
        session.commit()


def delete_playlist_comment(comment_id: int):
    with Session(engine) as session:
        session.execute(update(Playlist_Comments).where(comment_id==comment_id).values(comment_text = "This comment has been deleted"))
        session.execute()

#unfinished function (get comment_id)
def get_comment_id(playlist_id, user_id, time):
     with Session(engine) as session:
          return session.execute(select(Playlist_Comments.comment_id).where(Playlist_Comments.playlist_id==playlist_id and Playlist_Comments.user_id==user_id and Playlist_Comments.time==time)).all()


def playlist_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Playlist_Comments.playlist_id).where(Playlist_Comments.comment_id == comment_id)).all()

def get_user_id(comment_id: int):
        with Session(engine) as session:
            return session.execute(select(Playlist_Comments.user_id).where(Playlist_Comments.comment_id == comment_id)).all()

def get_comment_text(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist_Comments.comment_text).where(Playlist_Comments.comment_id == comment_id)).all()

def get_time(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist_Comments.time).where(Playlist_Comments.comment_id == comment_id)).all()

def get_parent_comment_id(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(Playlist_Comments.parent_comment_id).where(Playlist_Comments.comment_id == comment_id)).all()
