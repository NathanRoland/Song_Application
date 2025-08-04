from sqlalchemy import String, Integer, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from typing import Dict

# data models
class Base(DeclarativeBase):
    pass

# model to store user information
class OnlineUser(Base):
    __tablename__ = "onlineFriends"
    username: Mapped[str] = mapped_column(String, primary_key=True)

class User(Base):
    __tablename__ = "users"
    user_id: Mapped[str] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    pfp_path: Mapped[str] = mapped_column(String, nullable=True)
    fav_artist: Mapped[str] = mapped_column(String, nullable=True)
    fav_song: Mapped[str] = mapped_column(String, nullable=True)
    insta_link: Mapped[str] = mapped_column(String, nullable=True)
    spotify_link: Mapped[str] = mapped_column(String, nullable=True)
    apple_music_link: Mapped[str] = mapped_column(String, nullable=True)
    soundcloud_link: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(String, nullable=True)
    suburb: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
    postcode: Mapped[str] = mapped_column(String, nullable=True)
    date_of_birth: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    isArtist: Mapped[bool] = mapped_column(Boolean, nullable=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    #username, password, favourite artist, bio, favourite song, pfp, links to other socials
    #artist following
    #friends
    #artist listened to
    #playlists
    #date of birth n other personal shit

class Song(Base):
    __tablename__ = "songs"
    song_id: Mapped[int] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=True)
    artist_id: Mapped[str] = mapped_column(String, nullable=True)
    artist_id_2: Mapped[str] = mapped_column(String, nullable=True)
    artist_id_3: Mapped[str] = mapped_column(String, nullable=True)
    artist_id_4: Mapped[str] = mapped_column(String, nullable=True)
    release_date: Mapped[str] = mapped_column(String, nullable=True)
    time: Mapped[int] = mapped_column(Integer, nullable=True)
    unreleased: Mapped[bool] = mapped_column(Boolean, nullable=True)
    apl_plays: Mapped[int] = mapped_column(Integer, nullable=True)
    spt_plays: Mapped[int] = mapped_column(Integer, nullable=True)
    soundcloud_plays: Mapped[int] = mapped_column(Integer, nullable=True)
    release_id: Mapped[str] = mapped_column(String, nullable=True)
    song_pic: Mapped[str] = mapped_column(String, nullable=True)

class Release(Base):
    __tablename__ = "release"
    release_id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=True)
    artist_id: Mapped[str] = mapped_column(String)
    artist_id_2: Mapped[str] = mapped_column(String, nullable=True)
    artist_id_3: Mapped[str] = mapped_column(String, nullable=True)
    artist_id_4: Mapped[str] = mapped_column(String, nullable=True)
    release_date: Mapped[str] = mapped_column(String, nullable=True)
    time: Mapped[int] = mapped_column(Integer, nullable=True)
    unreleased: Mapped[bool] = mapped_column(Boolean, nullable=True)
    is_album: Mapped[bool] = mapped_column(Boolean, nullable=True)
    is_EP: Mapped[bool] = mapped_column(Boolean, nullable=True)
    is_Song: Mapped[bool] = mapped_column(Boolean, nullable=True)
    release_pic: Mapped[str] = mapped_column(String, nullable=True)

class Song_Comments(Base):
    __tablename__ = "song_comments"
    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    song_id: Mapped[int] = mapped_column(Integer)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_text: Mapped[str] = mapped_column(String)
    likes: Mapped[int] = mapped_column(Integer)
    time: Mapped[DateTime] = mapped_column(DateTime)
    parent_comment_id: Mapped[int] = mapped_column(Integer)

class Release_Comments(Base):
    __tablename__ = "release_comments"
    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    release_id: Mapped[int] = mapped_column(Integer)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_text: Mapped[str] = mapped_column(String)
    likes: Mapped[int] = mapped_column(Integer)
    time: Mapped[DateTime] = mapped_column(DateTime)
    parent_comment_id: Mapped[int] = mapped_column(Integer)

