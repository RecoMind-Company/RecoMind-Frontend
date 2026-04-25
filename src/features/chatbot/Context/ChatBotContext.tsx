import { createContext, useContext, useState, useEffect, useRef } from "react";
import { chatbotAPI } from "@/features/chatbot/services/chatbotAPI";

/* ─────────── Types ─────────── */
interface Message {
  id: string;
  type: "user" | "ai" | "error";
  content: string;
  timestamp: string;
  taskId?: string;
}

interface ConversationEntry {
  role: string;
  parts: { text: string }[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  conversationHistory: ConversationEntry[];
  createdAt: string;
  updatedAt: string;
}

interface ChatBotContextType {
  input: string;
  setInput: (v: string) => void;
  recentPrompt: string;
  setRecentPrompt: (prompt: string) => void;
  prevPrompts: string[];
  setPrevPrompts: () => void;
  showResult: boolean;
  setShowResult: (v: boolean) => void;
  handleSent: (promptText?: string) => Promise<void>;
  resultData: string;
  setResultData: (v: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  newChat: () => void;
  clearChatHistory: () => void;
  deletePrompt: (sessionId: string) => void;
  conversationHistory: ConversationEntry[];
  messages: Message[];
  setMessages: () => void;
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => boolean;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

function ChatBotContextProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("chatSessions");
    return saved ? (JSON.parse(saved) as ChatSession[]) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    const saved = localStorage.getItem("currentSessionId");
    return saved || null;
  });

  const currentSession =
    chatSessions.find((s) => s.id === currentSessionId) ?? null;
  const prevPrompts = chatSessions.map((s) => s.title);

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const animationRef = useRef<number | null>(null);

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

  const formatResponse = (text: string): string => {
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

    const newSession: ChatSession = {
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

  const renameSession = (sessionId: string, newTitle: string): boolean => {
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

  const loadSession = (sessionId: string) => {
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

  const deleteSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0]!.id);
      } else {
        setCurrentSessionId(null);
        setShowResult(false);
      }
    }
  };

  async function handleSent(promptText?: string) {
    const promptToSend = promptText ?? input;

    if (!promptToSend.trim()) {
      return;
    }

    // Get user info
    const user = JSON.parse(localStorage.getItem("user") ?? "{}") as {
      id?: string;
      role?: string;
    };
    const userId = user.id ?? "f8e05038-03ff-419a-b00c-1669c6be857c";
    const userRole = user.role ?? "admin";

    console.log("👤 User info:", { userId, userRole });

    // Create new session if needed
    if (!currentSessionId) {
      const newSession: ChatSession = {
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

    // Add user message
    const userMessage: Message = {
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
          const updatedSession: ChatSession = {
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
      console.log("📤 Sending message to API...");

      // Step 1: Create task
      const taskResponse = (await chatbotAPI.sendMessage(
        promptToSend,
        userId,
        userRole
      )) as { task_id?: string };

      console.log("✅ Task created:", taskResponse);

      if (taskResponse.task_id) {
        console.log("🎯 Task ID:", taskResponse.task_id);
        console.log("⏳ Starting to poll for response...");

        // Step 2: Wait for response with polling
        const finalResponse = (await chatbotAPI.waitForResponse(
          taskResponse.task_id,
          userId,
          userRole,
          promptToSend,
          (progressData: unknown) => {
            console.log("📈 Progress update:", progressData);
          }
        )) as {
          responseMessage?: string;
          result?: string;
          answer?: string;
        };

        console.log("✅ Final response received:", finalResponse);

        // Format the response message
        const aiResponseText = formatResponse(
          finalResponse.responseMessage ??
            finalResponse.result ??
            finalResponse.answer ??
            "Response received successfully!"
        );

        // Add AI message
        const aiMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          type: "ai",
          content: aiResponseText,
          timestamp: new Date().toISOString(),
          taskId: taskResponse.task_id,
        };

        // Update session with AI response
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
      } else {
        throw new Error("No task ID received from API");
      }
    } catch (error) {
      console.error("💥 Error in handleSent:", error);

      // Determine error message
      let errorText = "An error occurred. Please try again.";

      const err = error as {
        message?: string;
        response?: { status?: number };
      };

      if (err.message?.includes("timeout")) {
        errorText =
          "Request timeout. The server is taking too long to respond.  Please try again.";
      } else if (err.message?.includes("Network")) {
        errorText = "Network error. Please check your internet connection.";
      } else if (err.message?.includes("failed")) {
        errorText = err.message ?? errorText;
      } else if (err.response?.status === 400) {
        errorText = "Invalid request.  Please check your input and try again. ";
      } else if (err.response?.status === 401) {
        errorText = "Authentication error. Please log in again.";
      } else if (err.response?.status === 500) {
        errorText = "Server error. Please try again later.";
      } else if (err.message) {
        errorText = err.message;
      }

      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: "error",
        content: `
          <div style="padding: 16px; background: rgba(223, 93, 93, 0.1); border-left: 3px solid #df5d5d; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #df5d5d;"><strong>Error</strong></p>
            <p style="margin: 0; font-size: 14px;">${errorText}</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">Please try again.</p>
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

  const setRecentPrompt = (prompt: string) => {
    const session = chatSessions.find((s) =>
      s.title.includes(prompt.slice(0, 20))
    );
    if (session) {
      loadSession(session.id);
    }
  };

  const contextValue: ChatBotContextType = {
    input,
    setInput,
    recentPrompt: currentSession?.title ?? "",
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
    conversationHistory: currentSession?.conversationHistory ?? [],
    messages: currentSession?.messages ?? [],
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
