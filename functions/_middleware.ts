export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);
    if (url.pathname === "/") {
      const acceptLanguage = context.request.headers.get("accept-language") || "";
      if (acceptLanguage.toLowerCase().includes("en")) {
        return Response.redirect(`${url.origin}/en/`, 302);
      }
      return Response.redirect(`${url.origin}/es/`, 302);
    }
    return context.next();
};
  
  