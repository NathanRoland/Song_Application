import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import axios from "axios";
import { API_BASE_URL } from './config';

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const sendDataToFlask = async () => {
    try {
      console.log("🔐 Attempting login...");
      console.log("🌐 API URL:", `${API_BASE_URL}/login/user`);
      
      const response = await axios.post(`${API_BASE_URL}/login/user`, {
        name: name,
        password: password,
      });

      console.log("📡 Login response:", response.data);

      if (response.data.user) {
        // After login, fetch full account info
        const userId = response.data.id;
        const userName = response.data.user;
        
        console.log("👤 Fetching account info for user:", userName);
        const accountRes = await axios.post(`${API_BASE_URL}/account`, {
          name: userName,
          id: userId,
        });
        
        if (accountRes.data) {
          console.log("✅ Setting full user data");
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
          console.log("⚠️ Setting basic user data");
          setUser({ name: userName, id: userId });
        }
        navigate("/account");
      } else if (response.data.error) {
        console.error("❌ Login error:", response.data.error);
        alert(`Login failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error("❌ Error sending data:", error);
      console.error("❌ Error response:", error.response);
      
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Login failed: ${error.response.data.error}`);
      } else {
        alert("Login failed: Network error. Please try again.");
      }
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