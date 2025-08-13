import { effectLoader, httpStatus } from "$lib/server/effect";
import { Effect } from "effect";

export const load = effectLoader((event) => {
  return Effect.gen(function* () {
    if (event.locals.session === null || event.locals.user === null) {
      return yield* httpStatus.redirect(302, "/login");
    }

    return {
      user: event.locals.user
    };
  })
});