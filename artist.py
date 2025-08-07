from sqlalchemy import create_engine, select, delete, func, update, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from classes import *
import os
from database_manager import engine, execute_with_retry

from pathlib import Path
from datetime import datetime

# creates the database directory
Path("database").mkdir(exist_ok=True)

# initializes the database
Base.metadata.create_all(engine)

def create_artist(artist_id, username, password, bio, pfp_path, insta_link, spotify_link, apple_music_link, soundcloud_link, email, country=None, genre=None):
    with Session(engine) as session:
        artist = Artist(
            artist_id=str(artist_id),
            username=str(username),
            password=password,
            bio=bio,
            pfp_path=pfp_path,
            insta_link=insta_link,
            spotify_link=spotify_link,
            apple_music_link=apple_music_link,
            soundcloud_link=soundcloud_link,
            email=email,
            country=country,
            genre=genre
        )
        session.add(artist)
        create_artist_from_user(str(artist_id), str(username), "password", "email")
        session.commit()

def searchForLikeArtists(search):
    with Session(engine) as session:
        #session.execute(text("ALTER TABLE artists RENAME COLUMN user_id TO artist_id;"))
        return session.execute(select(Artist.artist_id, Artist.username).where(Artist.username.like(search))).all()

def retrive_artist_info(artist_id):
    with Session(engine) as session:
        return session.execute(select(Artist.artist_id, Artist.username, Artist.bio, Artist.insta_link, Artist.spotify_link, Artist.apple_music_link, Artist.soundcloud_link, Artist.country, Artist.genre).where(Artist.artist_id == artist_id)).all()

def get_artist_id(username: str):
    with Session(engine) as session:
        return session.execute(select(Artist.artist_id).where(Artist.username==username)).all()

def get_artist_name(artist_id: str):
    with Session(engine) as session:
        return session.execute(select(Artist.username).where(Artist.artist_id == artist_id)).all()

def get_password(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.password).where(Artist.artist_id == user_id)).all()

def set_password(user_id: int, password: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(password=password))
        session.commit()

def get_bio(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.bio).where(Artist.artist_id == user_id)).all()

def set_bio(user_id: int, bio: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(bio=bio))
        session.commit()

def get_pfp_path(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.pfp_path).where(Artist.artist_id == user_id)).all()

def set_pfp_path(user_id: int, pfp_path: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(pfp_path=pfp_path))
        session.commit()

def get_insta_link(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.insta_link).where(Artist.artist_id == user_id)).all()

def set_insta_link(user_id: int, insta_link: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(insta_link=insta_link))
        session.commit()

def get_spotify_link(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.spotify_link).where(Artist.artist_id == user_id)).all()

def set_spotify_link(user_id: int, spotify_link: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(spotify_link=spotify_link))
        session.commit()

def get_apple_music_link(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.apple_music_link).where(Artist.user_id == user_id)).all()

def set_apple_music_link(user_id: int, apple_music_link: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(apple_music_link=apple_music_link))
        session.commit()

def get_soundcloud_link(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.soundcloud_link).where(Artist.artist_id == user_id)).all()

def set_soundcloud_link(user_id: int, soundcloud_link: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(soundcloud_link=soundcloud_link))
        session.commit()

def get_email(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Artist.email).where(Artist.artist_id == user_id)).all()

def set_email(user_id: int, email: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == user_id).values(email=email))
        session.commit()

def get_genre(artist_id: str):
    with Session(engine) as session:
        return session.execute(select(Artist.genre).where(Artist.artist_id == artist_id)).all()

def set_genre(artist_id: str, genre: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == artist_id).values(genre=genre))
        session.commit()

def get_country(artist_id: str):
    with Session(engine) as session:
        return session.execute(select(Artist.country).where(Artist.artist_id == artist_id)).all()

def set_country(artist_id: str, country: str):
    with Session(engine) as session:
        session.execute(update(Artist).where(Artist.artist_id == artist_id).values(country=country))
        session.commit()

def convert_artists_to_users():
    with Session(engine) as session:
        all_rows = session.execute(select(Artist.artist_id, Artist.username, Artist.password, Artist.email)).all()
        for row in all_rows:
            artist_id = row[0]
            username = row[1]
            password = str(row[2])
            email = str(row[3])
            print(artist_id, username, password, email)
            try:
                #print(artist_id, username, password, email)
                create_artist_from_user(artist_id, username, password, email)
            except:
                print(f"Error converting artist {artist_id} to user")