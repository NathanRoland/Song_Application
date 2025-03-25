from spotifyData import *
from user import *
from artist import *
from song import *
from classes import *
from comments import *
from playlist import *

from flask import Flask, render_template, request, abort, url_for
from flask_socketio import SocketIO
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
    user_password = get_password(name)
    print(user_password)
    if password != userpassword:
        redirect_url = "http://localhost:3000/login"
        return jsonify({"redirect_url": redirect_url})
    else:
        redirect_url = "http://localhost:3000/" #home?name={name}
        return jsonify({"user": name, "redirect_url": redirect_url})

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
        createUser(name, password, email)
        redirect_url = "http://localhost:3000/"
        return jsonify({"user": name, "redirect_url": redirect_url})
    else:
        redirect_url = "http://localhost:3000/signup"
        return jsonify({"redirect_url": redirect_url})

@app.route("/account", methods=["POST"])
def display_account():
    print("account")
    data=request.json
    name=data.get('name')
    bio=get_bio(name)
    pfp_path=get_pfp(name)
    fav_artist=get_fav_artist(name)
    friends = len(get_friendship(name))
    following=len(get_user_following(name))
    insta_link=get_insta_link(name)
    spotify_link=get_spotify_link(name)
    apple_music_link=get_apple_music_link(name)
    soundcloud_link=get_soundcloud_link(name)
    playlists=get_playlist_id(get_user_id(name))
    playlist_name = []
    playlist_pics = []
    for playlist in playlists:
        playlist_pics.append(get_playlist_pic_path(playlist))
        playlist_name.append(get_playlist_name)
    return jsonify({"bio": bio, "pfp_path": pfp_path, "fav_artist": fav_artist, "friend_amount": friends, "following_amount": following, "insta_link": insta_link, 
                    "spotify_link": spotify_link, "apple_music_link": apple_music_link, "soundcloud_link":soundcloud_link, "playlist_name":playlist_name, "playlist_pics": playlist_pics})

#@app.route("/account/edit", methods=["POST"])

@app.route("/artist", methods=["POST"])
def display_artist():
    data=request.json
    name=data.get('name')
    result_type=data.get('type')
    search_name=data.get('search')
    if retult_type=
    redirect_url = f
if __name__ == '__main__':
    app.run(debug=True)