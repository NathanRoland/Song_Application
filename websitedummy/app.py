from spotifyData import *
from user import *
from artist import *
from song import *
from classes import *
from comments import *
from playlist import *

from flask import Flask, render_template, request, abort, url_for
from flask_socketio import SocketIO
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
import bcrypt

app = Flask(__name__)
CORS(app)

# secret key used to sign the session cookie
app.config['SECRET_KEY'] = secrets.token_hex()
socketio = SocketIO(app)
SESSION_COOKIE_SECURE = True
REMEMBER_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
REMEMBER_COOKIE_HTTPONLY = True

@app.route("/login", methods=['Get'])

# handles a post request when the user clicks the log in button
@app.route("/login/user", methods=["POST"])
def login_user():
    data=request.json
    print("recieved:data", data)
    if not request.is_json:
        abort(404)
    name = data.get('name')
    password = data.get('password')
    user_password = get_user_password(name)[0][0]
    print(user_password)
    if password != user_password:
        redirect_url = "http://localhost:3000/login"
        return jsonify({"redirect_url": redirect_url})
    else:
        print("logged_in")
        user_id = get_user_id_by_username(name)
        print(user_id)
        return jsonify({"user": name, "id": user_id})

@app.route("/main")

# handles a post request when the user clicks the signup button
@app.route("/signup", methods=['GET'])

@app.route("/signup/user", methods=["POST"])
def signup_user():
    print("test")
    data=request.json
    print("recieved:data", data)
    if not request.is_json:
        abort(404)
    name = data.get('name')
    password = data.get('password')
    email = data.get('email')
    
    if get_user(name) is None:
        print(name)
        createUser(name, password, email)
        user_id = get_user_id_by_username(name)
        print(user_id)
        return jsonify({"user": name, "id": user_id})
    else:
        redirect_url = "http://localhost:3000/signup"
        return jsonify({"redirect_url": redirect_url})

@app.route("/account", methods=["POST"])
def display_account():
    print("account")
    data=request.json
    name=data.get('name')
    user_id = data.get('id')
    bio=get_user_bio(name)[0][0]
    pfp_path=get_user_pfp(name)[0][0]
    fav_artist=get_fav_artist(name)[0][0]
    try:
        friends = len(get_friendship(name))
    except:
        friends=0
    try:
        following=len(get_user_following(name))
    except:
        following=0
    insta_link=get_insta_link(name)
    spotify_link=get_spotify_link(name)
    apple_music_link=get_apple_music_link(name)
    soundcloud_link=get_soundcloud_link(name)
    playlists=get_playlist_id(user_id)
    playlists_data=[]
    for playlist in playlists:
        playlist_data = []
        playlist_data['name'] = get_playlist_name(playlist)
        playlist_data['pic'] = get_playlist_pic_path(playlist)
        playlists_data.append(playlist_data)
    
    #print(bio, pfp_path, fav_artist, friends, following, insta_link, spotify_link, apple_music_link, soundcloud_link, playlists_data)
    #return jsonify({"bio": bio, "fav_artist": fav_artist})

    return jsonify({"bio": bio, "pfp_path": pfp_path, "fav_artist": fav_artist, "friend_amount": friends, "following_amount": following, "insta_link": insta_link, "spotify_link": spotify_link, "apple_music_link": apple_music_link, "soundcloud_link":soundcloud_link})

#@app.route("/account/edit", methods=["POST"])

@app.route("/artist", methods=["POST"])
def display_artist():
    artist_name = request.json.get("artist")
    artist_id = get_artist_id(artist_name)
    bio = get_bio(artist_id)
    pfp = get_pfp_path(artist_id)
    insta = get_insta_link(artist_id)
    spotify = get_spotify_link(artist_id)
    apple = get_apple_music_link(artist_id)
    soundcloud = get_soundcloud_link(artist_id)
    song_ids = get_artists_songs(artist_id)
    songs = []
    albums = []
    EPs = []
    for music in song_ids:
        song = {}
        song["id"] = music
        song["name"] = get_name(music)
        song["pic"] = get_song_pic(music)
        song["date"] = get_release_date(get_release_id(music))
        songs.append(song)

    release_ids = get_artists_releasess(artist_id)
    for music in release_ids:
        if get_is_album(music):
            album = {}
            album["name"] = get_release_name(music)
            album["pic"] = get_release_pic(music)
            album["date"] = get_release_date(music)
            albums.append(album)
        elif get_is_EP(music):
            EP_a = {}
            EP_a["name"] = get_release_name(music)
            EP_a["pic"] = get_release_pic(music)
            EP_a["date"] = get_release_date(music)
            EPs.append[EP_a]
        
    
    return jsonify({"bio": bio, "pfp_path": pfp, "insta_link": insta, "spotify_link": spotify, "apple_music_link": apple, "soundcloud_link":soundcloud, "albums": albums, "songs": songs, "EPs": EPs})

#search function
@app.route("/search", methods=["POST"])
def search():
    search_query = request.json.get("search")
    print(search_query)
    songs = searchForLikeSongs(search_query)
    #songs = list
    artists = searchForLikeArtists(search_query)
    users = searchForLikeUsers(search_query)
    releases = searchForLikeReleases(search_query)
    playlists = searchForLikePlaylists(search_query)
    if len(songs) != 0:
        songs = [{'key':x[0], 'name':x[1]}for x in songs[0]]
    if len(artists) != 0:
        artists = [{'key':x[0], 'name':x[1]}for x in artists[0]]
    if len(users) != 0:
        print([x[0] for x in users])
        users = [{'key':x[0], 'name':x[1]} for x in users]
    if len(releases) != 0:
        releases = [{'key':x[0], 'name':x[1]}for x in releases[0]]
    if len(playlists) != 0:
        playlists = [{'key':x[0], 'name':x[1]}for x in playlists[0]]
    print(songs)
    print(artists)
    print(users)
    print(releases)
    print(playlists)
    return jsonify({"songs": songs, "users": users, "artists": artists, "releases": releases, "playlists": playlists})

@app.route("/search/result", methods=["POST"])
def getResult():
    url = None
    data=request.json
    print("recieved:data", data)
    result = data.get("result")
    type = data.get("type")
    id = data.get("id")
    print("proof")
    if type == "Artist":
        return url_for('display_artist', artist=result)
    if type == "Song":
        return url_for('display_song', song=result)
    if type == "User":
        return url_for('display_user', user=result)
    if type == "Release":
        return url_for('display_release', release=result)
    if type == "Playlist":
        return url_for('display_playlist', playlist=result)
    
@app.route("/user")
def display_user():
    return

@app.route("/user")
def display_user():
    return

@app.route("/user")
def display_user():
    return

@app.route("/user")
def display_user():
    return

@app.route("/user")
def display_user():
    return
if __name__ == '__main__':
    app.run(debug=True)