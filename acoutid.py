from api import *
import json
import requests
import subprocess
import os
import tempfile
from music_data import *
from song import *
from pydub import AudioSegment
import shutil
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def convert_to_fingerpint(file_path):
    try:
        result = subprocess.run(
            ["fpcalc", "-json", file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode != 0:
            print("fpcalc failed")
            print(result.stderr)
            return None

        data = json.loads(result.stdout)

        return {
            "fingerprint": data["fingerprint"],
            "duration": data["duration"]
        }

    except Exception as e:
        print("Error running fpcalc:", e)
        return None

def get_ID(file):
    api_key = os.environ.get("ACOUSTID_API_KEY")
    if not api_key:
        print("Error: ACOUSTID_API_KEY not found in environment variables")
        return None
    
    duration = 0
    print("converting to fingerprint")
    fingerprint = convert_to_fingerpint(file)
    if fingerprint is None:
        return None
    fingerprint_data = fingerprint["fingerprint"]
    duration = fingerprint["duration"]
    url = "https://api.acoustid.org/v2/lookup"
    params = {
        "client": api_key,
        "meta": "recordings+recordingids+releasegroups+compress",
        "duration": int(duration),
        "fingerprint": fingerprint_data
    }
    response = requests.get(url, params=params)
    data = response.json()
    print(data)
    results = data.get("results", [])
    if results:
        recordings = results[0].get("recordings", [])
        for rec in recordings:
            mb_recording_id = rec.get("id")
            print("MB Recording ID:", mb_recording_id)
    #return data

def recognize_song(file_path):
    url = 'https://api.audd.io/'
    api_key = os.environ.get("AUDD_API_KEY")
    if not api_key:
        print("Error: AUDD_API_KEY not found in environment variables")
        return None

    with open(file_path, 'rb') as f:
        files = {
            'file': f
        }
        data = {
            'api_token': api_key,
            'return': 'musicbrainz,apple_music,spotify,deezer,napster,lyrics',
        }

        response = requests.post(url, data=data, files=files)
        response.raise_for_status()
        if response.json()["status"] == "success":
            track_info = format_audd_result(response.json()["result"])
            return track_info
        else:
            return None

def format_audd_result(result):
    track_info = {}
    track_info["artists"] = []
    track_info["title"] = result.get("title")
    track_info["album"] = result.get("album")
    track_info["release_date"] = result.get("release_date")

    # Timecode
    if 'timecode' in result:
        track_info["timecode"] = result["timecode"]

    # Spotify Info
    spotify = result.get("spotify")
    if spotify:
        for artist in spotify["artists"]:
            if artist["name"] not in track_info["artists"]:
                track_info["artists"].append(artist["name"])
        track_info["spotify_url"] = spotify["external_urls"]["spotify"]
        track_info["spotify_album"] = spotify["album"]["name"]
        if spotify['album']['images']:
            track_info["spotify_cover_art"] = spotify['album']['images'][0]['url']

    # MusicBrainz Info
    #print(track_info["artists"])
    mb = result.get("musicbrainz")
    if mb:
        print("mb")
        print(mb)
        recording_id = mb[0]["id"]
        if len(get_song_id(recording_id)) == 0:
            print("song id")
            track_info["musicbrainz_id"] = recording_id
            artist_ids = [None, None, None, None]
            for i in range(min(len(track_info["artists"]), 4)):
                print("i")
                artist_name = track_info["artists"][i]
                print(artist_name)
                artist_data = get_artist_from_musicbrainz(artist_name)
                if len(artist_data) != 0:
                    artist_ids[i] = artist_data[0].get('id')
                else:
                    artist_ids[i] = artist_name
            
            print("here")
            if len(get_song_info(recording_id)) == 0:
                #print(mb[0])
                release_id = mb[0]["releases"][-1]["id"]
                print(release_id)
                create_song(recording_id, track_info["title"], artist_ids[0], artist_ids[1], artist_ids[2], artist_ids[3], track_info["release_date"], track_info["timecode"], False, 0, 0, 0, release_id, None)
                if len(get_release_info(release_id)) == 0:
                    create_release(release_id, track_info["title"], artist_ids[0], artist_ids[1], artist_ids[2], artist_ids[3], track_info["release_date"], track_info["timecode"], False, False, False, False, None)
        else:
            print("song id found")
            track_info["musicbrainz_id"] = recording_id
    else:
        print("no musicbrainz id found")
        #add to musicbrainz database
        artist_ids = [None, None, None, None]
        for i in range(min(len(track_info["artists"]), 4)):
            print("i")
            print(i)
            artist_name = track_info["artists"][i]
            print("artist name")
            print(artist_name)
            artist_data = get_artist_from_musicbrainz(artist_name)
            if len(artist_data) != 0:
                print(artist_data[0])
                artist_ids[i] = artist_data[0].get('id')
            else:
                artist_ids[i] = artist_name
        #def create_artist(artist_id, username, password, bio, pfp_path, insta_link, spotify_link, apple_music_link, soundcloud_link, email, country=None, genre=None):
        release_id = artist_ids[0]+ "-" + track_info["title"]
        print("release id")
        print(release_id)
        if len(get_song_info(release_id)) == 0:
            create_song(release_id, track_info["title"], artist_ids[0], artist_ids[1], artist_ids[2], artist_ids[3], track_info["release_date"], track_info["timecode"], False, 0, 0, 0, release_id, None)
            create_release(release_id, track_info["title"], artist_ids[0], artist_ids[1], artist_ids[2], artist_ids[3], track_info["release_date"], track_info["timecode"], False, False, False, False, None)
        track_info["musicbrainz_id"] = release_id


    # Lyrics
    print("lyrics")
    lyrics = result.get("lyrics", {}).get("lyrics")
    if lyrics:
        track_info["lyrics"] = lyrics
    return track_info

def split_audio(file_path, segment_duration, step):
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} does not exist")
            return []
        
        # Check if file is readable
        if not os.access(file_path, os.R_OK):
            print(f"Error: File {file_path} is not readable")
            return []
        
        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            print(f"Error: File {file_path} is empty")
            return []
        
        print(f"Loading audio file: {file_path} (size: {file_size} bytes)")
        audio = AudioSegment.from_file(file_path)
        
        if len(audio) == 0:
            print("Error: Audio file has no content")
            return []
        
        print(f"Audio loaded successfully. Duration: {len(audio)}ms")
        segments = []
        for start in range(0, len(audio) - segment_duration + 1, step):
            segment = audio[start:start + segment_duration]
            segments.append(segment)
        
        print(f"Created {len(segments)} segments")
        return segments
        
    except Exception as e:
        print(f"Error in split_audio: {str(e)}")
        return []

def convert_setlist_to_file(url, type):
    try:
        temp_dir = tempfile.mkdtemp()
        output_template = os.path.join(temp_dir, "%(title)s.%(ext)s")
        cmd = [
            "yt-dlp",
            "-x",
            "--audio-format", "mp3",
            "-o", output_template,
            url
        ]

        print(f"Downloading from {type}: {url}")
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"yt-dlp failed with return code {result.returncode}")
            print(f"stderr: {result.stderr}")
            shutil.rmtree(temp_dir)
            return None, None
        
        downloaded_files = [os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.endswith('.mp3')]
        
        if not downloaded_files:
            print("No MP3 files found in downloaded directory")
            shutil.rmtree(temp_dir)
            return None, None
        
        print(f"Downloaded {len(downloaded_files)} file(s): {downloaded_files}")
        
        # Return the first MP3 file found
        return downloaded_files[0], temp_dir
        
    except subprocess.CalledProcessError as e:
        print(f"Error downloading audio from {type}: {e}")
        print(f"Command output: {e.stdout}")
        print(f"Command error: {e.stderr}")
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        return None, None
    except Exception as e:
        print(f"Unexpected error downloading from {type}: {str(e)}")
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        return None, None
    

