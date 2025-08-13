import { Effect } from "effect";
import { db, schema } from "../db";
import { env } from '$env/dynamic/private';
import { httpStatus } from "../effect";
import { generateSessionToken, setSessionTokenCookie } from "./utils";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";

export const signIn = (event: RequestEvent, email: string) => Effect.gen(
  function* () {
    if (!env.WHITELISTED_EMAIL_ADDRESSES.split(",").includes(email)) {
      return yield* httpStatus.forbidden();
    }

    let user = yield* Effect.tryPromise(() => db.query.user.findFirst({ where: (users, { eq }) => eq(users.emailAddress, email) }));

    if (!user) {
      user = yield* Effect.tryPromise(() => db.insert(schema.user).values({ emailAddress: email }).returning().then(users => users[0]));
    }

    const sessionToken = generateSessionToken();
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));

    const session = yield* Effect.tryPromise(() => db.insert(schema.session).values({ id: sessionId, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) }).returning().then(sessions => sessions[0]));

    setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return session;
  }
)