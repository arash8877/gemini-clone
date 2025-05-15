import { createContext } from "react";
import runChat from "../config/gemini.js";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const onSent = async (prompt) => {
    await runChat(prompt);
  };
  onSent("Hello, how are you?");

  const contextValue = {};
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
