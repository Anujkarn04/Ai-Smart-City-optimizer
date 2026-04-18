import { createContext, useContext, useState } from "react";

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  return (
    <PredictionContext.Provider value={{ history, setHistory }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictionContext = () => {
  return useContext(PredictionContext);
};
