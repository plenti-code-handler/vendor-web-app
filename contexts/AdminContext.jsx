import { useState, createContext } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        imageUrl,
        setImageUrl,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
