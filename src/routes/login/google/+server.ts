import { createGoogleOAuthClient } from "$lib/server/auth";
import { generateCodeVerifier, generateState } from "arctic";

import type { RequestEvent } from "./$types";
import { Effect } from "effect";

export function GET(event: RequestEvent): Response {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = Effect.runSync(createGoogleOAuthClient(event)).createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  event.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: "/",
    sameSite: "lax"
  });
  event.cookies.set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: "/",
    sameSite: "lax"
  });

  // Redirect to Google OAuth Endpoint
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString()
    }
  });
}