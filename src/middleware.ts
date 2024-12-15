import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth) {
    const newUrl = new URL("/entrar", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // console.log("Rota permitida:", req.nextUrl.pathname);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|entrar).*)",
  ],
};
