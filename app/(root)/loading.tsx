import React from "react";

const loading = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "6px solid #6366f1",
          borderTop: "6px solid #e0e7ff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
         @keyframes spin {
           0% { transform: rotate(0deg);}
           100% { transform: rotate(360deg);}
         }
       `}</style>
      <div
        style={{
          marginTop: 24,
          color: "#6366f1",
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: 1,
        }}
      >
        Loading, please wait...
      </div>
    </div>
  );
};

export default loading;
