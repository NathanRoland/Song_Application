from itertools import count
from sqlalchemy import create_engine, select, delete, func, update, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from sqlalchemy.sql.functions import user
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

def drop_user_tables():
    with Session(engine) as session:
        session.execute(text('DROP TABLE IF EXISTS users'))
        session.commit()

def get_user_non_artist(user_id: str):
    with Session(engine) as session:
        return session.execute(select(User.username, User.bio, User.pfp_path, User.fav_artist, User.fav_song, User.insta_link, User.spotify_link, User.apple_music_link, User.soundcloud_link).where(User.user_id == user_id)).all()

def get_user_artist(user_id: str):
    with Session(engine) as session:
        return session.execute(select(User.username, User.bio, User.pfp_path, User.insta_link, User.spotify_link, User.apple_music_link, User.soundcloud_link).where(User.user_id == user_id)).all()

def searchForLikeUsers(search):
    with Session(engine) as session:
        return session.execute(select(User.user_id, User.username).where(User.username.like(search))).all()

def check_if_artist(user_id: str):
    with Session(engine) as session:
        return session.execute(select(User.isArtist).where(User.user_id == user_id)).all()

def get_user(username: str):
    with Session(engine) as session:
        return session.get(User, username)

def create_artist_from_user(artist_id, artist_name, password, email):
    with Session(engine) as session:
        user = User(user_id = artist_id, username=artist_name, password=password, email=email, isArtist=True)
        session.add(user)
        session.commit()

def createUser(username, password, email):
    with Session(engine) as session:
        if (get_user(username)):
            print("Username already in database")
        else:
            num = getUsersAmount()
            user = User(user_id = str(num), username=username, password=password, email=email)
            session.add(user)
            session.commit()
            return True
    return False

def getUsersAmount():
    with Session(engine) as session:
        result = session.execute(select(func.count(User.user_id))).scalar_one()
        return result
def get_user_id_by_username(username: str) -> str:
    with Session(engine) as session:
        user = session.query(User).filter(User.username == username).first()
        if user:
            print("found")
            return user.user_id
        else:
            raise ValueError("User not found")

def change_username(old_username:str, new_username: str):
    with Session(engine) as session:
        if (get_user(new_username)):
            print("Username already in database")
        else:
            session.execute(update(User).where(User.username == old_username).values(username = new_username))
            session.commit()
            return True
        return False

def get_username(user_id: str):
    with Session(engine) as session:
        return session.execute(select(User.username).where(User.user_id == user_id)).all()

def get_user_password(username: str):
    with Session(engine) as session:
        return session.execute(select(User.password).where(User.username==username)).all()
    
def get_user_pfp(username: str):
    with Session(engine) as session:
        return session.execute(select(User.pfp_path).where(User.username==username)).all()

def set_pfp(username: str, pfp_path: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(pfp_path = pfp_path))
        session.commit()

def get_user_bio(username:str):
    with Session(engine) as session:
        return session.execute(select(User.bio).where(User.username==username)).all()
    
def change_bio(username: str, bio: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(bio = bio))
        session.commit()

def get_fav_artist(username:str):
    with Session(engine) as session:
        return session.execute(select(User.fav_artist).where(User.username==username)).all()
    
def update_fav_artist(username: str, fav_artist: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(fav_artist = fav_artist))
        session.commit()

def get_fav_song(username:str):
    with Session(engine) as session:
        return session.execute(select(User.fav_song).where(User.username==username)).all()
    
def update_fav_song(username: str, fav_song: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(fav_song = fav_song))
        session.commit()

def get_insta_link(username: str):
    with Session(engine) as session:
        return session.execute(select(User.insta_link).where(User.username == username)).all()

def change_insta_link(username: str, insta_link: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(insta_link=insta_link))
        session.commit()

def get_spotify_link(username: str):
    with Session(engine) as session:
        return session.execute(select(User.spotify_link).where(User.username == username)).all()

def change_spotify_link(username: str, spotify_link: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(spotify_link=spotify_link))
        session.commit()

def get_apple_music_link(username: str):
    with Session(engine) as session:
        return session.execute(select(User.apple_music_link).where(User.username == username)).all()

def change_apple_music_link(username: str, apple_music_link: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(apple_music_link=apple_music_link))
        session.commit()

def get_soundcloud_link(username: str):
    with Session(engine) as session:
        return session.execute(select(User.soundcloud_link).where(User.username == username)).all()

def change_soundcloud_link(username: str, soundcloud_link: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(soundcloud_link=soundcloud_link))
        session.commit()

def get_address(username: str):
    with Session(engine) as session:
        return session.execute(select(User.address).where(User.username == username)).all()

def change_address(username: str, address: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(address=address))
        session.commit()

def get_suburb(username: str):
    with Session(engine) as session:
        return session.execute(select(User.suburb).where(User.username == username)).all()

def change_suburb(username: str, suburb: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(suburb=suburb))
        session.commit()

def get_country(username: str):
    with Session(engine) as session:
        return session.execute(select(User.country).where(User.username == username)).all()

def change_country(username: str, country: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(country=country))
        session.commit()

def get_postcode(username: str):
    with Session(engine) as session:
        return session.execute(select(User.postcode).where(User.username == username)).all()

def change_postcode(username: str, postcode: str):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(postcode=postcode))
        session.commit()

def get_dob(username: str):
    with Session(engine) as session:
        return session.execute(select(User.date_of_birth).where(User.username == username)).all()

def change_dob(username: str, dob: DateTime):
    with Session(engine) as session:
        session.execute(update(User).where(User.username == username).values(date_of_birth=dob))
        session.commit()

def get_friend_request(combined_username_key: str):
    with Session(engine) as session:
        return session.get(FriendRequest, combined_username_key)

def remove_friend_request(combined_username_key: str):
    with Session(engine) as session:
        session.execute(delete(FriendRequest).where(FriendRequest.combined_username_key==combined_username_key))
        session.commit()

def get_friend_request(username: str):
     with Session(engine) as session:
        req = session.execute(select(FriendRequest.username_sent, FriendRequest.username_recieved, FriendRequest.combined_username_key).where(FriendRequest.username_recieved==username or FriendRequest.username_sent==username)).all()
        formatted_friend_requests = []
        for friend in req:
            if friend[0] == username:
                formatted_friend_requests.append([friend[1], friend[2]])
            else:
                formatted_friend_requests.append([friend[0], friend[2]])
        return formatted_friend_requests

def add_friend(username_1: str, username2: str, combined_username_key: str):
    with Session(engine) as session:
        friendship = Friendships(username_1=username_1, username_2=username2, combined_username_key=combined_username_key)
        session.add(friendship)
        session.commit()

def get_friendship(combined_username_key: str):
    with Session(engine) as session:
            return session.get(Friendships, combined_username_key)
    
def return_friends(username: str):
    with Session(engine) as session:
        friends = session.execute(select(Friendships.username_2, Friendships.username_1).where(Friendships.username_1== username or Friendships.username_2==username)).all()
        formatted_friends = []
        for friend in friends:
            if friend[0] == username:
                formatted_friends.append(friend[1])
            else:
                formatted_friends.append(friend[0])
        return formatted_friends
    
def remove_friend(combined_username_key: str):
    with Session(engine) as session:
        session.execute(delete(Friendships).where(Friendships.combined_username_key==combined_username_key))
        session.commit()

def get_user_following(username: str):
    with Session(engine) as session:
        return session.execute(select(Following.artist).where(Following.username==username)).all()