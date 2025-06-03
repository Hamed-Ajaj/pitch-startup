"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutBtn = () => {
  return (
    <button onClick={() => signOut({ redirectTo: "/" })}>
      <span>Logout</span>
    </button>
  );
};

export default LogoutBtn;
