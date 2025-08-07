from itertools import count
from sqlalchemy import create_engine, select, delete, func, update, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from sqlalchemy.sql.functions import user
from classes import *
import os
from database_manager import engine, get_session_with_retry, execute_with_retry

from pathlib import Path

# creates the database directory
Path("database").mkdir(exist_ok=True)

# initializes the database
Base.metadata.create_all(engine)

def drop_user_tables():
    def _drop_tables(session):
        session.execute(text('DROP TABLE IF EXISTS users'))
    
    execute_with_retry(_drop_tables)

def get_user_non_artist(user_id: str):
    def _get_user(session):
        return session.execute(select(User.username, User.bio, User.pfp_path, User.fav_artist, User.fav_song, User.insta_link, User.spotify_link, User.apple_music_link, User.soundcloud_link).where(User.user_id == user_id)).all()
    
    return execute_with_retry(_get_user)

def get_user_artist(user_id: str):
    def _get_artist(session):
        return session.execute(select(User.username, User.bio, User.pfp_path, User.insta_link, User.spotify_link, User.apple_music_link, User.soundcloud_link).where(User.user_id == user_id)).all()
    
    return execute_with_retry(_get_artist)

def searchForLikeUsers(search):
    def _search_users(session):
        return session.execute(select(User.user_id, User.username).where(User.username.like(search))).all()
    
    return execute_with_retry(_search_users)

def check_if_artist(user_id: str):
    def _check_artist(session):
        return session.execute(select(User.isArtist).where(User.user_id == user_id)).all()
    
    return execute_with_retry(_check_artist)

def get_user(username: str):
    def _get_user_by_username(session):
        return session.get(User, username)
    
    return execute_with_retry(_get_user_by_username)

def create_artist_from_user(artist_id, artist_name, password, email):
    def _create_artist(session):
        user = User(user_id = artist_id, username=artist_name, password=password, email=email, isArtist=True)
        session.add(user)
    
    execute_with_retry(_create_artist)

def createUser(username, password, email):
    def _create_user(session):
        if (get_user(username)):
            print("Username already in database")
            return False
        else:
            num = getUsersAmount()
            user = User(user_id = str(num), username=username, password=password, email=email)
            session.add(user)
            return True
    
    return execute_with_retry(_create_user)

def getUsersAmount():
    def _get_count(session):
        result = session.execute(select(func.count(User.user_id))).scalar_one()
        return result
    
    return execute_with_retry(_get_count)

def get_user_id_by_username(username: str) -> str:
    def _get_user_id(session):
        user = session.query(User).filter(User.username == username).first()
        if user:
            print("found")
            return user.user_id
        else:
            raise ValueError("User not found")
    
    return execute_with_retry(_get_user_id)

def change_username(old_username:str, new_username: str):
    def _change_username(session):
        if (get_user(new_username)):
            print("Username already in database")
            return False
        else:
            session.execute(update(User).where(User.username == old_username).values(username = new_username))
            return True
    
    return execute_with_retry(_change_username)

def get_username(user_id: str):
    def _get_username(session):
        return session.execute(select(User.username).where(User.user_id == user_id)).all()
    
    return execute_with_retry(_get_username)

def get_user_password(username: str):
    def _get_password(session):
        return session.execute(select(User.password).where(User.username==username)).all()
    
    return execute_with_retry(_get_password)
    
def get_user_pfp(username: str):
    def _get_pfp(session):
        return session.execute(select(User.pfp_path).where(User.username==username)).all()
    
    return execute_with_retry(_get_pfp)

def set_pfp(username: str, pfp_path: str):
    def _set_pfp(session):
        session.execute(update(User).where(User.username == username).values(pfp_path = pfp_path))
    
    execute_with_retry(_set_pfp)

def get_user_bio(username:str):
    def _get_bio(session):
        return session.execute(select(User.bio).where(User.username==username)).all()
    
    return execute_with_retry(_get_bio)

def change_bio(username: str, bio: str):
    def _change_bio(session):
        session.execute(update(User).where(User.username == username).values(bio = bio))
    
    execute_with_retry(_change_bio)

def get_fav_artist(username:str):
    def _get_fav_artist(session):
        return session.execute(select(User.fav_artist).where(User.username==username)).all()
    
    return execute_with_retry(_get_fav_artist)

def update_fav_artist(username: str, fav_artist: str):
    def _update_fav_artist(session):
        session.execute(update(User).where(User.username == username).values(fav_artist = fav_artist))
    
    execute_with_retry(_update_fav_artist)

def get_fav_song(username:str):
    def _get_fav_song(session):
        return session.execute(select(User.fav_song).where(User.username==username)).all()
    
    return execute_with_retry(_get_fav_song)

def update_fav_song(username: str, fav_song: str):
    def _update_fav_song(session):
        session.execute(update(User).where(User.username == username).values(fav_song = fav_song))
    
    execute_with_retry(_update_fav_song)

def get_insta_link(username: str):
    def _get_insta(session):
        return session.execute(select(User.insta_link).where(User.username == username)).all()
    
    return execute_with_retry(_get_insta)

def change_insta_link(username: str, insta_link: str):
    def _change_insta(session):
        session.execute(update(User).where(User.username == username).values(insta_link = insta_link))
    
    execute_with_retry(_change_insta)

def get_spotify_link(username: str):
    def _get_spotify(session):
        return session.execute(select(User.spotify_link).where(User.username == username)).all()
    
    return execute_with_retry(_get_spotify)

def change_spotify_link(username: str, spotify_link: str):
    def _change_spotify(session):
        session.execute(update(User).where(User.username == username).values(spotify_link = spotify_link))
    
    execute_with_retry(_change_spotify)

