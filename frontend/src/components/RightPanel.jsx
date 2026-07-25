import React from "react";

const suggestions = [
    "Backend Engineer @ Razorpay",
    "Java Developer @ Adobe",
    "Platform Engineer @ Uber",
    "Spring Boot @ Atlassian",
];

const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Razorpay",
    "Uber",
    "Adobe",
];

export default function RightPanel() {
    return (
        <div style={styles.container}>
            {/* AI */}

            <div style={styles.card}>
                <div style={styles.heading}>
                    🤖 AI Assistant
                </div>

                <div style={styles.description}>
                    Search public engineering profiles using natural language.
                </div>

                <div style={styles.status}>
                    <span style={styles.dot}></span>

                    Gemini Connected
                </div>
            </div>

            {/* Suggestions */}

            <div style={styles.card}>
                <div style={styles.heading}>
                    ✨ Suggested Searches
                </div>

                {suggestions.map((item) => (
                    <button
                        key={item}
                        style={styles.button}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Companies */}

            <div style={styles.card}>
                <div style={styles.heading}>
                    🏢 Popular Companies
                </div>

                <div style={styles.companyContainer}>
                    {companies.map((company) => (
                        <div
                            key={company}
                            style={styles.company}
                        >
                            {company}
                        </div>
                    ))}
                </div>
            </div>

            {/* How */}

            <div style={styles.card}>
                <div style={styles.heading}>
                    ⚡ How it Works
                </div>

                <Step
                    number="1"
                    text="Parse Natural Language"
                />

                <Step
                    number="2"
                    text="Search Public Profiles"
                />

                <Step
                    number="3"
                    text="Rank Candidates"
                />

            </div>

        </div>
    );
}

function Step({ number, text }) {
    return (
        <div style={styles.step}>
            <div style={styles.number}>
                {number}
            </div>

            <div>{text}</div>
        </div>
    );
}

const styles = {

    container:{

        width:"320px",

        padding:"28px 24px",

        background:"#FCFCFE",

        borderLeft:"1px solid #E7EDF7",

        overflowY:"auto"

    },

    card:{

        background:"#FFFFFF",

        padding:"20px",

        borderRadius:"18px",

        marginBottom:"18px",

        border:"1px solid #E8EDF7",

        boxShadow:"0 8px 24px rgba(15,23,42,.05)"

    },

    heading:{

        fontWeight:700,

        fontSize:"18px",

        marginBottom:"16px",

        color:"#172033"

    },

    description:{

        fontSize:"14px",

        color:"#667085",

        lineHeight:1.6,

        marginBottom:"16px"

    },

    status:{

        display:"inline-flex",

        alignItems:"center",

        gap:"8px",

        padding:"10px 14px",

        background:"#ECFFF5",

        borderRadius:"999px",

        fontSize:"14px",

        fontWeight:600,

        color:"#16A34A"

    },

    dot:{

        width:"10px",

        height:"10px",

        borderRadius:"50%",

        background:"#16A34A"

    },

    button:{

        width:"100%",

        padding:"12px",

        borderRadius:"12px",

        marginBottom:"10px",

        border:"1px solid #E8EDF7",

        background:"#F9FBFF",

        cursor:"pointer",

        fontSize:"14px",

        textAlign:"left"

    },

    companyContainer:{

        display:"flex",

        flexWrap:"wrap",

        gap:"10px"

    },

    company:{

        padding:"8px 14px",

        background:"#EEF4FF",

        borderRadius:"999px",

        fontSize:"13px",

        fontWeight:600,

        color:"#3559D7"

    },

    step:{

        display:"flex",

        alignItems:"center",

        gap:"14px",

        marginBottom:"18px"

    },

    number:{

        width:"32px",

        height:"32px",

        borderRadius:"50%",

        background:"#232D5B",

        color:"#fff",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        fontWeight:700

    }

};