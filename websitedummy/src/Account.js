import { useUser } from "./userContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Result() {
  const { user } = useUser();  // Get user data from Context
  
  if (!user) {
    return <h1>No user data found!</h1>;
  }

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

export default Result;

