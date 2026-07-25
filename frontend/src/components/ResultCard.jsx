import React from "react";

export default function ResultCard({ result }) {
    const initials = result.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const scoreColor =
        result.relevanceScore >= 80
            ? "#18B279"
            : result.relevanceScore >= 60
                ? "#D08B16"
                : "#D9534F";

    const badgeBackground =
        result.relevanceScore >= 80
            ? "#DDF5EA"
            : result.relevanceScore >= 60
                ? "#FFF3DD"
                : "#FCE4E4";

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.leftSection}>
                    <div
                        style={{
                            ...styles.avatar,
                            background: badgeBackground,
                            color: scoreColor,
                        }}
                    >
                        {initials}
                    </div>

                    <div>
                        <div style={styles.name}>{result.name}</div>

                        <div style={styles.subtitle}>
                            {result.title} • {result.company}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        ...styles.scoreBadge,
                        color: scoreColor,
                        background: badgeBackground,
                    }}
                >
                    {result.relevanceScore}
                </div>
            </div>

            <div style={styles.progressContainer}>
                <div
                    style={{
                        ...styles.progressFill,
                        width: `${result.relevanceScore}%`,
                        background: scoreColor,
                    }}
                />
            </div>

            <p style={styles.reason}>{result.matchReason}</p>

            <a
                href={result.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
            >
                View profile ↗
            </a>
        </div>
    );
}

const styles = {
    card: {
        background: "#FFFFFF",
        border: "1px solid #E8EBF4",
        borderRadius: "18px",
        padding: "15px",
        marginTop: "12px",
        boxShadow: "0 3px 12px rgba(15,23,42,.05)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
    },

    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flex: 1,
    },

    avatar: {
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 700,
        fontSize: "18px",
        flexShrink: 0,
    },

    name: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#1F2937",
        lineHeight: 1.2,
    },

    subtitle: {
        marginTop: "4px",
        color: "#6B7280",
        fontSize: "15px",
    },

    scoreBadge: {
        minWidth: "50px",
        height: "32px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "17px",
        flexShrink: 0,
    },

    progressContainer: {
        marginTop: "14px",
        marginBottom: "14px",
        height: "6px",
        background: "#E5E7EB",
        borderRadius: "999px",
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: "999px",
    },

    reason: {
        margin: 0,
        color: "#616B7C",
        fontSize: "16px",
        lineHeight: 1.5,
    },

    link: {
        display: "inline-block",
        marginTop: "18px",
        color: "#0B8A73",
        fontWeight: 600,
        fontSize: "15px",
        textDecoration: "none",
    },
};