import { createContext, useState, useContext, useEffect } from "react";

// Create User Context
const UserContext = createContext();

// Custom Hook to Use Context
export const useUser = () => useContext(UserContext);

// Context Provider Component
export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // setUser wrapper to keep API the same
  const setUser = (newUser) => {
    setUserState(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};