import moment from "moment";

// UTC is used only as a formatting context for the supplied calendar fields.
export function formatWallClock(value: string | null | undefined, pattern: string) {
  return value ? moment.utc(value, moment.ISO_8601, true).format(pattern) : "";
}
