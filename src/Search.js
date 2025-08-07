import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import { API_BASE_URL } from './config';

function ListItems({ header, list }){
    const sendDataToFlask2 = async(key, name, header) =>{
        try {
            const response = await axios.post(`${API_BASE_URL}/search/result`, {
                result: name,
                type: header,
                key: key
            });
            console.log(response.data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div>
            <h3>{header}</h3>
            <ul>
                {list.map((item, index) => (
                    <li key={index} onClick={() => sendDataToFlask2(index, item, header)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Search() {
    const [search, setSearch] = useState("");
    const { user } = useUser();  // Get user data from Context
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [users, setUsers] = useState([]);
    const [artists, setArtists] = useState([]);
    const [releases, setReleases] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    if (!user) {
      console.log("no data found")
    }
    else{
      console.log(user)
      console.log(user.name)
    }

  const fetchData = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, {
        search: search,
      });

      if(response.data){
        console.log("dub imo");
        setSongs(response.data.songs);
        setUsers(response.data.users);
        setArtists(response.data.artists);
        setReleases(response.data.releases);
        setPlaylists(response.data.playlists);
    }else{
        console.log("L imo");
    }
      console.log(users)

      // Redirect to Flask-provided URL
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
        <div>
            <h1>Search</h1>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchData}>Submit</button>
        </div>

   
        <div>
            <ListItems header="Songs" list={songs}/>
            <ListItems header="Artists" list={artists}/>
            <ListItems header="Users" list={users}/>
            <ListItems header="Releases" list={releases}/>
            <ListItems header="Playlist" list={playlists}/>
        </div>
    </div>
  );
}

export default Search;