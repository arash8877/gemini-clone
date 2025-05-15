import { createContext } from "react";
import runChat from "../config/gemini.js";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = ueState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = async (prompt) => {
    await runChat(prompt);
  };

  const contextValue = {
    onSent,
    input,
    setInput,
    prevPrompts,
    setPrevPrompts,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
  };


  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