class Playlist_Comments(Base):
    __tablename__ = "playlist_comments"
    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    playlist_id: Mapped[int] = mapped_column(Integer)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_text: Mapped[str] = mapped_column(String)
    likes: Mapped[int] = mapped_column(Integer)
    time: Mapped[DateTime] = mapped_column(DateTime)
    parent_comment_id: Mapped[int] = mapped_column(Integer)

class Artist(Base):
    __tablename__ = "artists"
    artist_id: Mapped[str] = mapped_column(String, primary_key=True)
    username: Mapped[str] = mapped_column(String)
    password: Mapped[str] = mapped_column(String, nullable=True)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    pfp_path: Mapped[str] = mapped_column(String, nullable=True)
    insta_link: Mapped[str] = mapped_column(String, nullable=True)
    spotify_link: Mapped[str] = mapped_column(String, nullable=True)
    apple_music_link: Mapped[str] = mapped_column(String, nullable=True)
    soundcloud_link: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
    genre: Mapped[str] = mapped_column(String, nullable=True)

class Playlist(Base):
    __tablename__ = "playlists"
    playlist_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String)
    bio: Mapped[str] = mapped_column(String)
    order: Mapped[str] = mapped_column(String)
    pic_path: Mapped[str] = mapped_column(String)

class PlaylistSongs(Base):
    __tablename__ = "playlist_songs"
    playlist_song_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    playlist_id: Mapped[int] = mapped_column(Integer)
    song_id: Mapped[int] = mapped_column(Integer)
    date: Mapped[DateTime] = mapped_column(DateTime)

class Following(Base):
    username: Mapped[str] = mapped_column(String)
    artist: Mapped[str] = mapped_column(String)
    combined_key: Mapped[str] = mapped_column(String, primary_key=True)
    __tablename__ = "following"

class FriendRequest(Base):
    __tablename__ = "friend_requests"
    username_sent: Mapped[str] = mapped_column(String)
    username_recieved: Mapped[str] = mapped_column(String)
    combined_username_key: Mapped[str] = mapped_column(String, primary_key=True)

class Friendships(Base):
    __tablename__ = "friends"
    username_1: Mapped[str] = mapped_column(String)
    username_2: Mapped[str] = mapped_column(String)
    combined_username_key: Mapped[str] = mapped_column(String, primary_key=True)

#likes

class SongCommentLikes(Base):
    __tablename__ = "song_comment_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_id: Mapped[int] = mapped_column(Integer)

class ReleaseCommentLikes(Base):
    __tablename__ = "release_comment_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_id: Mapped[int] = mapped_column(Integer)

class PlaylistCommentLikes(Base):
    __tablename__ = "playlist_comment_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    comment_id: Mapped[int] = mapped_column(Integer)

class PlaylistLikes(Base):
    __tablename__ = "playlist_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    playlist_id: Mapped[int] = mapped_column(Integer)

class SongLikes(Base):
    __tablename__ = "song_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    song_id: Mapped[int] = mapped_column(Integer)

class ReleaseLikes(Base):
    __tablename__ = "release_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    release_id: Mapped[int] = mapped_column(Integer)

class Posts(Base):
    __tablename__ = "posts"
    post_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    post_title: Mapped[str] = mapped_column(String)
    post_text: Mapped[str] = mapped_column(String)
    photo_path: Mapped[str] = mapped_column(String, nullable=True)
    time: Mapped[DateTime] = mapped_column(DateTime)
    likes: Mapped[int] = mapped_column(Integer)
    comments: Mapped[int] = mapped_column(Integer)

class PostLikes(Base):
    __tablename__ = "post_likes"
    like_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    post_id: Mapped[int] = mapped_column(Integer)

class PostComments(Base):
    __tablename__ = "post_comments"
    comment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    post_id: Mapped[int] = mapped_column(Integer)
    comment_text: Mapped[str] = mapped_column(String)
    time: Mapped[DateTime] = mapped_column(DateTime)
    likes: Mapped[int] = mapped_column(Integer)
    parent_comment_id: Mapped[int] = mapped_column(Integer)