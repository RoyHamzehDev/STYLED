// Turns enum values into labels: "OUTERWEAR" -> "Outerwear".
export function formatEnum(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

// ISO date string from the API -> "Oct 27, 2026".
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
