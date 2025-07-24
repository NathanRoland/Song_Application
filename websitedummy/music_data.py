from api import *
import json
import requests
import tarfile
import os

entities = [
        "area", "artist", "event", "instrument", "label", "place",
        "recording", "release", "release-group", "series", "work"
    ]

def get_metabrains_access_token():
    with open("api/metabrains.json") as f:
        config = json.load(f)

    token = config["ACCESS+TOKEN"]

    info_url = f"https://metabrainz.org/api/musicbrainz/replication-info?token={token}"
    info_response = requests.get(info_url)
    info_response.raise_for_status()

    replication_info = info_response.json()
    latest_packet = replication_info["last_packet"]  
    packet_number = latest_packet.split("-")[1].split(".")[0]
    print(f"Latest replication packet: {packet_number}")

    output_dir = f"json-dump-{packet_number}"
    os.makedirs(output_dir, exist_ok=True)

    for entity in entities:
        json_url = (
            f"https://metabrainz.org/api/musicbrainz/json-dumps/json-dump-"
            f"{packet_number}/{entity}.tar.xz?token={token}"
        )
        
        print(f"Downloading {entity} dump...")
        response = requests.get(json_url)
        
        if response.status_code == 200:
            filename = os.path.join(output_dir, f"{entity}.tar.xz")
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"✔ Downloaded: {filename}")
        else:
            print(f"⚠ No dump for {entity} (HTTP {response.status_code})")

    print("✅ Finished downloading all available JSON dumps.")
