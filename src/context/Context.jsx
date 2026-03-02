import { useEffect, useState, createContext } from "react";
import {runChat} from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [retrySecondsLeft, setRetrySecondsLeft] = useState(0);

  useEffect(() => {
    if (retrySecondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setRetrySecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [retrySecondsLeft]);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    const activePrompt = prompt ?? input;
    if (!activePrompt?.trim()) return;
    if (retrySecondsLeft > 0) {
      setShowResult(true);
      setResultData(`Please wait ${retrySecondsLeft}s before sending another request.`);
      return;
    }

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      let response;
      if (prompt !== undefined) {
        response = await runChat(activePrompt);
        setRecentPrompt(activePrompt);
      } else {
        setPrevPrompts((prev) => [...prev, activePrompt]);
        setRecentPrompt(activePrompt);
        response = await runChat(activePrompt);
      }

      // remove the ** in the response
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      // remove the * in the response
      let newResponse2 = newResponse.split("*").join("</br>");

      // make type effect for the response
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Gemini request failed:", error);
      const retryAfterSeconds = Number(error?.retryAfterSeconds);
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        setRetrySecondsLeft(Math.ceil(retryAfterSeconds));
      }
      setResultData(error?.message || "Failed to get a response from Gemini.");
    } finally {
      setLoading(false);
      setInput("");
    }
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
    retrySecondsLeft,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
