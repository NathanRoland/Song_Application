import { useUser } from "./userContext";

import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function User() {
  const [name, setName] = useState([]);
    const [bio, setBio] = useState([]);
    const [pfp_path, setPfpPath] = useState([]);
    const [fav_artist, setFavArtist] = useState([]);
    const [friends, setFriends] = useState([]);
    const [following, setFollowing] = useState([]);
    const [insta, setInsta] = useState([]);
    const [spotify, setSpotify] = useState([]);
    const [apple, setApple] = useState([]);
    const [soundcloud, setSoundcloud] = useState([]);

  const fetchData = async () => {
    if (!user) {
      return <h1>No user data found!</h1>;
    }else{
      try {
        const response = await axios.post("http://127.0.0.1:5000/user", {  
        });
        if (response.data){
            setName(response.data.name)
            setBio(response.data.bio)
            setPfpPath(response.data.pfp_path)
            setFavArtist(response.data.fav_artist)
            setFriends(response.data.friends)
            setFollowing(response.data.following)
            setInsta(response.data.insta)
            setSpotify(response.data.spotify)
            setApple(response.data.apple)
            setSoundcloud(response.data.soundcloud)
        }
      }catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <div>
      <h1>{name}!</h1>
      <p>{bio}</p>
      <img src={pfp_path} />
      <p>{fav_artist}</p>
      <p>{friends}</p>
      <p>{following}</p>
      <p>{insta}</p>
      <p>{spotify}</p>
      <p>{apple}</p>
      <p>{soundcloud}</p>
    </div>
  );
}

export default User;

