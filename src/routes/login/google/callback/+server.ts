import { createGoogleOAuthClient } from '$lib/server/auth';
import { decodeIdToken } from 'arctic';

import type { OAuth2Tokens } from 'arctic';
import { signIn } from '$lib/server/auth/sign-in';
import { Effect } from 'effect';
import { runAppEffect } from '$lib/server/effect';

export const GET = (event) =>
	runAppEffect(
		Effect.gen(function* () {
			const storedState = event.cookies.get('google_oauth_state') ?? null;
			const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
			const code = event.url.searchParams.get('code');
			const state = event.url.searchParams.get('state');

			if (
				storedState === null ||
				codeVerifier === null ||
				code === null ||
				state === null
			) {
				return new Response('Please restart the process.', {
					status: 400
				});
			}

			if (storedState !== state) {
				return new Response('Please restart the process.', {
					status: 400
				});
			}

			let tokens: OAuth2Tokens;
			try {
				const client = yield* createGoogleOAuthClient(event);
				tokens = yield* Effect.tryPromise(() =>
					client.validateAuthorizationCode(code, codeVerifier)
				);
			} catch {
				return new Response('Please restart the process.', {
					status: 400
				});
			}

			const claims = decodeIdToken(tokens.idToken()) as Record<string, string>;

			const email = claims['email'];

			yield* signIn(event, email);

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			});
		})
	);
