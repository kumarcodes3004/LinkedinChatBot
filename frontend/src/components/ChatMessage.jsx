import React from "react";
import ResultCard from "./ResultCard";

function parsedIntroText(companies, roleFilter) {
  const companyText =
      companies && companies.length > 0 ? companies.join(", ") : "that";

  return roleFilter
      ? `Searching for "${roleFilter}" at ${companyText}.`
      : `Searching for software engineers at ${companyText}.`;
}

export default function ChatMessage({ message, onSuggestionClick }) {
  const isUser = message.role === "user";
  const company = message.companies?.[0] || "Google";
  const role = message.roleFilter || "Software Engineer";

  const peerCompanies = {
    Adobe: ["Microsoft", "Salesforce"],
    Microsoft: ["Google", "Amazon"],
    Google: ["Microsoft", "Meta"],
    Amazon: ["Microsoft", "Google"],
    Netflix: ["Disney", "Amazon"],
    Uber: ["Lyft", "DoorDash"],
    Razorpay: ["PhonePe", "Cashfree"],
    Groww: ["Zerodha", "Upstox"],
    "JPMorgan Chase": ["Goldman Sachs", "Morgan Stanley"],
  };

  const alternatives =
      peerCompanies[company] || ["Microsoft", "Amazon"];

  const suggestions = [
    `Senior ${role} at ${company}`,
    `${role} at ${alternatives[0]}`,
    `${role} at ${alternatives[1]}`,
  ];

  return (
      <div
          style={{
            ...styles.row,
            justifyContent: isUser ? "flex-end" : "flex-start",
          }}
      >
        <div
            style={{
              ...styles.bubble,
              ...(isUser ? styles.userBubble : styles.botBubble),
            }}
        >
          {message.type === "text" && (
              <div style={styles.text}>{message.text}</div>
          )}

          {message.type === "loading" && (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>

                <div>
                  <div style={styles.loadingTitle}>Searching engineers...</div>

                  <div style={styles.loadingSubtitle}>
                    Looking across publicly available profiles
                  </div>
                </div>
              </div>
          )}

          {message.type === "error" && (
              <div style={styles.errorBox}>
                ⚠ {message.text}
              </div>
          )}

          {message.type === "results" && (
              <>
                <div style={styles.searchSummary}>
                  <div style={styles.summaryTitle}>
                    🎯 Search Summary
                  </div>

                  <div style={styles.summaryText}>
                    {parsedIntroText(
                        message.companies,
                        message.roleFilter
                    )}
                  </div>

                  <div style={styles.summaryCount}>
                    Found{" "}
                    <strong>{message.results.length}</strong>{" "}
                    matching profile
                    {message.results.length !== 1 ? "s" : ""}.
                  </div>
                </div>

                {message.results.map((result, index) => (
                    <ResultCard
                        key={index}
                        result={result}
                    />
                ))}

                <div style={styles.footerMessage}>
                  <div style={styles.footerTitle}>
                    🎉 Hope these recommendations are useful!
                  </div>

                  <div style={styles.footerText}>
                    You can continue exploring by searching for another company or engineering role.
                  </div>

                  <div style={styles.suggestionHeading}>
                    Try another search
                  </div>

                  <div style={styles.suggestionContainer}>
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            style={styles.suggestionChip}
                            onClick={() =>
                                onSuggestionClick?.(suggestion)
                            }
                        >
                          {suggestion}
                        </button>
                    ))}
                  </div>
                </div>
              </>
          )}

          {message.type === "empty" && (
              <div style={styles.emptyState}>
                <div style={styles.emptyTitle}>
                  😕 No matching profiles found
                </div>

                <div style={styles.emptyText}>
                  {parsedIntroText(
                      message.companies,
                      message.roleFilter
                  )}
                </div>

                <div style={styles.emptyHint}>
                  Try using the complete company name or a different role.
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

const styles = {
  row: {
    display: "flex",
    marginBottom: "14px",
  },

  bubble: {
    maxWidth: "82%",
    borderRadius: "18px",
    padding: "14px",
    fontSize: "16px",
    lineHeight: 1.6,
  },

  userBubble: {
    background: "#232D5B",
    color: "#fff",
    borderBottomRightRadius: "8px",
  },

  botBubble: {
    background: "#FFFFFF",
    border: "1px solid #ECEFF6",
    borderBottomLeftRadius: "8px",
    boxShadow: "0 3px 12px rgba(15,23,42,.04)",
  },

  text: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  searchSummary: {
    background: "#F6F9FF",
    border: "1px solid #E7EEF9",
    borderRadius: "18px",
    padding: "14px",
    marginBottom: "14px",
  },

  summaryTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1F2937",
    marginBottom: "10px",
  },

  summaryText: {
    color: "#5F6C80",
    fontSize: "14px",
    marginBottom: "10px",
  },

  summaryCount: {
    color: "#18B279",
    fontWeight: 600,
    fontSize: "15px",
  },

  loadingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  spinner: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "3px solid #E5E7EB",
    borderTop: "3px solid #18B279",
  },

  loadingTitle: {
    fontWeight: 600,
    color: "#1F2937",
  },

  loadingSubtitle: {
    fontSize: "14px",
    color: "#6B7280",
    marginTop: "3px",
  },

  errorBox: {
    color: "#B91C1C",
    background: "#FEF2F2",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #FECACA",
  },

  emptyState: {
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "18px",
    padding: "18px",
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#92400E",
    marginBottom: "10px",
  },

  emptyText: {
    color: "#6B7280",
    marginBottom: "10px",
  },

  emptyHint: {
    color: "#92400E",
    fontSize: "14px",
  },

  footerMessage: {
    marginTop: "20px",
    background: "#F8FAFC",
    border: "1px solid #E5EAF3",
    borderRadius: "18px",
    padding: "18px",
  },

  footerTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#1F2937",
    marginBottom: "8px",
  },

  footerText: {
    fontSize: "14px",
    color: "#667085",
    lineHeight: 1.6,
    marginBottom: "16px",
  },

  suggestionHeading: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#344054",
    marginBottom: "10px",
  },

  suggestionContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  suggestionChip: {
    background: "#EEF4FF",
    border: "1px solid #D6E4FF",
    borderRadius: "999px",
    padding: "9px 14px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#344054",
    cursor: "pointer",
    transition: "all .2s ease",
    outline: "none",
  }
};