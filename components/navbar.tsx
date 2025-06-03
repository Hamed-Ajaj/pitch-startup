import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoutBtn from "./ui/logout-button";
import { signIn } from "next-auth/react";
import LoginBtn from "./ui/login-button";

const Navbar = async () => {
  const session = await auth();
  console.log(session);
  return (
    <header className="px-5 py-3 shadow-sm font-work-sans bg-white">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src="/logo.png" alt="Logo" width={140} height={32} />
        </Link>
        <div className="flex items-center gap-5">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>
              <LogoutBtn />
              <Link href={`/user/${session?.user?.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <LoginBtn />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
