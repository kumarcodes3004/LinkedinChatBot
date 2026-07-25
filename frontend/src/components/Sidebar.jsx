import React from "react";

const recentSearches = [
    "Backend @ Razorpay",
    "Java @ Google",
    "SDE2 @ Microsoft",
];

export default function Sidebar() {
    return (
        <div style={styles.sidebar}>
            {/* Logo */}

            <div style={styles.logoSection}>
                <div style={styles.logo}>🎯</div>

                <div>
                    <div style={styles.title}>Engineer Finder</div>

                    <div style={styles.subtitle}>AI Recruiting</div>
                </div>
            </div>

            {/* Navigation */}

            <div style={styles.navSection}>
                <SidebarItem icon="🏠" text="Dashboard" active />

                <SidebarItem icon="🕘" text="Recent Searches" />

                <SidebarItem icon="⭐" text="Saved Profiles" />

                <SidebarItem icon="📈" text="Insights" />

                <SidebarItem icon="⚙️" text="Settings" />
            </div>

            {/* Recent */}

            <div style={styles.card}>
                <div style={styles.cardTitle}>
                    Recent Searches
                </div>

                {recentSearches.map((item) => (
                    <div
                        key={item}
                        style={styles.searchItem}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {/* AI */}

            <div style={styles.bottomCard}>
                <div style={styles.aiTitle}>
                    🤖 AI Assistant
                </div>

                <div style={styles.aiText}>
                    Search engineers using natural language.
                    <br />
                    <br />
                    Example:
                    <br />
                    "Senior Java Engineer at Adobe"
                </div>
            </div>
        </div>
    );
}

function SidebarItem({
                         icon,
                         text,
                         active = false,
                     }) {
    return (
        <div
            style={{
                ...styles.item,
                ...(active ? styles.activeItem : {}),
            }}
        >
            <span style={styles.icon}>{icon}</span>

            <span>{text}</span>
        </div>
    );
}

const styles = {
    sidebar: {
        width: "280px",
        background: "#FFFFFF",
        borderRight: "1px solid #E8EDF7",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    logo: {
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        background: "#232D5B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "24px",
        boxShadow: "0 10px 30px rgba(35,45,91,.18)",
    },

    title: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#232D5B",
    },

    subtitle: {
        fontSize: "13px",
        color: "#8A94A6",
        marginTop: "4px",
    },

    navSection: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    item: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 16px",
        borderRadius: "14px",
        cursor: "pointer",
        transition: ".2s",
        color: "#475467",
        fontWeight: 500,
    },

    activeItem: {
        background: "#EEF4FF",
        color: "#1F4BFF",
        fontWeight: 600,
    },

    icon: {
        fontSize: "18px",
    },

    card: {
        background: "#F8FAFD",
        border: "1px solid #E8EDF7",
        borderRadius: "18px",
        padding: "18px",
    },

    cardTitle: {
        fontWeight: 700,
        marginBottom: "16px",
        color: "#1F2937",
    },

    searchItem: {
        background: "#FFFFFF",
        padding: "10px 12px",
        borderRadius: "12px",
        marginBottom: "10px",
        fontSize: "14px",
        color: "#475467",
        border: "1px solid #EEF2F7",
        cursor: "pointer",
    },

    bottomCard: {
        marginTop: "auto",
        background:
            "linear-gradient(135deg,#232D5B,#4B63D3)",
        color: "#fff",
        borderRadius: "20px",
        padding: "20px",
    },

    aiTitle: {
        fontWeight: 700,
        fontSize: "18px",
        marginBottom: "14px",
    },

    aiText: {
        lineHeight: 1.6,
        fontSize: "14px",
        color: "#E7ECFF",
    },
};