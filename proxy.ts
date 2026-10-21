import {getSessionCookie} from "better-auth/cookies";
import {NextRequest,NextResponse} from "next/server";

export function proxy(request:NextRequest){
 if(!getSessionCookie(request))return NextResponse.redirect(new URL(`/auth/sign-in?next=${encodeURIComponent(request.nextUrl.pathname+request.nextUrl.search)}`,request.url));
 return NextResponse.next();
}

export const config={matcher:["/study/:path*"]};

