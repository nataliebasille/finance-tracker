import { createGoogleOAuthClient } from "$lib/server/auth";
import { decodeIdToken } from "arctic";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { RequestEvent } from "./$types";
import type { OAuth2Tokens } from "arctic";
import { signIn } from "$lib/server/auth/sign-in";
import { Effect } from "effect";

export async function GET(event: RequestEvent): Promise<Response> {
  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");

  if (storedState === null || codeVerifier === null || code === null || state === null) {
    return new Response("Please restart the process.", {
      status: 400
    });
  }

  if (storedState !== state) {
    return new Response("Please restart the process.", {
      status: 400
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await Effect.runPromise(createGoogleOAuthClient(event)).then(client => client.validateAuthorizationCode(code, codeVerifier));
  } catch (e) {
    return new Response("Please restart the process.", {
      status: 400
    });
  }

  const claims = decodeIdToken(tokens.idToken()) as Record<string, string>;

  const googleId = claims["sub"];
  const email = claims["email"];

  await Effect.runPromise(signIn(event, email));

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/"
    }
  });
}

function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}

function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  };
  return session;
}

function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
  event.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    expires: expiresAt
  });
}