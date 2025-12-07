import "./main.css";
import { assets } from "../../assets/assets";
import { useChatBot } from "../../Context/ChatBotContext";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

function Main() {
  const { handleSent, setInput, input, showResult, loading, messages } =
    useChatBot();

  const messagesEndRef = useRef(null);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) {
        const closed = sidebar.classList.contains("closed");
        setIsSidebarClosed(closed);

        const main = document.querySelector(".main");
        if (main) {
          if (closed) {
            main.classList.add("sidebar-closed");
          } else {
            main.classList.remove("sidebar-closed");
          }
        }
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkSidebar();
    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(checkSidebar);
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const suggestionCards = [
    "What is the total revenue in 2014?",
    "Show me sales data for last quarter",
    "Analyze customer trends",
    "Generate monthly report",
  ];

  const handleCardClick = (cardText) => {
    setInput(cardText);
    handleSent(cardText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && input.trim()) {
      handleSent();
    }
  };

  const handleSendClick = () => {
    if (!loading && input.trim()) {
      handleSent();
    }
  };

  return (
    <main className="main">
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <h1>Hi, How Can I Help You?</h1>
            </div>
            <div className="suggestion-cards">
              {suggestionCards.map((card, index) => (
                <div
                  className="suggestion-card"
                  onClick={() => handleCardClick(card)}
                  key={index}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(card);
                    }
                  }}
                >
                  <p>{card}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.type}`}
              >
                {message.type === "user" ? (
                  <div className="user-message">
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                    <img src={assets.user_icon} alt="User" className="avatar" />
                  </div>
                ) : message.type === "error" ? (
                  <div className="ai-message error-message">
                    <img src={assets.ai_icon} alt="AI" className="avatar" />
                    <div className="message-content">
                      <p
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      ></p>
                    </div>
                  </div>
                ) : (
                  <div className="ai-message">
                    <img src={assets.ai_icon} alt="AI" className="avatar" />
                    <div className="message-content">
                      <p
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      ></p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message loading-message">
                <img src={assets.ai_icon} alt="AI" className="avatar" />
                <div className="skeleton-wrapper">
                  <div className="skeleton-line long"></div>
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line short"></div>
                  <p className="loading-text">Analyzing your question...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        <div
          className={`main-bottom ${isSidebarClosed ? "sidebar-closed" : ""}`}
        >
          <div className="search-box-wrapper">
            <div className="search-box">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  aria-label="Chat message input"
                />
              </form>
              {isMobile && (
                <>
                  <button
                    type="button"
                    className="icon-btn mic-btn"
                    aria-label="Voice input"
                  >
                    <FaMicrophone size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn send-btn"
                    onClick={handleSendClick}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <FaPaperPlane size={18} />
                  </button>
                </>
              )}
            </div>
            {!isMobile && (
              <>
                <button
                  type="button"
                  className="icon-btn mic-btn"
                  aria-label="Voice input"
                >
                  <FaMicrophone size={20} />
                </button>
                <button
                  type="button"
                  className="icon-btn send-btn"
                  onClick={handleSendClick}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                >
                  <FaPaperPlane size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;
