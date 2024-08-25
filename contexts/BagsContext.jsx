import { useState, createContext } from "react";

export const BagsContext = createContext();

export const BagsProvider = ({ children }) => {
  const [bags, setBags] = useState([]);
  const [filteredBags, setFilteredBags] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  return (
    <BagsContext.Provider
      value={{
        bags,
        lastVisible,
        filteredBags,
        setBags,
        setFilteredBags,
        setLastVisible,
      }}
    >
      {children}
    </BagsContext.Provider>
  );
};
