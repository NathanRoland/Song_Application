import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "./userContext";
import axios from "axios";
import { API_BASE_URL } from './config';

function User() {
  const { user } = useUser(); // Get user from context
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

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user`, {  
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
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  return (
    <div>
      <h1>{name}!</h1>
      <p>{bio}</p>
      <img src={pfp_path} alt="Profile picture" />
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

