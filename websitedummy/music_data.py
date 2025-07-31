from api import *
import json
import requests
import tarfile
import os
from song import *
from artist import *

headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"  # Use your real app/email
    }

def format_ms(ms):
    if ms is None:
        return "??:??"
    seconds = ms // 1000
    return f"{seconds // 60}:{str(seconds % 60).zfill(2)}"

def get_artist_from_musicbrainz(artist_name):
    url = "https://musicbrainz.org/ws/2/artist/"
    params = {
        "query": artist_name,
        "fmt": "json"
    }

    headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"  # Use your real app/email
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    # Print first result
    for artist in data["artists"][:1]:
        print(f"Name: {artist['name']}")
        print(f"ID: {artist['id']}")
    return data["artists"]

def get_artist_from_musicbrainz_id(artist_id):
    url = f"https://musicbrainz.org/ws/2/artist/{artist_id}?fmt=json"
    response = requests.get(url, headers=headers)

    data = response.json()
    return data

def get_albums_from_musicbrainz(artist_id):
    url = f"https://musicbrainz.org/ws/2/release-group?artist={artist_id}&fmt=json&type=album&limit=100"

    headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"  # Use your real app/email
    }
    
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def get_eps_from_musicbrainz(artist_id):
    url = f"https://musicbrainz.org/ws/2/release-group?artist={artist_id}&fmt=json&type=ep&limit=100"

    headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"  # Use your real app/email
    }
    
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def get_singles_from_musicbrainz(artist_id):
    url = f"https://musicbrainz.org/ws/2/release-group?artist={artist_id}&fmt=json&type=single&limit=100"

    headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"  # Use your real app/email
    }
    
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def get_releases_from_group(release_group_id):
    url = f"https://musicbrainz.org/ws/2/release?release-group={release_group_id}&fmt=json"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
   #print(response.json())
    return response.json()["releases"]

