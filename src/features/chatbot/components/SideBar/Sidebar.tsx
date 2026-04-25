import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useState, useEffect, useRef } from "react";
import useChatBot from "../../Context/ChatBotContext";
import { FaTrashAlt, FaEllipsisV, FaPen, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearchOutline, IoWarningOutline } from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef(null);
  const sidebarRef = useRef(null);

  const {
    newChat,
    clearChatHistory,
    chatSessions,
    currentSessionId,
    loadSession,
    deleteSession,
    renameSession,
  } = useChatBot();

  useEffect(() => {
    function handleClickOutside(event) {
      const dropdowns = document.querySelectorAll('.dropdown-menu');
      let clickedInsideDropdown = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          clickedInsideDropdown = true;
        }
      });

      const menuButtons = document.querySelectorAll('.menu-btn');
      let clickedMenuButton = false;
      
      menuButtons.forEach(button => {
        if (button.contains(event.target)) {
          clickedMenuButton = true;
        }
      });

      if (!clickedInsideDropdown && !clickedMenuButton) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editingSession && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSession]);

  function handleSidebar() {
    setShowSidebar((show) => !show);
  }

  const handleNewChat = () => {
    newChat();
    toast.success("New chat started!", {
      duration: 3000,
      style: {
        background: "rgba(10, 15, 30, 0.95)",
        color: "#fff",
        border: "1px solid rgba(126, 227, 255, 0.3)",
        borderRadius: "12px",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      iconTheme: {
        primary: "#7ee3ff",
        secondary: "#060b1b",
      },
    });
  };

  const handleLoadSession = (sessionId) => {
    if (editingSession !== sessionId) {
      loadSession(sessionId);
    }
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    setActiveMenu(null);

    toast.custom(
      (t) => (
        <div className={`custom-toast ${t.visible ? "visible" : "hidden"}`}>
          <div className="toast-icon-wrapper">
            <IoWarningOutline size={28} className="toast-warning-icon" />
          </div>
          <div className="toast-body">
            <h3 className="toast-heading">Delete Chat</h3>
            <p className="toast-message">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>
          </div>
          <div className="toast-actions">
            <button
              className="toast-action-btn cancel-btn"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="toast-action-btn delete-btn"
              onClick={() => {
                deleteSession(sessionId);
                toast.dismiss(t.id);
                toast.success("Chat deleted successfully!", {
                  duration: 2000,
                  style: {
                    background: "rgba(10, 15, 30, 0.95)",
                    color: "#fff",
                    border: "1px solid rgba(100, 184, 131, 0.3)",
                    borderRadius: "12px",
                    padding: "16px",
                  },
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const startRenaming = (e, sessionId, currentTitle) => {
    e.stopPropagation();
    setActiveMenu(null);
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const saveRename = (sessionId) => {
    if (editTitle.trim() !== "") {
      const success = renameSession(sessionId, editTitle.trim());
      if (success) {
        toast.success("Chat renamed successfully!", {
          duration: 2000,
          style: {
            background: "rgba(10, 15, 30, 0.95)",
            color: "#fff",
            border: "1px solid rgba(126, 227, 255, 0.3)",
            borderRadius: "12px",
            padding: "16px",
          },
        });
      }
    }
    setEditingSession(null);
    setEditTitle("");
  };

  const cancelRename = () => {
    setEditingSession(null);
    setEditTitle("");
  };

  const handleKeyDown = (e, sessionId) => {
    if (e.key === "Enter") {
      saveRename(sessionId);
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  const toggleMenu = (e, sessionId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === sessionId ? null : sessionId);
  };

  const handleClearHistory = () => {
    toast.custom(
      (t) => (
        <div className={`custom-toast ${t.visible ? "visible" : "hidden"}`}>
          <div className="toast-icon-wrapper">
            <IoWarningOutline size={28} className="toast-warning-icon" />
          </div>
          <div className="toast-body">
            <h3 className="toast-heading">Clear All History</h3>
            <p className="toast-message">
              This will permanently delete all your conversations. This action
              cannot be undone.
            </p>
          </div>
          <div className="toast-actions">
            <button
              className="toast-action-btn cancel-btn"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="toast-action-btn delete-btn"
              onClick={() => {
                clearChatHistory();
                toast.dismiss(t.id);
                toast.success("All chats cleared!", {
                  duration: 2000,
                  style: {
                    background: "rgba(10, 15, 30, 0.95)",
                    color: "#fff",
                    border: "1px solid rgba(100, 184, 131, 0.3)",
                    borderRadius: "12px",
                    padding: "16px",
                  },
                });
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const filteredSessions = chatSessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const dateLabel = formatDate(session.createdAt);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(session);
    return groups;
  }, {});

  return (
    <div className={`sidebar ${showSidebar ? "open" : "closed"}`} ref={sidebarRef}>
      <Toaster position="top-center" />

      <div className="top">
        <div className={`header-section ${!showSidebar ? "mx-auto" : ""}`}>
          {showSidebar && (
            <div onClick={handleNewChat} className="new-chat-btn">
              <FaPen size={16} />
              <span>New Chat</span>
            </div>
          )}

          <img
            onClick={handleSidebar}
            className={`menu ${!showSidebar ? "mx-auto rotated" : ""}`}
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>

        {showSidebar && (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IoSearchOutline className="search-icon" size={18} />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>

            <div className="recent">
              <div className="recent-header">
                <p className="recent-title">Chats</p>
              </div>

              {filteredSessions.length > 0 ? (
                Object.entries(groupedSessions).map(([dateLabel, sessions]) => (
                  <div key={dateLabel} className="session-group">
                    <p className="date-label">{dateLabel}</p>
                    {sessions.map((session) => (
                      <div
                        onClick={() => handleLoadSession(session.id)}
                        className={`recent-entry ${
                          currentSessionId === session.id ? "active" : ""
                        } ${editingSession === session.id ? "editing" : ""}`}
                        key={session.id}
                      >
                        {editingSession === session.id ? (
                          <>
                            <input
                              ref={inputRef}
                              type="text"
                              className="rename-input"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, session.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="rename-actions">
                              <button
                                className="rename-btn save"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveRename(session.id);
                                }}
                                title="Save"
                              >
                                <FaCheck size={12} />
                              </button>
                              <button
                                className="rename-btn cancel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelRename();
                                }}
                                title="Cancel"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="session-title">{session.title}</p>

                            <div className="menu-container">
                              <button
                                className="menu-btn"
                                onClick={(e) => toggleMenu(e, session.id)}
                              >
                                <FaEllipsisV size={14} />
                              </button>

                              {activeMenu === session.id && (
                                <div className="dropdown-menu">
                                  <button
                                    className="menu-item"
                                    onClick={(e) =>
                                      startRenaming(e, session.id, session.title)
                                    }
                                  >
                                    <FaPen size={12} />
                                    <span>Rename</span>
                                  </button>
                                  <button
                                    className="menu-item delete"
                                    onClick={(e) =>
                                      handleDeleteSession(e, session.id)
                                    }
                                  >
                                    <FaTrashAlt size={12} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="no-recent">
                  {searchQuery ? "No matching chats" : "No chats yet"}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {showSidebar && (
        <div className="bottom">
          {chatSessions.length > 0 && (
            <div
              onClick={handleClearHistory}
              className="bottom-item recent-entry"
            >
              <button className="clear-history-btn" title="Clear all history">
                <FaTrashAlt size={14} />
              </button>
              <p>Clear All History</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;