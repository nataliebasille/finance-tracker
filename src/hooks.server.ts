import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { runAppEffect } from '$lib/server/effect';
import { Effect } from 'effect';

const handleAuth: Handle = ({ event, resolve }) => {
	return runAppEffect(
		Effect.gen(function* () {
			const { token, session, user } = yield* auth.validateSessionToken(event);

			if (session) {
				auth.setSessionTokenCookie(event, token, session.expiresAt);
			} else {
				auth.deleteSessionTokenCookie(event);
			}

			event.locals.user = user;
			event.locals.session = session;

			return yield* Effect.tryPromise(() => Promise.resolve(resolve(event)));
		})
	);
};

export const handle: Handle = handleAuth;
