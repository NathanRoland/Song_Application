import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Account from "./Account";
import Search from "./Search";
import { UserProvider } from "./userContext";


function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
