import { Data } from "effect";

export class ForbiddenError extends Data.TaggedError("Forbidden") { }

export function forbidden() {
  return new ForbiddenError();
}
