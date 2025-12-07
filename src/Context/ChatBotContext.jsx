import { createContext, useContext, useState, useEffect, useRef } from "react";
import { chatbotAPI } from "../services/chatbotAPI";

const ChatBotContext = createContext(undefined);

function ChatBotContextProvider({ children }) {
  const [input, setInput] = useState("");
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem("chatSessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem("currentSessionId");
    return saved || null;
  });

  const currentSession =
    chatSessions.find((s) => s.id === currentSessionId) || null;
  const prevPrompts = chatSessions.map((s) => s.title);

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const animationRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    }
  }, [currentSessionId]);

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatResponse = (text) => {
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
    formatted = formatted.replace(/\n/g, "<br />");
    formatted = formatted.replace(/###\s(.*?)(<br \/>|$)/g, "<h3>$1</h3>");
    formatted = formatted.replace(/##\s(.*?)(<br \/>|$)/g, "<h2>$1</h2>");
    formatted = formatted.replace(
      /```(.*?)```/gs,
      "<pre><code>$1</code></pre>"
    );
    formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");
    return formatted;
  };

  const newChat = () => {
    cancelAnimation();

    const newSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      messages: [],
      conversationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowResult(false);
    setInput("");
    setLoading(false);
    setResultData("");
  };

  const renameSession = (sessionId, newTitle) => {
    if (!newTitle || !newTitle.trim()) {
      return false;
    }

    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            title: newTitle.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      })
    );

    return true;
  };

  const loadSession = (sessionId) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      cancelAnimation();
      setCurrentSessionId(sessionId);
      setShowResult(session.messages.length > 0);
      setInput("");
      setLoading(false);
      setResultData("");
    }
  };

  const deleteSession = (sessionId) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        setCurrentSessionId(null);
        setShowResult(false);
      }
    }
  };

  async function handleSent(promptText) {
    const promptToSend = promptText || input;

    if (!promptToSend.trim()) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "f8e05038-03ff-419a-b00c-1669c6be857c";
    const userRole = user.role || "admin";

    if (!currentSessionId) {
      const newSession = {
        id: `session-${Date.now()}`,
        title:
          promptToSend.slice(0, 30) + (promptToSend.length > 30 ? "..." : ""),
        messages: [],
        conversationHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }

    cancelAnimation();
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const userMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: promptToSend,
      timestamp: new Date().toISOString(),
    };

    setChatSessions((prev) =>
      prev.map((session) => {
        if (
          session.id === currentSessionId ||
          (session.messages.length === 0 && !currentSessionId)
        ) {
          const updatedSession = {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: new Date().toISOString(),
          };

          if (session.messages.length === 0) {
            updatedSession.title =
              promptToSend.slice(0, 30) +
              (promptToSend.length > 30 ? "..." : "");
          }

          return updatedSession;
        }
        return session;
      })
    );

    try {
      console.log("Sending message to API:", {
        userID: userId,
        userRole: userRole,
        user_question: promptToSend,
      });

      const taskResponse = await chatbotAPI.sendMessage(
        promptToSend,
        userId,
        userRole
      );

      console.log("API Response:", taskResponse);

      let aiResponseText = "";

      if (taskResponse.status === "PENDING") {
        aiResponseText = `
          <div style="padding: 16px; background: rgba(126, 227, 255, 0.1); border-left: 3px solid #7ee3ff; border-radius: 8px;">
            <p style="margin: 0 0 8px 0;"><strong>Task Submitted Successfully!</strong></p>
            <p style="margin: 0; color: #7ee3ff;">Task ID: ${
              taskResponse.task_id
            }</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">Status: ${
              taskResponse.status
            }</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.8;">${
              taskResponse.message || "Your request is being processed."
            }</p>
          </div>
        `;
      } else {
        aiResponseText = formatResponse(
          taskResponse.result ||
            taskResponse.answer ||
            taskResponse.message ||
            "Response received successfully!"
        );
      }

      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        type: "ai",
        content: aiResponseText,
        timestamp: new Date().toISOString(),
        taskId: taskResponse.task_id,
      };

      setChatSessions((prev) =>
        prev.map((session) => {
          if (
            session.id === currentSessionId ||
            (prev[0] && !currentSessionId)
          ) {
            return {
              ...session,
              messages: [...session.messages, aiMessage],
              conversationHistory: [
                ...session.conversationHistory,
                {
                  role: "user",
                  parts: [{ text: promptToSend }],
                },
                {
                  role: "model",
                  parts: [{ text: aiResponseText }],
                },
              ],
              updatedAt: new Date().toISOString(),
            };
          }
          return session;
        })
      );
    } catch (error) {
      console.error("Error getting response:", error);

      const errorMessage = {
        id: `msg-${Date.now() + 1}`,
        type: "error",
        content: `
          <div style="padding: 16px; background: rgba(223, 93, 93, 0.1); border-left: 3px solid #df5d5d; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #df5d5d;"><strong>Error</strong></p>
            <p style="margin: 0; font-size: 14px;">${
              error.response?.data?.message ||
              error.message ||
              "Failed to send message"
            }</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">Please try again. </p>
          </div>
        `,
        timestamp: new Date().toISOString(),
      };

      setChatSessions((prev) =>
        prev.map((session) => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, errorMessage],
            };
          }
          return session;
        })
      );

      setResultData(errorMessage.content);
    } finally {
      setLoading(false);
      setInput("");
      setResultData("");
    }
  }

  const clearChatHistory = () => {
    cancelAnimation();
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem("chatSessions");
    localStorage.removeItem("currentSessionId");
    setShowResult(false);
    setInput("");
    setResultData("");
  };

  const setRecentPrompt = (prompt) => {
    const session = chatSessions.find((s) =>
      s.title.includes(prompt.slice(0, 20))
    );
    if (session) {
      loadSession(session.id);
    }
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt: currentSession?.title || "",
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts: () => {},
    showResult,
    setShowResult,
    handleSent,
    resultData,
    setResultData,
    loading,
    setLoading,
    newChat,
    clearChatHistory,
    deletePrompt: deleteSession,
    conversationHistory: currentSession?.conversationHistory || [],
    messages: currentSession?.messages || [],
    setMessages: () => {},
    chatSessions,
    currentSessionId,
    currentSession,
    loadSession,
    deleteSession,
    renameSession,
  };

  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
}

function useChatBot() {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error("useChatBot must be used within a ChatBotContextProvider");
  }
  return context;
}

export { ChatBotContextProvider, useChatBot };
export default useChatBot;
