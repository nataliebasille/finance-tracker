import { Google } from 'arctic';
import { PRIVATE_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { Effect } from 'effect';
import type { RequestEvent } from '@sveltejs/kit';

export const createGoogleOAuthClient = (event: RequestEvent) => {
  const url = new URL(event.request.url);
  return Effect.succeed(new Google(PUBLIC_GOOGLE_CLIENT_ID, PRIVATE_GOOGLE_CLIENT_SECRET, `${url.origin}/login/google/callback`));
}