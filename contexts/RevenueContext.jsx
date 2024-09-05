"use client";
import { useState, createContext } from "react";

export const RevenueContext = createContext();

export const RevenueProvider = ({ children }) => {
  const [balance, setBalance] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  return (
    <RevenueContext.Provider
      value={{
        balance,
        setBalance,
        withdrawals,
        setWithdrawals,
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
};
