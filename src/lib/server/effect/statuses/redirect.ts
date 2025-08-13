import { Data } from "effect";

export class RedirectError extends Data.TaggedError("Redirect")<{ location: string }> { }

export function redirect(status: number, location: string) {
  return new RedirectError({ location });
}
