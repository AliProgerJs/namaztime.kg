import { dayjs } from "./dayjs";
import { TZ } from "../constants";

export const pad2 = (n: number) => String(n).padStart(2, "0");
export const fmt24 = (d: ReturnType<typeof dayjs> | null) => (d ? dayjs(d).tz(TZ).format("H:mm") : "—");
export const parseHm = (hm?: string | null) => {
  if (!hm) return null;
  const [h, m] = String(hm).trim().split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const base = dayjs().tz(TZ);
  return base.hour(h).minute(m).second(0).millisecond(0);
};
export const addMin = (d: ReturnType<typeof dayjs> | null, n: number) => (d ? dayjs(d).add(n, "minute") : null);
export const subMin = (d: ReturnType<typeof dayjs> | null, n: number) => (d ? dayjs(d).subtract(n, "minute") : null);
export const midpoint = (a: ReturnType<typeof dayjs> | null, b: ReturnType<typeof dayjs> | null) => (a && b ? dayjs(a).add(Math.floor(dayjs(b).diff(a, "minute") / 2), "minute") : null);
export const diffHMS = (to: ReturnType<typeof dayjs> | null) => {
  if (!to) return "";
  const now = dayjs().tz(TZ);
  let sec = Math.floor(dayjs(to).diff(now, "second"));
  if (sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}:${pad2(m)}:${pad2(s)}`;
};