import React, { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (!trimmed || loading) return;

    onSend(trimmed);
    setText("");
  };

  return (
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input
              type="text"
              placeholder='e.g. "software engineer at razorpay"'
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.input}
              disabled={loading}
          />

          <button
              type="submit"
              disabled={loading || !text.trim()}
              style={{
                ...styles.button,
                ...(loading || !text.trim() ? styles.buttonDisabled : {}),
              }}
          >
            {loading ? (
                <span style={styles.loader}>...</span>
            ) : (
                <span style={styles.arrow}>↑</span>
            )}
          </button>
        </div>
      </form>
  );
}

const styles = {
  form: {
    padding: "14px 18px 18px",
    background: "#F8F9FD",
  },

  inputWrapper: {
    position: "relative",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 64px 15px 18px",
    borderRadius: "999px",
    border: "1px solid #E4E8F2",
    background: "#FFFFFF",
    fontSize: "15px",
    outline: "none",
    transition: "all .2s ease",
    boxShadow: "0 2px 8px rgba(15,23,42,.04)",
  },

  button: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",

    width: "46px",
    height: "46px",

    borderRadius: "50%",
    border: "none",

    background: "#232D5B",
    color: "#fff",

    cursor: "pointer",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "all .2s ease",
  },

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  arrow: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: 1,
  },

  loader: {
    fontWeight: 600,
    fontSize: "18px",
  },
};