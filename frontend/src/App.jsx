import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

const API_BASE = "http://localhost:8080/api";

let idCounter = 0;
const nextId = () => ++idCounter;

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: "bot",
      type: "text",
      text: 'Hi! Tell me who you\'re looking for in plain English.\n\nExamples:\n• software engineer at Razorpay\n• backend engineers at Groww\n• senior java developers at JPMorgan Chase',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (userText) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "user",
        type: "text",
        text: userText,
      },
    ]);

    const loadingId = nextId();

    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "bot",
        type: "loading",
      },
    ]);

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      const results = [...(data.results || [])].sort(
          (a, b) => b.relevanceScore - a.relevanceScore
      );

      setMessages((prev) =>
          prev.map((m) =>
              m.id === loadingId
                  ? results.length > 0
                      ? {
                        ...m,
                        type: "results",
                        results,
                        companies: data.companies,
                        roleFilter: data.roleFilter,
                      }
                      : {
                        ...m,
                        type: "empty",
                        companies: data.companies,
                        roleFilter: data.roleFilter,
                      }
                  : m
          )
      );
    } catch (err) {
      setMessages((prev) =>
          prev.map((m) =>
              m.id === loadingId
                  ? {
                    ...m,
                    type: "error",
                    text: `Something went wrong: ${err.message}`,
                  }
                  : m
          )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={styles.page}>
        <div style={styles.chatWindow}>
          <header style={styles.header}>
            <div style={styles.logoContainer}>
              <div style={styles.logoCircle}>🎯</div>

              <div>
                <h1 style={styles.headerTitle}>Engineer Finder</h1>
                <p style={styles.headerSubtitle}>
                  Chat to scout public engineering talent
                </p>
              </div>
            </div>
          </header>

          <div style={styles.messageList} ref={scrollRef}>
            {messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSend}
                />
            ))}
          </div>

          <ChatInput
              onSend={handleSend}
              loading={loading}
          />
        </div>
      </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F6FB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  chatWindow: {
    width: "100%",
    maxWidth: "760px",
    height: "88vh",
    background: "#F8F9FD",
    borderRadius: "30px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(15,23,42,.12)",
  },

  header: {
    margin: "18px",
    marginBottom: "10px",
    background: "#232D5B",
    borderRadius: "24px",
    padding: "20px",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  logoCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    background: "rgba(255,255,255,.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  headerTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "36px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },

  headerSubtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#C9D0EA",
    fontSize: "15px",
  },

  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 18px 18px",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "thin",
  },
};