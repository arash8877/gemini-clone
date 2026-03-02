import { useEffect, useState, createContext } from "react";
import { runChat } from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [retrySecondsLeft, setRetrySecondsLeft] = useState(0);

  useEffect(() => {
    if (retrySecondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setRetrySecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [retrySecondsLeft]);

  const formatResponse = (response) => {
    const responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    return newResponse.split("*").join("</br>");
  };

  const generateChatId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setPendingPrompt("");
    setActiveChatId(null);
  };

  const openChat = (chatId) => {
    const selectedChat = chats.find((chat) => chat.id === chatId);
    if (!selectedChat) return;

    setActiveChatId(chatId);

    const lastTurn = selectedChat.turns[selectedChat.turns.length - 1];
    if (!lastTurn) {
      setShowResult(false);
      setPendingPrompt("");
      return;
    }

    setShowResult(true);
    setPendingPrompt("");
  };

  const onSent = async (prompt) => {
    const activePrompt = prompt ?? input;
    if (!activePrompt?.trim()) return;
    if (retrySecondsLeft > 0) {
      setShowResult(true);
      return;
    }

    setLoading(true);
    setShowResult(true);
    setPendingPrompt(activePrompt);

    let chatId = activeChatId;
    if (!chatId) {
      chatId = generateChatId();
      setActiveChatId(chatId);
    }

    try {
      const currentChat = chats.find((chat) => chat.id === chatId);
      const currentTurns = currentChat?.turns ?? [];

      const response = await runChat(activePrompt, currentTurns);

      const updatedTurn = {
        prompt: activePrompt,
        response: formatResponse(response),
      };

      setChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex((chat) => chat.id === chatId);
        if (existingChatIndex === -1) {
          return [
            {
              id: chatId,
              title: activePrompt,
              turns: [updatedTurn],
            },
            ...prevChats,
          ];
        }

        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          turns: [...updatedChats[existingChatIndex].turns, updatedTurn],
        };
        return updatedChats;
      });
    } catch (error) {
      console.error("Gemini request failed:", error);
      const retryAfterSeconds = Number(error?.retryAfterSeconds);
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        setRetrySecondsLeft(Math.ceil(retryAfterSeconds));
      }

      const updatedTurn = {
        prompt: activePrompt,
        response: error?.message || "Failed to get a response from Gemini.",
      };

      setChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex((chat) => chat.id === chatId);
        if (existingChatIndex === -1) {
          return [
            {
              id: chatId,
              title: activePrompt,
              turns: [updatedTurn],
            },
            ...prevChats,
          ];
        }

        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          turns: [...updatedChats[existingChatIndex].turns, updatedTurn],
        };
        return updatedChats;
      });
    } finally {
      setPendingPrompt("");
      setLoading(false);
      setInput("");
    }
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const activeTurns = activeChat?.turns ?? [];

  const contextValue = {
    onSent,
    input,
    setInput,
    chats,
    openChat,
    activeTurns,
    pendingPrompt,
    showResult,
    loading,
    retrySecondsLeft,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
