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
        background: "linear-gradient(135deg, #f8fafc 0%, #fce7f3 100%)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "6px solid #EE2B69",
          borderTop: "6px solid #fce7f3",
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
          color: "#EE2B69",
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
