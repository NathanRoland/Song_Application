import { useUser } from "./userContext";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Account() {
  const { user, updateUser } = useUser();  // Get user data from Context
  
  const fetchData = async () => {
    if (!user) {
      return <h1>No user data found!</h1>;
    }else{
      try {
        const response = await axios.post("http://127.0.0.1:5000/account", {
          name: user.name,
          id: user.id
        });
        if (response.data){

            updateUser({ bio: response.data.bio, 
              pfp_path: response.data.pfp_path, 
              fav_artist: response.data.fav_artist, 
              friends: response.data.friend_amount,
              following: response.data.following_amount,
              insta: response.data.insta_link,
              spotify: response.data.spotify_link,
              apple: response.data.apple_music_link,
              soundcloud: response.data.soundcloud_link
            });
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
      <h1>Welcome, {user.name}!</h1>
      <p>{user.bio}</p>
      <img src={user.pfp_path} />
      <p>{user.fav_artist}</p>
      <p>{user.friend_amount}</p>
      <p>{user.following_amount}</p>
      <p>{user.insta_link}</p>
      <p>{user.spotify_link}</p>
      <p>{user.apple_music_link}</p>
      <p>{user.soundcloud_link}</p>
      <p>{user.playlist_name}</p>
      <p>{user.playlist_pics}</p>
    </div>

  );
}

export default Account;

