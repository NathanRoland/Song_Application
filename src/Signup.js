import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import axios from "axios";
import { API_BASE_URL } from './config';

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { setUser } = useUser(); 
  const navigate = useNavigate();
  

  const sendDataToFlask = async () => {
    try {
      console.log("📝 Attempting signup...");
      console.log("🌐 API URL:", `${API_BASE_URL}/signup/user`);
      
      const response = await axios.post(`${API_BASE_URL}/signup/user`, {
        name: name,
        password: password,
        email: email
      });

      console.log("📡 Signup response:", response.data);

      if (response.data.user){
        console.log("✅ Signup successful");
        const newUser = { name: response.data.user,
          id: response.data.id };

        setUser(newUser);
        navigate("/account")
      } else if (response.data.error) {
        console.error("❌ Signup error:", response.data.error);
        alert(`Signup failed: ${response.data.error}`);
      }
      
    } catch (error) {
      console.error("❌ Error sending data:", error);
      console.error("❌ Error response:", error.response);
      
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Signup failed: ${error.response.data.error}`);
      } else {
        alert("Signup failed: Network error. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Signup as a user</h1>
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
      <input
        type="text"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendDataToFlask}>Submit</button>

    </div>
  );
}

export default Signup;