import { createContext, useState, useContext } from "react";

// Create User Context
const UserContext = createContext();

// Custom Hook to Use Context
export const useUser = () => useContext(UserContext);

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};