// URL id param -> positive integer, or null if it's missing or not a valid id ("abc", "1.5", "-3").
export function parseId(param: string | undefined): number | null {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}
