import React from "react";
import FamilyTree from "./components/FamilyTree";

const App: React.FC = () => {
  return (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        background: "#5b7ad5",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#ffffff" }}>My Family Tree</h1>
      <FamilyTree />
    </div>
  );
};

export default App;
