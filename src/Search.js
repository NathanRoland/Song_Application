import { useState } from "react";
import axios from "axios";
import { useUser } from "./userContext";

function ListItems({ header, list }){
    const sendDataToFlask2 = async(key, name, header) =>{
        try {
            const response = await axios.post("http://127.0.0.1:5000/search/result", {
                result: name,
                type: header,
                id: key
            });
            if(response.data){
                window.location.href = response.data;
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }
    if(list.length >=1){
    return(
        <div>
        <h1>{header}</h1>
        <ul>
            {list.map(item => (
            <li key={item.key} onClick={() => sendDataToFlask2(item.key, item.name, header)}>{item.name}</li>))}
        </ul>
        </div>
    );}
}

function Search() {
  const [search, setSearch] = useState("");
  const { user } = useUser();  // Get user data from Context
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
      const response = await axios.post("http://127.0.0.1:5000/search", {
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