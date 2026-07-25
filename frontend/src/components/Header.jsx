import React from "react";

export default function Header() {
    return (
        <div style={styles.header}>
            {/* Left */}

            <div>
                <div style={styles.heading}>
                    👋 Welcome Back
                </div>

                <div style={styles.subHeading}>
                    Search engineering talent using natural language.
                </div>
            </div>

            {/* Center */}

            <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>

                <input
                    style={styles.searchInput}
                    placeholder="Search company, role..."
                    disabled
                />
            </div>

            {/* Right */}

            <div style={styles.rightSection}>

                <div style={styles.status}>
                    <span style={styles.greenDot}></span>

                    AI Online
                </div>

                <div style={styles.notification}>
                    🔔
                </div>

                <div style={styles.avatar}>
                    KS
                </div>

            </div>
        </div>
    );
}

const styles = {

    header:{

        display:"flex",

        justifyContent:"space-between",

        alignItems:"center",

        marginBottom:"22px"

    },

    heading:{

        fontSize:"30px",

        fontWeight:700,

        color:"#172033"

    },

    subHeading:{

        marginTop:"6px",

        color:"#7C879A",

        fontSize:"15px"

    },

    searchBox:{

        width:"420px",

        height:"52px",

        background:"#FFFFFF",

        border:"1px solid #E7EBF5",

        borderRadius:"16px",

        display:"flex",

        alignItems:"center",

        padding:"0 18px",

        boxShadow:"0 6px 18px rgba(15,23,42,.04)"

    },

    searchIcon:{

        marginRight:"12px",

        fontSize:"18px"

    },

    searchInput:{

        flex:1,

        border:"none",

        outline:"none",

        fontSize:"15px",

        background:"transparent"

    },

    rightSection:{

        display:"flex",

        alignItems:"center",

        gap:"18px"

    },

    status:{

        display:"flex",

        alignItems:"center",

        gap:"8px",

        background:"#F2FFF7",

        color:"#18B279",

        padding:"10px 16px",

        borderRadius:"999px",

        border:"1px solid #DDF5EA",

        fontWeight:600,

        fontSize:"14px"

    },

    greenDot:{

        width:"10px",

        height:"10px",

        borderRadius:"50%",

        background:"#18B279"

    },

    notification:{

        width:"46px",

        height:"46px",

        background:"#FFFFFF",

        borderRadius:"14px",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        cursor:"pointer",

        border:"1px solid #ECEFF5",

        boxShadow:"0 5px 15px rgba(15,23,42,.05)",

        fontSize:"20px"

    },

    avatar:{

        width:"48px",

        height:"48px",

        borderRadius:"50%",

        background:"#232D5B",

        color:"#fff",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        fontWeight:700,

        fontSize:"16px",

        boxShadow:"0 8px 20px rgba(35,45,91,.20)"

    }

};