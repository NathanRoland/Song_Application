import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { setUser } = useUser(); 
  const navigate = useNavigate();
  

  const sendDataToFlask = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/signup/user", {
        name: name,
        password: password,
        email: email
      });

      if (response.data.user){
        const newUser = { name: response.data.user,
          id: response.data.id };

        setUser(newUser);
        navigate("/account")
      }
      console.log(response.data)
      
    } catch (error) {
      console.error("Error sending data:", error);
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