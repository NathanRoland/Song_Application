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
    user_password = get_user_password(name)
    if len(user_password) == 0:
        redirect_url = "http://localhost:3000/login"
        return jsonify({"redirect_url": redirect_url})
    print(user_password)
    if password != user_password[0][0]:
        redirect_url = "http://localhost:3000/login"
        return jsonify({"redirect_url": redirect_url})
    else:
        print("logged_in")
        user_id = get_user_id_by_username(name)
        print(user_id)
        return jsonify({"user": name, "id": user_id})

@app.route("/main")
def main():
    return send_from_directory('public', 'index.html')

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
    insta_link= get_insta_link(name)
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

@app.route("/account/edit", methods=["POST"])
def edit_account():
    data = request.json
    name = data.get('name')
    # Update fields if present
    if 'bio' in data:
        change_bio(name, data['bio'])
    if 'pfp_path' in data:
        set_pfp(name, data['pfp_path'])
    if 'fav_artist' in data:
        # You may need to implement change_fav_artist if not present
        pass
    if 'insta_link' in data:
        change_insta_link(name, data['insta_link'])
    if 'spotify_link' in data:
        change_spotify_link(name, data['spotify_link'])
    if 'apple_music_link' in data:
        change_apple_music_link(name, data['apple_music_link'])
    if 'soundcloud_link' in data:
        change_soundcloud_link(name, data['soundcloud_link'])
    return jsonify({"success": True})

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
    if len(releases) == 0:
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
        "releases": all_releases
    })

@app.route("/artists", methods=["POST"])
def get_artists():
    print("test")
    data = request.json
    data_artist_name = data.get("artist")
    artists = searchForLikeArtists(data_artist_name)
    all_artists = []
    if len(artists) <= 1:
        artist_info = get_artist_from_musicbrainz(data_artist_name)
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
    else:
        for artist in artists:
            print(artist)
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
        #data_artist_id = searchForLikeArtists(data_artist_name)
        #print(data_artist_id)
    return jsonify({"artists": all_artists})

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

#search function
@app.route("/search", methods=["POST"])
def search():
    search_query = request.json.get("search")
    print(search_query)
    songs = searchForLikeSongs(search_query)
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

@app.route("/charts/billboard-200")
def top_200():
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

@app.route("/charts/billboard/global-200")
def top_global_200():
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

if __name__ == '__main__':
    app.run(debug=True)