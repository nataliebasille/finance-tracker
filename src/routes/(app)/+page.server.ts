import { runAppEffect } from '$lib/server/effect';
import { Effect } from 'effect';

export const load = () => runAppEffect(Effect.succeed({}));
