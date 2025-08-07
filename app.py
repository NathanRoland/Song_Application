from spotifyData import *
from user import *
from artist import *
from song import *
from classes import *
from comments import *
from playlist import *
from music_data import *
from kworb_scraper import *
from acoutid import *
from post import *

from flask import Flask, render_template, request, abort, url_for, send_from_directory
from flask_socketio import SocketIO
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
import billboard

import bcrypt
import os
import tempfile
import datetime
from dotenv import load_dotenv

app = Flask(__name__)

# Configure CORS properly
CORS(app, 
     origins=[
         "https://song-application.vercel.app",
         "https://song-application-p2ab.onrender.com", 
         "http://localhost:3000",
         "http://127.0.0.1:3000",
         "http://localhost:5000",
         "http://127.0.0.1:5000",
         "http://localhost",
         "http://127.0.0.1"
     ], 
     supports_credentials=True, 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"])

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    # Get the origin from the request
    origin = request.headers.get('Origin')
    
    # Check if the origin is in our allowed list
    allowed_origins = [
        "https://song-application.vercel.app",
        "https://dub-finder-backend.onrender.com", 
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost",
        "http://127.0.0.1"
    ]
    
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Origin', 'https://song-application.vercel.app')
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response.status_code = 200
    
    return response

# General OPTIONS handler for all routes
@app.route("/<path:path>", methods=["OPTIONS"])
def options_handler(path):
    response = jsonify({"message": "OK"})
    origin = request.headers.get('Origin')
    
    allowed_origins = [
        "https://song-application.vercel.app",
        "https://dub-finder-backend.onrender.com", 
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost",
        "http://127.0.0.1"
    ]
    
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Origin', 'https://song-application.vercel.app')
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response

load_dotenv()

# secret key used to sign the session cookie
app.config['SECRET_KEY'] = secrets.token_hex()
socketio = SocketIO(app)
SESSION_COOKIE_SECURE = True
REMEMBER_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
REMEMBER_COOKIE_HTTPONLY = True

@app.route("/")
def health_check():
    try:
        # Test database connection
        from database_manager import test_connection
        db_status = test_connection()
        
        return jsonify({
            "status": "healthy", 
            "message": "Server is running",
            "database": "connected" if db_status else "disconnected",
            "timestamp": str(datetime.datetime.now())
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "message": f"Server error: {str(e)}",
            "timestamp": str(datetime.datetime.now())
        }), 500

@app.route("/test")
def test_endpoint():
    return jsonify({
        "message": "Test endpoint working",
        "timestamp": str(datetime.datetime.now())
    })

@app.route("/artists/test", methods=["POST"])
def test_artists():
    try:
        data = request.json
        artist_name = data.get("artist", "test") if data else "test"
        
        return jsonify({
            "message": "Artists test endpoint working",
            "artist": artist_name,
            "artists": [
                {"id": "test1", "name": "Test Artist 1", "country": "Test Country", "genre": "Test Genre"},
                {"id": "test2", "name": "Test Artist 2", "country": "Test Country", "genre": "Test Genre"}
            ],
            "timestamp": str(datetime.datetime.now())
        })
    except Exception as e:
        return jsonify({
            "error": f"Test endpoint error: {str(e)}",
            "timestamp": str(datetime.datetime.now())
        }), 500

@app.route("/login", methods=['GET'])

# Handle OPTIONS requests for login
@app.route("/login/user", methods=["OPTIONS"])
def login_user_options():
    response = jsonify({"message": "OK"})
    response.headers.add('Access-Control-Allow-Origin', 'https://song-application.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# handles a post request when the user clicks the log in button
@app.route("/login/user", methods=["POST"])
def login_user():
    try:
        print("🔐 Login endpoint called")
        data = request.json
        print(f"📝 Received data: {data}")
        
        if not request.is_json:
            print("❌ Request is not JSON")
            return jsonify({"error": "Invalid request format"}), 400
        
        name = data.get('name')
        password = data.get('password')
        
        if not name or not password:
            print("❌ Missing name or password")
            return jsonify({"error": "Missing name or password"}), 400
        
        print(f"👤 Attempting login for user: {name}")
        user_password = get_user_password(name)
        
        if len(user_password) == 0:
            print(f"❌ User not found: {name}")
            return jsonify({"error": "User not found"}), 404
        
        print(f"🔑 Password check for user: {name}")
        if password != user_password[0][0]:
            print(f"❌ Invalid password for user: {name}")
            return jsonify({"error": "Invalid password"}), 401
        else:
            print(f"✅ Login successful for user: {name}")
            user_id = get_user_id_by_username(name)
            print(f"🆔 User ID: {user_id}")
            return jsonify({"user": name, "id": user_id})
            
    except Exception as e:
        print(f"❌ Error in login_user: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/main")
def main():
    return send_from_directory('public', 'index.html')

# handles a post request when the user clicks the signup button
@app.route("/signup", methods=['GET'])

@app.route("/signup/user", methods=["POST"])
def signup_user():
    try:
        print("📝 Signup endpoint called")
        data = request.json
        print(f"📝 Received data: {data}")
        
        if not request.is_json:
            print("❌ Request is not JSON")
            return jsonify({"error": "Invalid request format"}), 400
        
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')
        
        if not name or not password or not email:
            print("❌ Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400
        
        print(f"👤 Checking if user exists: {name}")
        if get_user(name) is None:
            print(f"✅ Creating new user: {name}")
            createUser(name, password, email)
            user_id = get_user_id_by_username(name)
            print(f"🆔 New user ID: {user_id}")
            return jsonify({"user": name, "id": user_id})
        else:
            print(f"❌ User already exists: {name}")
            return jsonify({"error": "User already exists"}), 409
            
    except Exception as e:
        print(f"❌ Error in signup_user: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/post/publish", methods=["POST"])
def post():
    try:
        user_id = request.form.get("user_id")
        
        # Ensure user_id is a string
        if user_id is not None:
            user_id = str(user_id)
        
        post_title = request.form.get("post_title")
        post_text = request.form.get("post_text")
        
        photo_path = None
        if 'photo' in request.files:
            photo = request.files['photo']
            if photo.filename != '':
                # Generate unique filename
                import uuid
                filename = f"{uuid.uuid4()}_{photo.filename}"
                photo_path = f"photos/{filename}"
                photo.save(photo_path)
        
        create_post(user_id, post_title, post_text, photo_path)
        post_details = get_posts_from_user_id(user_id)[-1]
        post_info = {
            "post_id": post_details[0],
            "post_title": post_details[1],
            "post_text": post_details[2],
            "photo_path": post_details[3],
            "time": post_details[4],
            "likes": post_details[5],
            "comments": post_details[6]
        }
        return jsonify({"success": True, "post_info": post_info})
        
    except Exception as e:
        print(f"Error in post publish: {str(e)}")
        return jsonify({"error": "Failed to publish post"}), 500

@app.route("/post/view", methods=["POST"])
def view_post():
    data = request.json
    post_id = data.get("post_id")
    post_details = get_post_from_post_id(post_id)[0]
    post_info = {
        "post_id": post_details[0],
        "post_title": post_details[1],
        "post_text": post_details[2],
        "photo_path": post_details[3],
        "time": post_details[4],
        "likes_amount": post_details[5],
        "comments_amount": post_details[6]
    }
    post_comments = get_post_comments(post_id)
    post_comment_info = []
    
    # Organize comments hierarchically
    comments_dict = {}
    top_level_comments = []
    
    for comment in post_comments:
        # Get username for the comment author
        username_result = get_username(comment[1])
        username = username_result[0][0] if username_result and username_result[0] else f"User {comment[1]}"
        comment_info = {
            "comment_id": comment[0],
            "user_id": comment[1],
            "username": username,
            "post_id": post_id,
            "comment_text": comment[2],
            "time": comment[3],
            "likes": comment[4],
            "parent_comment_id": comment[5],
            "replies": []
        }
        
        comments_dict[comment[0]] = comment_info
        
        if comment[5] == 0 or comment[5] is None:  # Top-level comment
            top_level_comments.append(comment_info)
        else:  # Reply to another comment
            if comment[5] in comments_dict:
                comments_dict[comment[5]]["replies"].append(comment_info)
    
    post_comment_info = top_level_comments
    post_info["comments"] = post_comment_info
    post_likes = get_post_likes(post_id)
    post_like_info = []
    for like in post_likes:
        post_like_info.append({
            "user_id": like[0],
            "post_id": like[1]
        })
    post_info["likes"] = post_like_info
    return jsonify({"success": True, "post_info": post_info})

@app.route("/post/view/add_comment", methods=["POST"])
def add_comment():
    data = request.json
    user_id = data.get("user_id")
    post_id = data.get("post_id")
    comment_text = data.get("comment_text")
    parent_comment_id = data.get("parent_comment_id", 0)  # Default to 0 for top-level comments
    create_post_comment(user_id, post_id, comment_text, datetime.now(), parent_comment_id)
    return jsonify({"success": True, "message": "Comment added successfully"})


@app.route("/feed", methods=["POST"])
def get_feed():
    print("feed")
    try:
        data = request.json
        user_id = data.get("user_id")
        print(f"Received user_id: {user_id}, type: {type(user_id)}")
        
        # Ensure user_id is a string
        if user_id is not None:
            user_id = str(user_id)
            print(f"Converted user_id to string: {user_id}")
        
        #friends = get_friends(user_id)
        if not user_id:
            return jsonify({"error": "user_id required"}), 400
        feed_posts = get_posts_from_user_id(user_id)
        feed_posts_info = []
        print(feed_posts)
        print(user_id)
        for post in feed_posts:
            user_name = get_username(user_id)[0][0]
            print(user_name)
            post_info = {
                "post_id": post[0],
                "username": user_name,
                "post_title": post[1],
                "post_text": post[2],
                "photo_path": post[3],
                "time": post[4],
                "likes": post[5],
                "comments": post[6]
            }
            feed_posts_info.append(post_info)
        return jsonify({"posts": feed_posts_info})
        
    except Exception as e:
        print(f"Error in get_feed: {str(e)}")
        return jsonify({"error": "Failed to load feed"}), 500

@app.route("/post/like", methods=["POST"])
def like_post():
    try:
        data = request.json
        user_id = data.get("user_id")
        post_id = data.get("post_id")
        
        # Ensure user_id is a string
        if user_id is not None:
            user_id = str(user_id)
        
        if not all([user_id, post_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Add like to database
        add_post_like(post_id)
        
        return jsonify({"success": True, "message": "Post liked successfully"})
        
    except Exception as e:
        print(f"Error in like_post: {str(e)}")
        return jsonify({"error": "Failed to like post"}), 500

@app.route("/account/view", methods=["POST"])
def view_other_account():
    data = request.json
    user_id = data.get("user_id")
    if_artist = check_if_artist(user_id)[0][0]
    if if_artist == 1:
        result = get_user_artist(user_id)[0]
        user_info = {
            "username": result[0],
            "bio": result[1],
            "pfp_path": result[2],
            "insta_link": result[3],
            "spotify_link": result[4],
            "apple_music_link": result[5],
            "soundcloud_link": result[6]
        }
    else:
        result = get_user_non_artist(user_id)[0]
        user_info = {
            "username": result[0],
            "bio": result[1],
            "pfp_path": result[2],
            "fav_artist": result[3],
            "fav_song": result[4],
            "insta_link": result[5],
            "spotify_link": result[6],
            "apple_music_link": result[7],
            "soundcloud_link": result[8]
        }
    posts = get_posts_from_user_id(user_id)
    post_info = []
    for post in posts:
        post_info.append({
            "post_id": post[0],
            "post_title": post[1],
            "post_text": post[2],
            "photo_path": post[3],
            "time": post[4],
            "like_amount": post[5],
            "comment_amount": post[6]
        })

    return jsonify({"user_info": user_info, "posts": post_info})

@app.route("/account/view/add_friend", methods=["POST"])
def add_friend_from_account():
    data = request.json
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")
    username_1 = get_username(user_id)[0][0]
    username_2 = get_username(friend_id)[0][0]
    add_friend_request(username_1, username_2)
    return jsonify({"success": True, "message": "Friend request sent successfully"})

@app.route("/account/view/accept_friend", methods=["POST"])
def accept_friend():
    data = request.json
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")
    username_1 = get_username(user_id)[0][0]
    username_2 = get_username(friend_id)[0][0]
    remove_friend_request(username_1 + username_2)
    add_friend(username_1, username_2, username_1 + username_2)
    return jsonify({"success": True, "message": "Friend added successfully"})

@app.route("/account/view/reject_friend", methods=["POST"])
def reject_friend():
    data = request.json
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")
    username_1 = get_username(user_id)[0][0]
    username_2 = get_username(friend_id)[0][0]
    remove_friend_request(username_1 + username_2)
    return jsonify({"success": True, "message": "Friend request rejected successfully"})

@app.route("/account/friend_requests", methods=["POST"])
def get_friend_requests():
    data = request.json
    user_id = data.get("user_id")
    username = get_username(user_id)[0][0]
    
    # Get received friend requests
    received_requests = get_received_friend_requests(username)
    received_info = []
    for req in received_requests:
        received_info.append({
            "username": req[0],
            "combined_key": req[2]
        })
    
    # Get sent friend requests
    sent_requests = get_sent_friend_requests(username)
    sent_info = []
    for req in sent_requests:
        sent_info.append({
            "username": req[1],
            "combined_key": req[2]
        })
    
    return jsonify({
        "received_requests": received_info,
        "sent_requests": sent_info
    })

@app.route("/account/check_friend_status", methods=["POST"])
def check_friend_status():
    data = request.json
    user_id = data.get("user_id")
    other_user_id = data.get("other_user_id")
    
    username1 = get_username(user_id)[0][0]
    username2 = get_username(other_user_id)[0][0]
    
    status = check_friend_request_status(username1, username2)
    
    return jsonify({"status": status})

@app.route("/account/remove_sent_request", methods=["POST"])
def remove_sent_request():
    data = request.json
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")
    username_1 = get_username(user_id)[0][0]
    username_2 = get_username(friend_id)[0][0]
    remove_friend_request(username_1 + username_2)
    return jsonify({"success": True, "message": "Friend request removed successfully"})

@app.route("/account/get_user_id_by_username", methods=["POST"])
def get_user_id_by_username_endpoint():
    data = request.json
    username = data.get("username")
    try:
        user_id = get_user_id_by_username(username)
        return jsonify({"user_id": user_id})
    except ValueError:
        return jsonify({"error": "User not found"}), 404

@app.route("/account", methods=["POST"])
def display_account():
    print("account")
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        name = data.get('name')
        user_id = data.get('id')
        
        if not name or not user_id:
            return jsonify({"error": "Missing required fields: name and id"}), 400
        
        if_artist = check_if_artist(user_id)[0][0]
        print(if_artist)
        user_info = {}
        
        if if_artist != None:
            result = get_user_artist(user_id)[0]
            user_info = {
                "username": result[0],
                "bio": result[1],
                "pfp_path": result[2],
                "insta_link": result[3],
                "spotify_link": result[4],
                "apple_music_link": result[5],
                "soundcloud_link": result[6]
            }
            is_artist = True
        else:
            result = get_user_non_artist(user_id)[0]
            user_info = {
                "username": result[0],
                "bio": result[1],
                "pfp_path": result[2],
                "fav_artist": result[3],
                "fav_song": result[4],
                "insta_link": result[5],
                "spotify_link": result[6],
                "apple_music_link": result[7],
                "soundcloud_link": result[8]
            }
            is_artist = False
        
        posts = get_posts_from_user_id(user_id)
        print(posts)
        post_info = []
        for post in posts:
            post_info.append({
                "post_id": post[0],
                "post_title": post[1],
                "post_text": post[2],
                "photo_path": post[3],
                "time": post[4],
                "like_amount": post[5],
                "comment_amount": post[6]
            })
        
        friends = return_friends(name)
        friend_info = []
        for friend in friends:
            friend_info.append({
                "username": friend,
                "combined_key": None  # return_friends only returns usernames, not combined keys
            })
        
        friend_requests = get_friend_request(name)
        friend_request_info = []
        for friend_request in friend_requests:
            if len(friend_request) >= 2:  # Ensure request has at least 2 elements
                friend_request_info.append({
                    "username": friend_request[0],
                    "combined_key": friend_request[1]
                })
        
        print(post_info)
        return jsonify({
            "user_info": user_info, 
            "is_artist": is_artist, 
            "posts": post_info, 
            "friends": friend_info, 
            "friend_requests": friend_request_info
        })
        
    except Exception as e:
        print(f"Error in display_account: {str(e)}")
        return jsonify({"error": "Failed to load account information"}), 500

@app.route("/account/edit", methods=["POST"])
def edit_account():
    try:
        data = request.json
        name = data.get('name')
        user_id = data.get('id')
        
        if 'username' in data:
            change_username(name, data['username'])
            name = data['username']
        
        if 'bio' in data:
            change_bio(name, data['bio'])
        
        if 'pfp_path' in data:
            set_pfp(name, data['pfp_path'])
        
        if 'fav_artist' in data:
            update_fav_artist(name, data['fav_artist'])
        
        if 'fav_song' in data:
            update_fav_song(name, data['fav_song'])
        
        if 'insta_link' in data:
            change_insta_link(name, data['insta_link'])
        
        if 'spotify_link' in data:
            change_spotify_link(name, data['spotify_link'])
        
        if 'apple_music_link' in data:
            change_apple_music_link(name, data['apple_music_link'])
        
        if 'soundcloud_link' in data:
            change_soundcloud_link(name, data['soundcloud_link'])
        
        return jsonify({"success": True, "message": "Account updated successfully"})
        
    except Exception as e:
        print(f"Error in edit_account: {str(e)}")
        return jsonify({"error": "Failed to update account"}), 500



@app.route("/artist/info", methods=["POST"])
def artist_info():
    data = request.json
    artist_id = data.get("artist_id")
    if not artist_id:
        return jsonify({"error": "artist_id required"}), 400
    result = retrive_artist_info(artist_id)
    if not result or not result[0]:
        return jsonify({"error": "Artist not found"}), 404
    row = result[0]
    #releases = get_artists_releasess(artist_id)
    #process_artist_releases(artist_id)
    all_releases = []
    releases = get_release_info_from_artist(str(artist_id))
    if len(releases) <= 5:
        process_artist_releases(artist_id)
    releases = get_release_info_from_artist(str(artist_id))
    print("hre")
    for release in releases:
        print(release)
        release_dist = {}
        release_info = get_release_info(release[0])
        release_dist["id"] = release_info[0][0]
        release_dist["name"] = release_info[0][1]
        release_dist["date"] = release_info[0][6]
        release_dist["time"] = release_info[0][7]
        release_dist["unreleased"] = release_info[0][8]
        release_dist["is_album"] = release_info[0][9]
        release_dist["is_EP"] = release_info[0][10]
        release_dist["songs"] = []
        release_dist["pic"] = get_release_pic(release[0])[0][0]
        for song in get_song_info_from_release(release[0]):
            song_dist = {}
            song_dist["id"] = song[0]
            song_dist["name"] = song[1]
            song_dist["artist_id"] = song[2]
            song_dist["artist_id_2"] = song[3]
            song_dist["artist_id_3"] = song[4]
            song_dist["artist_id_4"] = song[5]
            song_dist["release_date"] = song[6]
            song_dist["time"] = song[7]
            song_dist["unreleased"] = song[8]
            song_dist["apl_plays"] = song[9]
            song_dist["spt_plays"] = song[10]
            song_dist["soundcloud_plays"] = song[11]
            song_dist["pic"] = get_song_pic(song[0])[0][0] if get_song_pic(song[0]) and get_song_pic(song[0])[0] else None
            release_dist["songs"].append(song_dist)
        all_releases.append(release_dist)
    #print(releases)
    print(row, all_releases)
    posts = get_posts_from_user_id(artist_id)
    post_info = []
    for post in posts:
        post_info.append({
            "post_id": post[0],
            "post_title": post[1],
            "post_text": post[2],
            "photo_path": post[3],
            "time": post[4],
            "like_amount": post[5],
            "comment_amount": post[6]
        })
    return jsonify({
        "id": row[0],
        "name": row[1],
        "bio": row[2],
        "insta_link": row[3],
        "spotify_link": row[4],
        "apple_music_link": row[5],
        "soundcloud_link": row[6],
        "country": row[7],
        "genre": row[8],
        "releases": all_releases,
        "posts": post_info
    })

@app.route("/artists", methods=["POST"])
def get_artists():
    try:
        print("🔍 Artists endpoint called")
        data = request.json
        print(f"📝 Received data: {data}")
        
        if not data:
            return jsonify({"error": "No data provided", "artists": []}), 400
        
        data_artist_name = data.get("artist")
        print(f"🎵 Searching for artist: {data_artist_name}")
        
        if not data_artist_name:
            return jsonify({"error": "No artist name provided", "artists": []}), 400
        
        artists = searchForLikeArtists(data_artist_name)
        print(f"🎯 Found {len(artists)} artists in database")
        
        all_artists = []
        if len(artists) <= 1:
            print("🔍 Searching MusicBrainz for artist info")
            try:
                artist_info = get_artist_from_musicbrainz(data_artist_name)
                print(f"🎵 MusicBrainz returned {len(artist_info)} artists")
                
                for artist in artist_info:
                    if len(get_username(artist["id"])) == 0:
                        if "area" not in artist:
                            create_artist(artist["id"], artist["name"], None, None, None, None, None, None, None, None, None, None)
                        else:
                            if artist.get("area") is not None:
                                create_artist(artist["id"], artist["name"], None, None, None, None, None, None, None, None, artist["area"]["name"], None)
                            else:
                                create_artist(artist["id"], artist["name"], None, None, None, None, None, None, None, None, None, None)
                    
                    if artist.get("area") is not None:
                        all_artists.append({"id": artist["id"], "name": artist["name"], "country": artist["area"]["name"], "genre": None})
                    else:
                        all_artists.append({"id": artist["id"], "name": artist["name"], "country": None, "genre": None})
            except Exception as e:
                print(f"❌ Error getting artist from MusicBrainz: {e}")
                return jsonify({"error": f"Failed to get artist info: {str(e)}", "artists": []}), 500
        else:
            for artist in artists:
                print(f"🎵 Processing artist: {artist}")
                try:
                    country = get_country(artist[0])
                    country_value = country[0][0] if country and country[0] else None
                    genre = get_genre(artist[0])
                    genre_value = genre[0][0] if genre and genre[0] else None
                    all_artists.append({
                        "id": artist[0],
                        "name": artist[1],
                        "country": country_value,
                        "genre": genre_value
                    })
                except Exception as e:
                    print(f"❌ Error processing artist {artist}: {e}")
                    # Continue with other artists
                    all_artists.append({
                        "id": artist[0],
                        "name": artist[1],
                        "country": None,
                        "genre": None
                    })
        
        print(f"✅ Returning {len(all_artists)} artists")
        return jsonify({"artists": all_artists})
        
    except Exception as e:
        print(f"❌ Error in get_artists: {e}")
        return jsonify({"error": f"Server error: {str(e)}", "artists": []}), 500

@app.route("/songs", methods=["POST"])
def get_songs():
    print("songs")

    #get_song_from_name_musicbrainz("STARING INTO THE SUN")
    data = request.json
    song_name = data.get("song")
    print(song_name)
    song_info = searchForLikeSongs(song_name)
    if len(song_info) == 0:
        get_song_from_name_musicbrainz(song_name)
        song_info = searchForLikeSongs(song_name)
    print(song_info)
    all_songs = []
    for song in song_info:
        print(song[0])
        song_deets = get_song_info(song[0])
        print(song_deets)
        song_dist = {}
        song_dist["id"] = song_deets[0][0]
        song_dist["name"] = song_deets[0][1]
        artists_ids = [song_deets[0][2], song_deets[0][3], song_deets[0][4], song_deets[0][5]]
        artist_names = []
        for artist_id in artists_ids:
            if artist_id:
                artist_deets = get_artist_name(artist_id)
                if artist_deets and artist_deets[0]:
                    artist_names.append(artist_deets[0][0])
        song_dist["artist_names"] = artist_names
        song_dist["release_date"] = song_deets[0][6]
        song_dist["time"] = song_deets[0][7]
        song_dist["unreleased"] = song_deets[0][8]
        song_dist["apl_plays"] = song_deets[0][9]
        song_dist["spt_plays"] = song_deets[0][10]
        song_dist["soundcloud_plays"] = song_deets[0][11]
        song_dist["release_id"] = song_deets[0][12]
        song_dist["pic"] = get_song_pic(song[0])[0][0] if get_song_pic(song[0]) and get_song_pic(song[0])[0] else None
        all_songs.append(song_dist)

    release_info = searchForLikeReleases(song_name)
    releases = []
    for release in release_info:
        release_dist = {}
        release_deets = get_release_info(release[0])
        release_dist["id"] = release_deets[0][0]
        release_dist["name"] = release_deets[0][1]
        artists_ids = [release_deets[0][2], release_deets[0][3], release_deets[0][4], release_deets[0][5]]
        artist_names = []
        for artist_id in artists_ids:
            if artist_id:
                artist_deets = get_artist_name(artist_id)
                if artist_deets and artist_deets[0]:
                    artist_names.append(artist_deets[0][0])
        release_dist["artist_names"] = artist_names
        release_dist["date"] = release_deets[0][6]
        release_dist["time"] = release_deets[0][7]
        release_dist["unreleased"] = release_deets[0][8]
        release_dist["is_album"] = release_deets[0][9]
        release_dist["is_EP"] = release_deets[0][10]
        release_dist["is_Song"] = release_deets[0][11]
        release_dist["pic"] = get_release_pic(release[0])[0][0] if get_release_pic(release[0]) and get_release_pic(release[0])[0] else None
        # Get songs for this release
        release_dist["songs"] = []
        songs_in_release = get_song_info_from_release(release[0])
        for song in songs_in_release:
            song_dist = {}
            song_dist["id"] = song[0]
            song_dist["name"] = song[1]
            artists_ids = [song[2], song[3], song[4], song[5]]
            artist_names = []
            for artist_id in artists_ids:
                if artist_id:
                    artist_deets = get_artist_name(artist_id)
                    if artist_deets and artist_deets[0]:
                        artist_names.append(artist_deets[0][0])
            song_dist["artist_names"] = artist_names
            song_dist["release_date"] = song[6]
            song_dist["time"] = song[7]
            song_dist["unreleased"] = song[8]
            song_dist["apl_plays"] = song[9]
            song_dist["spt_plays"] = song[10]
            song_dist["soundcloud_plays"] = song[11]
            song_dist["pic"] = get_song_pic(song[0])[0][0] if get_song_pic(song[0]) and get_song_pic(song[0])[0] else None
            release_dist["songs"].append(song_dist)
        
        releases.append(release_dist)
    return jsonify({"songs": all_songs, "releases": releases})

@app.route("/song/info", methods=["POST"])
def get_song_info_page():
    data = request.json
    print("test")
    song_id = data.get("song_id")
    song_deets = get_song_info(song_id)
    song_dist = {}
    song_dist["id"] = song_deets[0][0]
    song_dist["name"] = song_deets[0][1]
    artists_ids = [song_deets[0][2], song_deets[0][3], song_deets[0][4], song_deets[0][5]]
    artist_names = []
    for artist_id in artists_ids:
        if artist_id:
            artist_deets = get_artist_name(artist_id)
            if artist_deets and artist_deets[0]:
                artist_names.append(artist_deets[0][0])
    song_dist["artist_names"] = artist_names
    song_dist["release_date"] = song_deets[0][6]
    song_dist["time"] = song_deets[0][7]
    song_dist["unreleased"] = song_deets[0][8]
    song_dist["apl_plays"] = song_deets[0][9]
    song_dist["spt_plays"] = song_deets[0][10]
    song_dist["soundcloud_plays"] = song_deets[0][11]
    song_dist["release_name"] = get_release_name(song_deets[0][12])[0][0]
    song_dist["pic"] = get_song_pic(song_id)[0][0] if get_song_pic(song_id) and get_song_pic(song_id)[0] else None
    song_dist["comments"] = get_all_song_comments(song_id)
    song_dist["likes"] = get_song_likes(song_id)[0][0]
    print(song_dist)
    return jsonify({"song": song_dist})

@app.route("/release/info", methods=["POST"])
def get_release_info_page():
    data = request.json
    print("test2")
    release_id = data.get("release_id")
    release_deets = get_release_info(release_id)
    release_dist = {}
    release_dist["id"] = release_deets[0][0]
    release_dist["name"] = release_deets[0][1]
    artists_ids = [release_deets[0][2], release_deets[0][3], release_deets[0][4], release_deets[0][5]]
    artist_names = []
    for artist_id in artists_ids:
        if artist_id:
            artist_deets = get_artist_name(artist_id)
            if artist_deets and artist_deets[0]:
                artist_names.append(artist_deets[0][0])
    release_dist["artist_names"] = artist_names
    release_dist["release_date"] = release_deets[0][6]
    release_dist["time"] = release_deets[0][7]
    release_dist["unreleased"] = release_deets[0][8]
    release_dist["is_album"] = release_deets[0][9]
    release_dist["is_EP"] = release_deets[0][10]
    release_dist["is_Song"] = release_deets[0][11]
    release_dist["pic"] = get_release_pic(release_id)[0][0] if get_release_pic(release_id) and get_release_pic(release_id)[0] else None
    release_dist["comments"] = get_all_release_comments(release_id)
    release_dist["likes"] = get_release_likes(release_id)[0][0]
    return jsonify({"release": release_dist})
    
@app.route("/user")
def display_user():
    username = request.args.get("user")
    user_id = get_user_id_by_username(username)
    bio=get_user_bio(username)[0][0]
    pfp_path=get_user_pfp(username)[0][0]
    fav_artist=get_fav_artist(username)[0][0]
    try:
        friends = len(get_friendship(username))
    except:
        friends=0
    try:
        following=len(get_user_following(username))
    except:
        following=0
    insta_link=get_insta_link(username)
    spotify_link=get_spotify_link(username)
    apple_music_link=get_apple_music_link(username)
    soundcloud_link=get_soundcloud_link(username)
    playlists=get_playlist_id(user_id)
    playlists_data=[]
    for playlist in playlists:
        playlist_data = []
        playlist_data['name'] = get_playlist_name(playlist)
        playlist_data['pic'] = get_playlist_pic_path(playlist)
        playlists_data.append(playlist_data)
    
    return jsonify({"bio": bio, "pfp_path": pfp_path, "fav_artist": fav_artist, "friend_amount": friends, "following_amount": following, "insta_link": insta_link, "spotify_link": spotify_link, "apple_music_link": apple_music_link, "soundcloud_link":soundcloud_link})

@app.route("/home")
def home():
    print("home")
    return "OK"

@app.route("/charts")
def charts():
    print("charts")
    return "OK"

@app.route("/charts/billboard/hot-100")
def top_charts():
    try:
        chart = billboard.ChartData('hot-100')
        entries = [
            {
                "rank": entry.rank,
                "title": entry.title,
                "artist": entry.artist,
                "lastPos": entry.lastPos,
                "peakPos": entry.peakPos,
                "weeks": entry.weeks
            }
            for entry in chart
        ]
        return jsonify({
            "chart": {
                "title": chart.name,
                "date": chart.date,
                "entries": entries
            }
        })
    except Exception as e:
        print(f"Error fetching Billboard Hot 100: {str(e)}")
        return jsonify({
            "error": "Failed to fetch chart data",
            "message": str(e)
        }), 500

@app.route("/charts/billboard-200")
def top_200():
    try:
        chart = billboard.ChartData('billboard-200')
        print(chart)
        entries = [
            {
                "rank": entry.rank,
                "title": entry.title,
                "artist": entry.artist,
                "lastPos": entry.lastPos,
                "peakPos": entry.peakPos,
                "weeks": entry.weeks
            }
            for entry in chart
        ]
        return jsonify({
            "chart": {
                "title": chart.name,
                "date": chart.date,
                "entries": entries
            }
        })
    except Exception as e:
        print(f"Error fetching Billboard 200: {str(e)}")
        return jsonify({
            "error": "Failed to fetch chart data",
            "message": str(e)
        }), 500

@app.route("/charts/billboard/global-200")
def top_global_200():
    try:
        chart = billboard.ChartData('billboard-global-200')
        print(chart)
        entries = [
            {
                "rank": entry.rank,
                "title": entry.title,
                "artist": entry.artist, 
                "lastPos": entry.lastPos,
                "peakPos": entry.peakPos,
                "weeks": entry.weeks
            }
            for entry in chart
        ]
        return jsonify({
            "chart": {
                "title": chart.name,
                "date": chart.date,
                "entries": entries
            }
        })
    except Exception as e:
        print(f"Error fetching Billboard Global 200: {str(e)}")
        return jsonify({
            "error": "Failed to fetch chart data",
            "message": str(e)
        }), 500

@app.route("/charts/spotify/daily", methods=["POST"])
def spotify_daily():
    data = request.json
    if data:
        country = data.get("country")
    else:
        country = "Global"
    data = get_spotify_chart_daily_data(country, "Daily")
    return jsonify({"data": data})

@app.route("/charts/spotify/weekly", methods=["POST"])
def spotify_weekly():
    data = request.json
    if data:
        country = data.get("country")
    else:
        country = "Global"
    data = get_spotify_chart_weekly_data(country, "Weekly")
    return jsonify({"data": data})

@app.route("/charts/apple_music", methods=["POST"])
def apple_music_charts():
    data = request.json
    if data:
        country = data.get("country")
    else:
        country = "United States"
    data = get_apple_music_charts(country)
    #print(data)
    return jsonify({"data": data})

@app.route("/photos/<filename>")
def serve_photo(filename):
    return send_from_directory('photos', filename)

@app.route("/dubfinder/upload", methods=["POST"])
def dubfinder_upload():
    print("dubfinder_upload")
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Check if file is an audio file
        if not file.content_type.startswith('audio/'):
            return jsonify({"error": "File must be an audio file"}), 400
        
        print(f"Received file: {file.filename}")
        print(f"File type: {file.content_type}")
        
        # Process the file with your existing get_ID function
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            track_info = recognize_song(tmp_path)
        finally:
            os.unlink(tmp_path)  # Always clean up

        return jsonify({
            "success": True,
            "message": "File uploaded and analyzed successfully",
            "filename": file.filename,
            "result": track_info
        })
        
    except Exception as e:
        print(f"Error in dubfinder_upload: {str(e)}")
        return jsonify({"error": "Failed to process file"}), 500

@app.route("/dubfinder/setlist", methods=["POST"])
def dubfinder_setlist():
    data = request.json
    if data:
        link = data.get("link")
    else:
        return jsonify({"error": "No link provided"}), 400
    setlist = get_setlist(link)
    return jsonify({"setlist": setlist})

@app.route("/search", methods=["POST"])
def search_results():
    data = request.json
    print("running")
    search_query = data.get("search")
    songs = searchForLikeSongs(search_query)
    print(songs)
    print("---")
    artists = searchForLikeArtists(search_query)
    print(artists)
    print("-")
    users = searchForLikeUsers(search_query)
    print(users)
    print("---")
    releases = searchForLikeReleases(search_query)
    print(releases)
    print("---")
    playlists = searchForLikePlaylists(search_query)
    print(playlists)
    print("---")
    posts = searchforLikePosts(search_query)
    print(posts)
    print("---")
    if len(songs) != 0:
        songs = [{'key':x[0], 'name':get_song_name(x[0])[0][0]}for x in songs]
    if len(artists) != 0:
        artists = [{'key':x[0], 'name':x[1]}for x in artists]   
    if len(users) != 0:
        users = [{'key':x[0], 'name':x[1]} for x in users]
    if len(releases) != 0:
        releases = [{'key':x[0], 'name':get_release_name(x[0])[0][0]}for x in releases]
    if len(playlists) != 0:
        playlists = [{'key':x[0], 'name':x[1]}for x in playlists]
    if len(posts) != 0:
        posts = [{'post_id':x[0], 'user_id':get_username(x[1])[0][0], 'post_title':x[2], 'post_text':x[3], 'photo_path':x[4], 'time':x[5], 'likes':x[6], 'comments':x[7]}for x in posts]
    print("\n")
    print(songs)
    print("---")
    print(artists)
    print("---")
    print(users)
    print("---")
    print(releases)
    print("---")
    print(playlists)
    print("---")
    print(posts)
    print("---")
    return jsonify({"songs": songs, "artists": artists, "users": users, "releases": releases, "playlists": playlists, "posts": posts})

if __name__ == "__main__":
    # For production deployment
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_ENV") == "development"
    
    print(f"🚀 Starting Flask app on port {port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🌐 Host: 0.0.0.0")
    print(f"📊 Environment: {os.environ.get('FLASK_ENV', 'production')}")
    
    try:
        app.run(host="0.0.0.0", port=port, debug=debug)
    except Exception as e:
        print(f"❌ Error starting Flask app: {e}")
        raise e