import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === "/startup/create") {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: "/startup/create",
};
