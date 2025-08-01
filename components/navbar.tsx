import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, Github, GithubIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
                className="flex items-center"
              >
                <button type="submit" className="cursor-pointer">
                  <span className="max-sm:hidden text-default">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="submit" className="cursor-pointer">
                    <GithubIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Login With Github
                </TooltipContent>
              </Tooltip>

            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
