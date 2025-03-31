import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";


function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();  // Get user data from Context
    
    if (!user) {
      console.log("no data found")
    }
    else{
      console.log(user)
      console.log(user.name)
    }

  const sendDataToFlask = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/data", {
        name: name,
        age: age
      });

      // Redirect to Flask-provided URL
      window.location.href = response.data.redirect;
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
      <h1>Enter Your Details</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={sendDataToFlask}>Submit</button>
    </div>
  );
}

export default Home;