def get_setlist(link):
    try:
        file_path = None
        if "soundcloud.com" in link:
            file_path = convert_setlist_to_file(link, "soundcloud")
        elif "youtube.com" in link or "youtu.be" in link:
            file_path = convert_setlist_to_file(link, "youtube")
        else:
            print("not a valid link")
            return []
        
        if file_path is None or file_path[0] is None:
            print("Error: Failed to download audio file")
            return []
        
        file_path_of_setlist = file_path[0]
        directory_of_setlist = file_path[1]
        
        print(f"Processing audio file: {file_path_of_setlist}")
        
        segments = split_audio(file_path_of_setlist, segment_duration=60000, step=60000)
        
        if not segments:
            print("Error: No audio segments created")
            if directory_of_setlist and os.path.exists(directory_of_setlist):
                shutil.rmtree(directory_of_setlist)
            return []
        
        tracks = []
        seen_ids = set()
        
        for idx, segment in enumerate(segments):
            try:
                segment_file = f"segment_{idx}.mp3"
                segment.export(segment_file, format="mp3")
                print(f"analysing segment: {idx}")
                track_info = recognize_song(segment_file)
                print(track_info)
                
                if track_info:
                    song_id = track_info.get("musicbrainz_id")
                    if song_id and song_id not in seen_ids:
                        seen_ids.add(song_id)
                        tracks.append(track_info)
                
                # Clean up segment file
                if os.path.exists(segment_file):
                    os.remove(segment_file)
                    
            except Exception as e:
                print(f"Error processing segment {idx}: {str(e)}")
                continue
        
        print(f"Found {len(tracks)} tracks")
        
        # Clean up directory
        if directory_of_setlist and os.path.exists(directory_of_setlist):
            shutil.rmtree(directory_of_setlist)
        
        return tracks
        
    except Exception as e:
        print(f"Error in get_setlist: {str(e)}")
        return []

