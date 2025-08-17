import { error as svelteError, redirect } from '@sveltejs/kit';
import { Effect, Exit, Cause, Layer, ConfigProvider, Context } from 'effect';
import { RedirectError } from './statuses/redirect';
import { DatabaseLive } from '../db';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const env = {
	...privateEnv,
	...publicEnv
};

export class AppConfig extends Context.Tag('AppConfig')<AppConfig, typeof env>() {}

const provider = ConfigProvider.fromMap(
	new Map(Object.entries(env)) as Map<string, string>
);

const AppLayerLive = Layer.mergeAll(
	DatabaseLive,
	Layer.effect(AppConfig, Effect.succeed(env))
);

type AppDependencies = Layer.Layer.Success<typeof AppLayerLive>;

export async function runAppEffect<Data, Failure>(
	effect: Effect.Effect<Data, Failure, AppDependencies>
) {
	const data = await Effect.runPromiseExit(
		Effect.provide(
			effect,
			AppLayerLive.pipe(Layer.provide(Layer.setConfigProvider(provider)))
		).pipe(
			Effect.tapErrorCause((e) => Effect.sync(() => console.error(Cause.pretty(e))))
		)
	);
	return data.pipe(
		Exit.match({
			onSuccess: (value) => value,
			onFailure: (error) => {
				if (Cause.isFailType(error)) {
					if (error.error instanceof RedirectError) {
						throw redirect(302, error.error.location);
					}
				}
				throw svelteError(500, error.toString());
			}
		})
	);
}
