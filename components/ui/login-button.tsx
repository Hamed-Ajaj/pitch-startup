"use client";
import { signIn } from "next-auth/react";
import React from "react";

const LoginBtn = () => {
  return <button onClick={() => signIn("github")}>Login</button>;
};

export default LoginBtn;
