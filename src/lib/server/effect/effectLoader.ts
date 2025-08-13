import { error as svelteError, redirect } from "@sveltejs/kit";
import { Effect, Exit, Cause } from "effect";
import { RedirectError } from "./statuses/redirect";

export function effectLoader<T, Data, Failure>(action: (event: T) => Effect.Effect<Data, Failure, never>) {
  return async (event: T) => {
    const data = await Effect.runPromiseExit(action(event));
    return data.pipe(Exit.match({
      onSuccess: (value) => value,
      onFailure: (error) => {
        if (Cause.isFailType(error)) {
          if (error.error instanceof RedirectError) {
            throw redirect(302, error.error.location);
          }
          throw svelteError(500, error.toString());
        }
      }
    }))
  }
}