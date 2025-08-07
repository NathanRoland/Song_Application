import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import axios from "axios";
import { API_BASE_URL } from './config';

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const sendDataToFlask = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login/user`, {
        name: name,
        password: password,
      });

      if (response.data.user) {
        // After login, fetch full account info
        const userId = response.data.id;
        const userName = response.data.user;
        const accountRes = await axios.post(`${API_BASE_URL}/account`, {
          name: userName,
          id: userId,
        });
        if (accountRes.data) {
          setUser({
            name: userName,
            id: userId,
            bio: accountRes.data.bio,
            pfp_path: accountRes.data.pfp_path,
            fav_artist: accountRes.data.fav_artist,
            friend_amount: accountRes.data.friend_amount,
            following_amount: accountRes.data.following_amount,
            insta_link: accountRes.data.insta_link,
            spotify_link: accountRes.data.spotify_link,
            apple_music_link: accountRes.data.apple_music_link,
            soundcloud_link: accountRes.data.soundcloud_link,
          });
        } else {
          setUser({ name: userName, id: userId });
        }
        navigate("/account");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={sendDataToFlask}>Submit</button>
    </div>
  );
}

export default Login;