// Zod's .partial() types fields as `T | undefined`, which Prisma rejects under exactOptionalPropertyTypes
type NoUndefined<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

export function stripUndefined<T extends object>(obj: T): NoUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as NoUndefined<T>;
}