def get_apple_music_link(username: str):
    def _get_apple(session):
        return session.execute(select(User.apple_music_link).where(User.username == username)).all()
    
    return execute_with_retry(_get_apple)

def change_apple_music_link(username: str, apple_music_link: str):
    def _change_apple(session):
        session.execute(update(User).where(User.username == username).values(apple_music_link = apple_music_link))
    
    execute_with_retry(_change_apple)

def get_soundcloud_link(username: str):
    def _get_soundcloud(session):
        return session.execute(select(User.soundcloud_link).where(User.username == username)).all()
    
    return execute_with_retry(_get_soundcloud)

def change_soundcloud_link(username: str, soundcloud_link: str):
    def _change_soundcloud(session):
        session.execute(update(User).where(User.username == username).values(soundcloud_link = soundcloud_link))
    
    execute_with_retry(_change_soundcloud)

def get_address(username: str):
    def _get_address(session):
        return session.execute(select(User.address).where(User.username == username)).all()
    
    return execute_with_retry(_get_address)

def change_address(username: str, address: str):
    def _change_address(session):
        session.execute(update(User).where(User.username == username).values(address = address))
    
    execute_with_retry(_change_address)

def get_suburb(username: str):
    def _get_suburb(session):
        return session.execute(select(User.suburb).where(User.username == username)).all()
    
    return execute_with_retry(_get_suburb)

def change_suburb(username: str, suburb: str):
    def _change_suburb(session):
        session.execute(update(User).where(User.username == username).values(suburb = suburb))
    
    execute_with_retry(_change_suburb)

def get_country(username: str):
    def _get_country(session):
        return session.execute(select(User.country).where(User.username == username)).all()
    
    return execute_with_retry(_get_country)

def change_country(username: str, country: str):
    def _change_country(session):
        session.execute(update(User).where(User.username == username).values(country = country))
    
    execute_with_retry(_change_country)

def get_postcode(username: str):
    def _get_postcode(session):
        return session.execute(select(User.postcode).where(User.username == username)).all()
    
    return execute_with_retry(_get_postcode)

def change_postcode(username: str, postcode: str):
    def _change_postcode(session):
        session.execute(update(User).where(User.username == username).values(postcode = postcode))
    
    execute_with_retry(_change_postcode)

def get_dob(username: str):
    def _get_dob(session):
        return session.execute(select(User.date_of_birth).where(User.username == username)).all()
    
    return execute_with_retry(_get_dob)

def change_dob(username: str, dob: DateTime):
    def _change_dob(session):
        session.execute(update(User).where(User.username == username).values(date_of_birth = dob))
    
    execute_with_retry(_change_dob)

def add_friend_request(username_1: str, username2: str):
    def _add_request(session):
        combined_key = f"{username_1}_{username2}"
        friend_request = FriendRequest(username_sent=username_1, username_recieved=username2, combined_username_key=combined_key)
        session.add(friend_request)
    
    execute_with_retry(_add_request)

def get_friend_request(combined_username_key: str):
    def _get_request(session):
        return session.execute(select(FriendRequest).where(FriendRequest.combined_username_key == combined_username_key)).all()
    
    return execute_with_retry(_get_request)

def remove_friend_request(combined_username_key: str):
    def _remove_request(session):
        session.execute(delete(FriendRequest).where(FriendRequest.combined_username_key == combined_username_key))
    
    execute_with_retry(_remove_request)

def get_friend_request(username: str):
    def _get_requests(session):
        return session.execute(select(FriendRequest).where(FriendRequest.username_recieved == username)).all()
    
    return execute_with_retry(_get_requests)

def add_friend(username_1: str, username2: str, combined_username_key: str):
    def _add_friend(session):
        friendship = Friendships(username_1=username_1, username_2=username2, combined_username_key=combined_username_key)
        session.add(friendship)
    
    execute_with_retry(_add_friend)

def get_friendship(combined_username_key: str):
    def _get_friendship(session):
        return session.execute(select(Friendships).where(Friendships.combined_username_key == combined_username_key)).all()
    
    return execute_with_retry(_get_friendship)

def return_friends(username: str):
    def _get_friends(session):
        return session.execute(select(Friendships).where(Friendships.username_1 == username or Friendships.username_2 == username)).all()
    
    return execute_with_retry(_get_friends)

def remove_friend(combined_username_key: str):
    def _remove_friend(session):
        session.execute(delete(Friendships).where(Friendships.combined_username_key == combined_username_key))
    
    execute_with_retry(_remove_friend)

def get_user_following(username: str):
    def _get_following(session):
        return session.execute(select(Following).where(Following.username == username)).all()
    
    return execute_with_retry(_get_following)

def get_received_friend_requests(username: str):
    def _get_received(session):
        return session.execute(select(FriendRequest).where(FriendRequest.username_recieved == username)).all()
    
    return execute_with_retry(_get_received)

def get_sent_friend_requests(username: str):
    def _get_sent(session):
        return session.execute(select(FriendRequest).where(FriendRequest.username_sent == username)).all()
    
    return execute_with_retry(_get_sent)

def check_if_friends(username1: str, username2: str):
    def _check_friends(session):
        combined_key_1 = f"{username1}_{username2}"
        combined_key_2 = f"{username2}_{username1}"
        return session.execute(select(Friendships).where(Friendships.combined_username_key == combined_key_1 or Friendships.combined_username_key == combined_key_2)).all()
    
    return execute_with_retry(_check_friends)

def check_friend_request_status(username1: str, username2: str):
    def _check_status(session):
        combined_key_1 = f"{username1}_{username2}"
        combined_key_2 = f"{username2}_{username1}"
        return session.execute(select(FriendRequest).where(FriendRequest.combined_username_key == combined_key_1 or FriendRequest.combined_username_key == combined_key_2)).all()
    
    return execute_with_retry(_check_status)