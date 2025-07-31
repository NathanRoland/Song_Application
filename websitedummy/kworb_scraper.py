from math import e
from bs4 import BeautifulSoup
import requests
def get_spotify_chart_url(country: str, type: str):
    try:
        r = requests.get("https://kworb.net/spotify/", timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, 'html.parser')
        content_div = soup.find_all("div", class_='subcontainer')
        if len(content_div) < 4:
            print(f"Not enough content divs found on main page")
            return None
        
        chart_divs = content_div[3]
        rows = chart_divs.find_all("tr")
        for row in rows:
            try:
                name_cell = row.find("td", class_='mp text')
                if not name_cell:
                    continue
                name = name_cell.text.strip()
                
                if name == country:
                    links = row.find_all("a")
                    if len(links) < 4:
                        print(f"Not enough links found for {country}")
                        return None
                    
                    link = None
                    if type == "Daily":
                        link = links[0]["href"]
                    elif type == "Daily Total":
                        link = links[1]["href"]
                    elif type == "Weekly":
                        link = links[2]["href"]
                    elif type == "Weekly Total":
                        link = links[3]["href"]
                    
                    return "https://kworb.net/spotify/" + link
            except Exception as e:
                print(f"Error processing row for {country}: {e}")
                continue
        print(f"Country {country} not found in chart list")
        return None
    except Exception as e:
        print(f"Error fetching chart URL for {country}: {e}")
        return None


def get_spotify_chart_daily_data(country: str, type: str):
    songs = {}
    position = 1
    try:
        url = get_spotify_chart_url(country, type)
        if not url:
            print(f"No URL found for country: {country}, type: {type}")
            return songs
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find_all("div", class_='subcontainer')
        if len(content_div) < 4:
            print(f"Not enough content divs found for {country}")
            return songs
        
        chart_divs = content_div[3]
        rows = chart_divs.find_all("tr")
        for row in rows:
            try:
                song_me_and_artists = row.find("td", class_='text mp').text.strip()
                if not song_me_and_artists or " - " not in song_me_and_artists:
                    continue
                    
                song_me_and_artists = song_me_and_artists.split(" - ")
                if len(song_me_and_artists) < 2:
                    continue
                    
                artists = [song_me_and_artists[0]]
                song_deets = song_me_and_artists[1].split(" (w/")
                if len(song_deets) > 1:
                    extra_artists = [x for x in song_deets[1].split(", ")]
                    cleaned_artists = extra_artists[:-1] + [extra_artists[-1].replace(")", "")]
                    artists.extend(cleaned_artists)
                song = song_deets[0]

                song_details = row.find_all("td")
                if len(song_details) < 10:
                    continue
                    
                days = song_details[3].text.strip()
                change = song_details[1].text.strip()
                peak = song_details[4].text.strip()
                if "(" in song_details[5].text.strip():
                    streams = song_details[6].text.strip()
                    additional_streams = song_details[7].text.strip()
                    total_streams = song_details[10].text.strip()
                else:
                    streams = song_details[5].text.strip()
                    additional_streams = song_details[6].text.strip()
                    total_streams = song_details[9].text.strip()
                
                
                songs[position] = {
                    "song": song,
                    "artists": artists,
                    "days": days,
                    "change": change,
                    "peak": peak,
                    "streams": streams,
                    "additional_streams": additional_streams,
                    "total_weekly_streams": total_streams,
                }
                position += 1
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
    except Exception as e:
        print(f"Error fetching daily chart data for {country}: {e}")
    return songs

def get_spotify_chart_weekly_data(country: str, type: str):
    songs = {}
    position = 1
    try:
        url = get_spotify_chart_url(country, type)
        if not url:
            print(f"No URL found for country: {country}, type: {type}")
            return songs
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find_all("div", class_='subcontainer')
        if len(content_div) < 4:
            print(f"Not enough content divs found for {country}")
            return songs
        
        chart_divs = content_div[3]
        rows = chart_divs.find_all("tr")
        for row in rows:
            try:
                song_me_and_artists = row.find("td", class_='text mp').text.strip()
                if not song_me_and_artists or " - " not in song_me_and_artists:
                    continue
                    
                song_me_and_artists = song_me_and_artists.split(" - ")
                if len(song_me_and_artists) < 2:
                    continue
                    
                artists = [song_me_and_artists[0]]
                song_deets = song_me_and_artists[1].split(" (w/")
                if len(song_deets) > 1:
                    extra_artists = [x for x in song_deets[1].split(", ")]
                    cleaned_artists = extra_artists[:-1] + [extra_artists[-1].replace(")", "")]
                    artists.extend(cleaned_artists)
                song = song_deets[0]

                song_details = row.find_all("td")
                if len(song_details) < 8:
                    continue
                    
                weeks = song_details[3].text.strip()
                change = song_details[1].text.strip()
                peak = song_details[4].text.strip()
                if "(" in song_details[5].text.strip():
                    streams = song_details[6].text.strip()
                    additional_streams = song_details[7].text.strip()
                    total_streams = song_details[8].text.strip()
                
                else:
                    streams = song_details[5].text.strip()
                    additional_streams = song_details[6].text.strip()
                    total_streams = song_details[7].text.strip()
                songs[position] = {
                    "song": song,
                    "artists": artists,
                    "weeks": weeks,
                    "change": change,
                    "peak": peak,
                    "streams": streams,
                    "change_in_weekly_streams": additional_streams,
                    "total_streams": total_streams,
                }
                position += 1
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
    except Exception as e:
        print(f"Error fetching weekly chart data for {country}: {e}")
    return songs

