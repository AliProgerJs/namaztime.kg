import { dayjs } from "./dayjs";
import { API_BASE, TZ } from "../constants";

export type MuftiyatRow = {
  date?: string;
  fajr?: string; sunrise?: string; dhuhr?: string; asr?: string; sunset?: string; maghrib?: string; isha?: string; tahajjud?: string;
  [k: string]: unknown;
};

export function extractTimesFromApiPayload(payload: any): MuftiyatRow | null {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.prayertimes)
    ? payload.prayertimes
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.results)
    ? payload.results
    : payload?.days || payload?.items || [];
  if (!rows?.length) return null;
  const row = rows[0] as MuftiyatRow;

  const get = (obj: any, names: string[]) => {
    for (const n of names) {
      if (obj[n] != null) return obj[n];
      const k = Object.keys(obj).find((kk) => kk.toLowerCase() === n.toLowerCase());
      if (k) return (obj as any)[k];
    }
    return null;
  };

  return {
    fajr: get(row, ["fajr", "Фаджр", "Багымдат", "bagymdat"]) ?? undefined,
    sunrise: get(row, ["sunrise", "Восход", "Күн чыгуусу", "kun_chygyshy"]) ?? undefined,
    dhuhr: get(row, ["dhuhr", "Зухр", "Бешим", "beshim"]) ?? undefined,
    asr: get(row, ["asr", "Аср"]) ?? undefined,
    sunset: get(row, ["sunset", "Күн батыш", "kun_batyshy"]) ?? undefined,
    maghrib: get(row, ["maghrib", "Магриб", "Шам", "sham"]) ?? undefined,
    isha: get(row, ["isha", "Иша", "Куптан", "kuptan"]) ?? undefined,
    tahajjud: get(row, ["tahajjud", "Тахажжуд", "Тахаджуд"]) ?? undefined,
    date: (get(row, ["date", "Дата"]) as string) || dayjs().tz(TZ).format("YYYY-MM-DD"),
  };
}

export async function fetchMuftiyatFor(date = dayjs().tz(TZ)) {
  const ddmmyyyy = date.format("DD-MM-YYYY");
  const yyyymmdd = date.format("YYYY-MM-DD");
  const urls = [
    `${API_BASE}/ru/api/v1/calendar/1/?start=${ddmmyyyy}&end=${ddmmyyyy}`,
    `${API_BASE}/ru/api/v1/calendar/1/?start=${yyyymmdd}&end=${yyyymmdd}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const row = extractTimesFromApiPayload(data);
      if (row && (row.fajr || row.sunrise)) return row;
    } catch {}
  }
  return null;
}