import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaHome, FaUserCircle, FaCoins } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

const CommonHeader = ({ userName = "USER", coin = 0 }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.headerWrapper}>
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between">

  
          <Col xs="auto" className="d-flex align-items-center">
            <FaChevronLeft
              size={40}
              color="white"
              style={styles.icon}
              onClick={() => navigate(-1)}
            />
            <FaHome
              size={40}
              color="white"
              style={{ ...styles.icon, marginLeft: "15px" }}
              onClick={() => navigate("/")}
            />
          </Col>
          <Col xs="auto" className="d-flex align-items-center" style={{ gap: "18px" }}>
            <div style={styles.infoBox}>
              <FaUserCircle size={32} color="white" />
              <span style={styles.infoText}>{userName}</span>
            </div>

            <div style={{ ...styles.infoBox, background: "rgba(255, 215, 0, 0.25)" }}>
              <FaCoins size={30} color="#ffd700" />
              <span style={styles.infoText}>{coin}</span>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

const styles = {
  headerWrapper: {
    width: "100%",
    height: "80px",      
    padding: "0 15px",    
    display: "flex",
    alignItems: "center",
    background: "transparent",
    position: "relative",
    zIndex: 10,
  },

  icon: {
    cursor: "pointer",
  },

  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",                  
    padding: "8px 14px",       
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "15px",     
    border: "2px solid rgba(255,255,255,0.35)",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
  },

  infoText: {
    color: "white",
    fontWeight: "700",
    fontSize: "16px",           
    textShadow: "0 0 4px rgba(0,0,0,0.6)",
  },
};

export default CommonHeader;
