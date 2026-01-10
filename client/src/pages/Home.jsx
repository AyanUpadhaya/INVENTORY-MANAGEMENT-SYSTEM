import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <h2>Welocome</h2>
      <p style={{ marginTop: "10px" }}>
        <Link to={"/login"}>Proceed Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f5fe",
  },
};

export default Home;
