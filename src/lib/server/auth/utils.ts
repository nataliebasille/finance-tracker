import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { query, schema } from '$lib/server/db';
import { Effect } from 'effect';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

export function createSession(token: string, userId: number) {
  return Effect.gen(function* () {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: schema.Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
    };
    yield* query((db) => db.insert(schema.session).values(session));
    return session;
  })
}

export function validateSessionToken(event: RequestEvent) {
  return Effect.gen(function* () {

    const token = event.cookies.get(sessionCookieName);
    if (!token) {
      return { token: null, session: null, user: null };
    }

    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const [result] = yield* query(db => db
      .select({
        // Adjust user table here to tweak returned data
        user: { id: schema.user.id, username: schema.user.emailAddress },
        session: schema.session
      })
      .from(schema.session)
      .innerJoin(schema.user, eq(schema.session.userId, schema.user.id))
      .where(eq(schema.session.id, sessionId)));

    if (!result) {
      return { token: null, session: null, user: null };
    }

    const { session, user } = result;

    const sessionExpired = Date.now() >= session.expiresAt.getTime();
    if (sessionExpired) {
      yield* query(db => db.delete(schema.session).where(eq(schema.session.id, session.id)));
      return { token: null, session: null, user: null };
    }

    const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
    if (renewSession) {
      session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
      yield* query(db =>
        db.update(schema.session)
          .set({ expiresAt: session.expiresAt })
          .where(eq(schema.session.id, session.id))
      );
    }

    return { token, session, user };
  })
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export function invalidateSession(sessionId: string) {
  return query(db => db.delete(schema.session).where(eq(schema.session.id, sessionId)));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(sessionCookieName, token, {
    expires: expiresAt,
    path: '/'
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(sessionCookieName, {
    path: '/'
  });
}
