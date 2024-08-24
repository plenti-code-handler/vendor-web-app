import { useState, createContext } from "react";

export const BagsContext = createContext();

export const BagsProvider = ({ children }) => {
  const [bags, setBags] = useState([]);
  const [filteredBookings, setFilteredBags] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  return (
    <BagsContext.Provider
      value={{
        bags,
        lastVisible,
        filteredBookings,
        setBags,
        setFilteredBags,
        setLastVisible,
      }}
    >
      {children}
    </BagsContext.Provider>
  );
};
