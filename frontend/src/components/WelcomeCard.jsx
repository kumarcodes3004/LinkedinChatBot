import React from "react";

const prompts = [
    {
        title: "Backend Engineers",
        description: "Find experienced Java & Spring Boot engineers",
        query: "Find Senior Backend Engineers skilled in Java Spring Boot Kafka",
        icon: "☕",
    },
    {
        title: "Frontend Engineers",
        description: "React, TypeScript and UI specialists",
        query: "Find Frontend Engineers skilled in React TypeScript",
        icon: "⚛️",
    },
    {
        title: "DevOps Engineers",
        description: "Kubernetes, AWS & Docker experts",
        query: "Find DevOps Engineers with Kubernetes AWS Docker",
        icon: "☁️",
    },
    {
        title: "Data Engineers",
        description: "Spark, Kafka & Airflow developers",
        query: "Find Data Engineers experienced in Spark Kafka Airflow",
        icon: "📊",
    },
];

export default function WelcomeCard({ onSuggestionClick }) {
    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <div style={styles.icon}>🤖</div>

                <h1 style={styles.title}>Engineer Finder AI</h1>

                <p style={styles.subtitle}>
                    Search engineering talent using natural language.
                    <br />
                    Just describe who you're looking for and our AI will find the best
                    matching engineers.
                </p>

                <div style={styles.badges}>
                    <Badge text="AI Powered" />
                    <Badge text="Natural Language Search" />
                    <Badge text="LinkedIn Discovery" />
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Quick Start</h2>

                <div style={styles.grid}>
                    {prompts.map((item) => (
                        <div
                            key={item.title}
                            style={styles.card}
                            onClick={() => onSuggestionClick(item.query)}
                        >
                            <div style={styles.cardIcon}>{item.icon}</div>

                            <div style={styles.cardTitle}>{item.title}</div>

                            <div style={styles.cardDescription}>
                                {item.description}
                            </div>

                            <button style={styles.button}>
                                Search →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.footerCard}>
                <div style={styles.footerTitle}>
                    💡 Example Prompt
                </div>

                <div style={styles.example}>
                    Find Software Engineers working at Microsoft with 5+ years experience
                    in Java, Spring Boot and Kafka.
                </div>
            </div>
        </div>
    );
}

function Badge({ text }) {
    return (
        <div style={styles.badge}>
            {text}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 40,
        padding: "20px 10px 40px",
    },

    hero: {
        background:
            "linear-gradient(135deg,#232D5B 0%,#3F51B5 50%,#4F6AE8 100%)",
        borderRadius: 28,
        padding: "60px 40px",
        color: "#FFFFFF",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(35,45,91,.18)",
    },

    icon: {
        fontSize: 70,
        marginBottom: 20,
    },

    title: {
        margin: 0,
        fontSize: 42,
        fontWeight: 700,
    },

    subtitle: {
        marginTop: 20,
        fontSize: 18,
        color: "#E5E9FF",
        lineHeight: 1.8,
    },

    badges: {
        display: "flex",
        justifyContent: "center",
        gap: 14,
        marginTop: 35,
        flexWrap: "wrap",
    },

    badge: {
        background: "rgba(255,255,255,.18)",
        border: "1px solid rgba(255,255,255,.2)",
        padding: "10px 18px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        backdropFilter: "blur(12px)",
    },

    section: {},

    sectionTitle: {
        fontSize: 28,
        fontWeight: 700,
        color: "#1F2937",
        marginBottom: 25,
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 22,
    },

    card: {
        background: "#FFFFFF",
        border: "1px solid #E8EDF7",
        borderRadius: 22,
        padding: 28,
        cursor: "pointer",
        transition: ".25s",
        boxShadow: "0 10px 30px rgba(15,23,42,.05)",
    },

    cardIcon: {
        fontSize: 34,
        marginBottom: 18,
    },

    cardTitle: {
        fontWeight: 700,
        fontSize: 22,
        color: "#172033",
        marginBottom: 12,
    },

    cardDescription: {
        color: "#667085",
        lineHeight: 1.7,
        minHeight: 48,
        marginBottom: 22,
    },

    button: {
        background: "#232D5B",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 12,
        padding: "12px 22px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
    },

    footerCard: {
        background: "#F8FAFD",
        border: "1px solid #E8EDF7",
        borderRadius: 20,
        padding: 30,
    },

    footerTitle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 18,
        color: "#172033",
    },

    example: {
        background: "#FFFFFF",
        border: "1px dashed #BFC8D9",
        borderRadius: 14,
        padding: 18,
        lineHeight: 1.8,
        color: "#475467",
        fontStyle: "italic",
        fontSize: 15,
    },
};