def get_release_details_musicbrainz(release_id, is_album, is_EP, is_Song):
    url = f"https://musicbrainz.org/ws/2/release/{release_id}"
    headers = {
        "User-Agent": "DubFinder/0.1 (nathanroland635@gmail.com)"
    }
    params = {
        'fmt': 'json',
        'inc': 'recordings artists artist-credits labels release-groups'
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    release = response.json()
    #print("\n","-"*40,"\n",release)
    #print(f"Title: {release['title']}")
    #print(f"Date: {release.get('date', 'Unknown')}")
    #print(f"Country: {release.get('country', 'Unknown')}")

    #print("Label(s):", ", ".join(
    #    label_info['label']['name']
    #    for label_info in release.get('label-info', [])
    #    if 'label' in label_info
    #))
    #create_release(release_id, name, artist_id, artist_id_2, artist_id_3, artist_id_4, release_date, time, unreleased, is_album, is_EP, is_Song, release_pic):

    if "date" in release:
        date = release["date"]
    else:
        date = None
    if "status" in release:
        unreleased = release["status"]
    else:
        unreleased = None
    release_pic = release["cover-art-archive"]["artwork"]
    name = release["title"]
    artist_credits = release["artist-credit"]
    artists = [None, None, None, None]
    for i in range(len(artist_credits)):
        artists[i] = artist_credits[i]["artist"]["id"]
    #print(artists)


    #create_release_from_musicbrainz(release["id"], release["title"], release["date"], release["country"], release["label-info"], release["media"])
    #print("\nTracklist:")
    time = 0
    for medium in release.get('media', []):
        for track in medium.get('tracks', []):

            position = track.get('position')
            title = track.get('title')
            duration = format_ms(track.get('length'))
            #create_
            if track.get('length') is not None:
                time += track.get('length')
            
            track_artists = [None, None, None, None]
            print(track.get('artist-credit'))
            if track.get('artist-credit') is not None:
                for i in range(min(len(track.get('artist-credit', [])), 4)):
                    track_artists[i] = track.get('artist-credit', [])[i]["artist"]["id"]
            else:
                track_artists = [None, None, None, None]
        
            if len(check_song_exists(track["id"])) == 0:
                print("adding song")
                create_song(track["id"], title, track_artists[0], track_artists[1], track_artists[2], track_artists[3], date, duration, 0, 0, 0, 0, release_id, release_pic)
            #print(f"{position}. {title} — {artist_names} ({duration})")
    time = format_ms(time)
    if len(check_release_exists(release_id)) == 0:
        print("adding release")
        create_release(release_id, name, artists[0], artists[1], artists[2], artists[3], date, time, 0, is_album, is_EP, is_Song, release_pic)


def process_artist_releases(artist_id):
    #print(artist_id)
    albums = get_albums_from_musicbrainz(artist_id)
    eps = get_eps_from_musicbrainz(artist_id)
    singles = get_singles_from_musicbrainz(artist_id)
    for album in albums["release-groups"]:
        releases = get_releases_from_group(album["id"])
        for release in releases:
            get_release_details_musicbrainz(release["id"], True, False, False)

    for ep in eps["release-groups"]:
        releases = get_releases_from_group(ep["id"])
        for release in releases:
            get_release_details_musicbrainz(release["id"], False, True, False)
    
    print("singles")
    for single in singles["release-groups"]:
       #print(single, single["id"])
        releases = get_releases_from_group(single["id"])
        for release in releases:
            get_release_details_musicbrainz(release["id"], False, False, True)

    #return albums, eps, singles

def get_song_from_name_musicbrainz(song_name):
    url = f'https://musicbrainz.org/ws/2/recording?query=recording:"{song_name}"&fmt=json'
    print(url)
    response = requests.get(url, headers=headers)
    #print(response)
    data = response.json()
    #print(data)
    for rec in data["recordings"]:
        #print(rec)
        name = rec["title"]
        release_id = rec["releases"][0]["id"]
        if "primary-type" in rec["releases"][0]["release-group"]:
            type = rec["releases"][0]["release-group"]["primary-type"]
        else:
            type = None
        artists = []
        for artist in rec["artist-credit"]:
            artist_deets = get_artist_from_musicbrainz_id(artist["artist"]["id"])
            print(artist_deets)
            if len(get_artist_name(artist["artist"]["id"])) == 0:
                if "area" not in artist_deets:
                    create_artist(artist["artist"]["id"], artist_deets["name"], None, None, None, None, None, None, None, None, None, None)
                else:
                    if artist_deets.get("area") is not None:
                        create_artist(artist["artist"]["id"], artist_deets["name"], None, None, None, None, None, None, None, None, artist_deets["area"]["name"], None)
                    else:
                        create_artist(artist["artist"]["id"], artist_deets["name"], None, None, None, None, None, None, None, None, None, None)
        artists = " & ".join(a["name"] for a in rec["artist-credit"])
        duration_ms = rec.get("length")
        duration = f"{duration_ms // 60000}:{(duration_ms // 1000) % 60:02}" if duration_ms else "??:??"
        #releases = get_releases_from_group(release_id)
        
        if type == "Album":
            get_release_details_musicbrainz(release_id, True, False, False)
        elif type == "EP":
            get_release_details_musicbrainz(release_id, False, True, False)
        elif type == "Single":
            get_release_details_musicbrainz(release_id, False, False, True)
        print(f"{name} — {artists} ({duration}) {release_id} {type}")    
    #print(data)

def set_all_release_pics():
    all_rows = find_cover_art_for_release()
    for row in all_rows:
        print(row)
        release_id = row[0]
        release_pic = row[-1]
        cover_art_url = f"https://coverartarchive.org/release/{release_id}/front"
        response = requests.get(cover_art_url)
        if response.status_code == 200:
            print(cover_art_url)
            set_release_pic(release_id, cover_art_url)
        else:
            print("no cover art found") 
            set_release_pic(release_id, None)

def set_all_song_pics():
    all_rows = find_cover_art_for_song()
    for row in all_rows:
        print(row)
        song_id = row[0]
        release_id = get_release_id(song_id)[0][0]
        print(release_id)
        cover_art_url = f"https://coverartarchive.org/release/{release_id}/front"
        response = requests.get(cover_art_url)
        if response.status_code == 200:
            print(cover_art_url)
            set_song_pic(song_id, cover_art_url)
        else:
            print("no cover art found") 
            set_song_pic(song_id, None)