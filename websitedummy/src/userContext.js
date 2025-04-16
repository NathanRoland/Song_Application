import { createContext, useState, useContext } from "react";

// Create User Context
const UserContext = createContext();

// Custom Hook to Use Context
export const useUser = () => useContext(UserContext);

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newData) => {
    setUser((prevUser) => ({ ...prevUser, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};