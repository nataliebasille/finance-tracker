import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { PgClient } from "@effect/sql-pg";
import * as schema from './schema';
import { Effect, Config, Context, Data, Layer, Redacted } from "effect";

const dbUrl = Config.redacted("DATABASE_URL")
const PgLive = PgClient.layerConfig({
  url: dbUrl,
  ssl: dbUrl.pipe(
    Config.map(Redacted.value),
    Config.map((url) =>
      url.includes("sslmode=require") ? true : undefined
    )
  )
});

const makeDrizzleDbEffect = () => PgDrizzle.make({ schema });

type AppRemoteDb = Effect.Effect.Success<ReturnType<typeof makeDrizzleDbEffect>>;

export { schema };

export class Db extends Context.Tag("Db")<
  Db,
  AppRemoteDb
>() { }

const DrizzleLive = Layer.scoped(
  Db,
  makeDrizzleDbEffect()
).pipe(Layer.provide(PgLive));

// Combine into one database layer
export const DatabaseLive = DrizzleLive;

export class SqlError extends Data.TaggedError("SqlError")<{
  cause: unknown;
}> { }

export function query<R>(sql: (db: AppRemoteDb) => Promise<R>) {
  return Effect.flatMap(Db, db =>
    Effect.tryPromise({
      try: () => sql(db),
      catch: cause => new SqlError({ cause })
    })
  );
}