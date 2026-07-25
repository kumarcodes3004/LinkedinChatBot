import React, { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RightPanel from "./components/RightPanel";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import WelcomeCard from "./components/WelcomeCard";

const API_BASE = "http://localhost:8080/api";

let idCounter = 0;
const nextId = () => ++idCounter;

export default function App() {
  const [messages, setMessages] = useState([]);
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

      const data = await res.json();

      const results = [...(data.results || [])].sort(
          (a, b) => b.relevanceScore - a.relevanceScore
      );

      setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== loadingId) return m;

            if (results.length === 0) {
              return {
                ...m,
                type: "empty",
                companies: data.companies,
                roleFilter: data.roleFilter,
              };
            }

            return {
              ...m,
              type: "results",
              results,
              companies: data.companies,
              roleFilter: data.roleFilter,
            };
          })
      );
    } catch (err) {
      setMessages((prev) =>
          prev.map((m) =>
              m.id === loadingId
                  ? {
                    ...m,
                    type: "error",
                    text: err.message,
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
        <Sidebar />

        <div style={styles.center}>
          <Header />

          <div style={styles.chatContainer}>
            <div ref={scrollRef} style={styles.chatArea}>
              {messages.length === 0 && (
                  <WelcomeCard onSuggestionClick={handleSend} />
              )}

              {messages.map((message) => (
                  <ChatMessage
                      key={message.id}
                      message={message}
                      onSuggestionClick={handleSend}
                  />
              ))}
            </div>

            <ChatInput loading={loading} onSend={handleSend} />
          </div>
        </div>

        <RightPanel />
      </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    background:
        "linear-gradient(180deg,#F8FAFD 0%,#EEF3FB 100%)",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    gap: "20px",
    overflow: "hidden",
  },

  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid #E6ECF5",
    boxShadow: "0 15px 40px rgba(15,23,42,.06)",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "32px",
    background: "#FAFBFE",
  },
};