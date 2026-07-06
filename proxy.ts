import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protects the /admin area and keeps the Supabase session fresh.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If Supabase isn't configured yet, don't block anything.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = pathname === "/admin/login";

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
