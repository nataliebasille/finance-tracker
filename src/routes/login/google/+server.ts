import { createGoogleOAuthClient } from '$lib/server/auth';
import { generateCodeVerifier, generateState } from 'arctic';

import { Effect } from 'effect';
import { runAppEffect } from '$lib/server/effect';

export const GET = (event) =>
	runAppEffect(
		Effect.gen(function* () {
			const state = generateState();
			const codeVerifier = generateCodeVerifier();
			const client = yield* createGoogleOAuthClient(event);
			const url = client.createAuthorizationURL(state, codeVerifier, [
				'openid',
				'profile',
				'email'
			]);

			event.cookies.set('google_oauth_state', state, {
				httpOnly: true,
				maxAge: 60 * 10,
				secure: import.meta.env.PROD,
				path: '/',
				sameSite: 'lax'
			});
			event.cookies.set('google_code_verifier', codeVerifier, {
				httpOnly: true,
				maxAge: 60 * 10,
				secure: import.meta.env.PROD,
				path: '/',
				sameSite: 'lax'
			});

			// Redirect to Google OAuth Endpoint
			return new Response(null, {
				status: 302,
				headers: {
					Location: url.toString()
				}
			});
		})
	);