country_codes = {'Global': 'global',
    'United States': 'us',
    'United Kingdom': 'uk',
    'Andorra': 'ad',
    'Argentina': 'ar',
    'Australia': 'au',
    'Austria': 'at',
    'Belarus': 'by',
    'Belgium': 'be',
    'Bolivia': 'bo',
    'Brazil': 'br',
    'Bulgaria': 'bg',
    'Canada': 'ca',
    'Chile': 'cl',
    'Colombia': 'co',
    'Costa Rica': 'cr',
    'Cyprus': 'cy',
    'Czech Republic': 'cz',
    'Denmark': 'dk',
    'Dominican Republic': 'do',
    'Ecuador': 'ec',
    'Egypt': 'eg',
    'El Salvador': 'sv',
    'Estonia': 'ee',
    'Finland': 'fi',
    'France': 'fr',
    'Germany': 'de',
    'Greece': 'gr',
    'Guatemala': 'gt',
    'Honduras': 'hn',
    'Hong Kong': 'hk',
    'Hungary': 'hu',
    'Iceland': 'is',
    'India': 'in',
    'Indonesia': 'id',
    'Ireland': 'ie',
    'Israel': 'il',
    'Italy': 'it',
    'Japan': 'jp',
    'Kazakhstan': 'kz',
    'Latvia': 'lv',
    'Lithuania': 'lt',
    'Luxembourg': 'lu',
    'Malaysia': 'my',
    'Malta': 'mt',
    'Mexico': 'mx',
    'Morocco': 'ma',
    'Netherlands': 'nl',
    'New Zealand': 'nz',
    'Nicaragua': 'ni',
    'Nigeria': 'ng',
    'Norway': 'no',
    'Pakistan': 'pk',
    'Panama': 'pa',
    'Paraguay': 'py',
    'Peru': 'pe',
    'Philippines': 'ph',
    'Poland': 'pl',
    'Portugal': 'pt',
    'Romania': 'ro',
    'Russia': 'ru',
    'Saudi Arabia': 'sa',
    'Singapore': 'sg',
    'Slovakia': 'sk',
    'South Africa': 'za',
    'South Korea': 'kr',
    'Spain': 'es',
    'Sweden': 'se',
    'Switzerland': 'ch',
    'Taiwan': 'tw',
    'Thailand': 'th',
    'Turkey': 'tr',
    'Ukraine': 'ua',
    'United Arab Emirates': 'ae',
    'Uruguay': 'uy',
    'Venezuela': 've',
    'Vietnam': 'vn'}

def get_apple_music_charts(country: str):
    country_code = country_codes.get(country)
    song_details = {}
    position = 1
    if country_code is None:
        return song_details
    else:
        url = f"https://kworb.net/charts/apple_s/{country_code}.html"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find_all("div", class_='subcontainer')[3]
        chart_divs = content_div.find("tbody")
        rows = chart_divs.find_all("tr")
        for row in rows:
            elements = row.find_all("td")
            change = elements[1].text
            song_deets = (elements[2]).text.split(" - ")
            second_half = song_deets[1].split(" (feat. ")
            if "&" in song_deets[0]:
                artists = [x for x in song_deets[0].split(" & ")]
            else:
                artists = [song_deets[0]]
            if len(second_half) > 1:
                extra_artists = [x for x in second_half[1].split(" & ")]
                cleaned_artists = extra_artists[:-1] + [extra_artists[-1].replace(")", "")]
                artists.extend(cleaned_artists)
            name = second_half[0]
            song_details[position]= {"change": change, "artists": artists, "name": name}
            #print(song_details[position])
            position += 1
    return song_details

