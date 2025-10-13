import React, { useEffect, useMemo, useState } from "react";
import TopBar from "./components/TopBar";
import Modal from "./components/Modal";
import ModeFlash from "./components/ModeFlash";
import TableRow from "./components/TableRow";
import { TZ } from "./constants";
import { dayjs } from "./lib/dayjs";
import { addMin, midpoint, parseHm, subMin, diffHMS, fmt24 } from "./lib/time";
import { fetchMuftiyatFor, extractTimesFromApiPayload } from "./lib/api";

export default function App() {
  const [mode, setMode] = useState<1 | 2>(1);
  const [flash, setFlash] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [now, setNow] = useState(dayjs().tz(TZ));
  const [cfg, setCfg] = useState(() => ({
    fajr: parseInt(localStorage.getItem("nt_iq_fajr") ?? "40", 10),
    maghrib: parseInt(localStorage.getItem("nt_iq_maghrib") ?? "3", 10),
    isha: parseInt(localStorage.getItem("nt_iq_isha") ?? "10", 10),
  }));

  useEffect(() => {
    localStorage.setItem("nt_iq_fajr", String(cfg.fajr));
    localStorage.setItem("nt_iq_maghrib", String(cfg.maghrib));
    localStorage.setItem("nt_iq_isha", String(cfg.isha));
  }, [cfg]);

  useEffect(() => {
    const t = setInterval(() => setNow(dayjs().tz(TZ)), 1000);
    return () => clearInterval(t);
  }, []);

  const [baseTimes, setBaseTimes] = useState<any | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      setError("");
      try {
        const data = await fetchMuftiyatFor();
        if (!data) throw new Error("empty");
        setBaseTimes(data);
      } catch (e) {
        setError("API убактылуу жеткиликсиз — демо убакыттар көрсөтүлдү.");
        setBaseTimes({
          fajr: "05:33",
          sunrise: "07:08",
          dhuhr: "12:49",
          asr: "16:45",
          sunset: "18:31",
          maghrib: "18:36",
          isha: "19:52",
          tahajjud: "01:55",
        });
      }
    })();
  }, []);

  const times = useMemo(() => {
    if (!baseTimes) return null;
    const fajr = parseHm(baseTimes.fajr);
    const sunrise = parseHm(baseTimes.sunrise);
    const dhuhr = parseHm(baseTimes.dhuhr);
    const asr = parseHm(baseTimes.asr);
    const sunset = parseHm(baseTimes.sunset);
    const maghrib = parseHm(baseTimes.maghrib);
    const isha = parseHm(baseTimes.isha);

    const tahajjudStart =
      parseHm(baseTimes.tahajjud) || (isha ? isha.clone() : null);
    const tahajjudEnd = fajr;

    const fajrIqama = sunrise ? subMin(sunrise, cfg.fajr) : null;
    const fajrEnd = sunrise;

    const sunriseEnd = sunrise ? addMin(sunrise, 5) : null;

    const zenithStart = dhuhr ? subMin(dhuhr, 10) : null;

    const ishroqStart = sunriseEnd ? addMin(sunriseEnd, 20) : null;
    const ishroqEnd = midpoint(sunrise, zenithStart);

    const duhaStart = ishroqEnd;
    const duhaEnd = zenithStart;

    const dhuhrIqama = dayjs().tz(TZ).hour(13).minute(40).second(0);
    const dhuhrEnd = asr;

    const asrIqama = asr ? addMin(asr, 10) : null;
    const asrEnd = sunset;

    const sunsetEnd = sunset ? addMin(sunset, 5) : null;

    const maghribIqama = maghrib ? addMin(maghrib, cfg.maghrib) : null;
    const maghribEnd = isha;

    const ishaIqama = isha ? addMin(isha, cfg.isha) : null;
    const ishaEnd = fajr;

    return {
      fajr: { start: fajr, iqama: fajrIqama, end: fajrEnd },
      sunrise: { start: sunrise, iqama: null, end: sunriseEnd },
      ishroq: { start: ishroqStart, iqama: null, end: ishroqEnd },
      duha: { start: duhaStart, iqama: null, end: duhaEnd },
      zenith: { start: zenithStart, iqama: null, end: dhuhr },
      dhuhr: { start: dhuhr, iqama: dhuhrIqama, end: dhuhrEnd },
      asr: { start: asr, iqama: asrIqama, end: asrEnd },
      sunset: { start: sunset, iqama: null, end: sunsetEnd },
      maghrib: { start: maghrib, iqama: maghribIqama, end: maghribEnd },
      isha: { start: isha, iqama: ishaIqama, end: ishaEnd },
      tahajjud: { start: tahajjudStart, iqama: null, end: tahajjudEnd },
    } as const;
  }, [baseTimes, cfg]);

  const currentKey = useMemo(() => {
    if (!times) return null;
    const order = [
      "tahajjud",
      "fajr",
      "sunrise",
      "ishroq",
      "duha",
      "zenith",
      "dhuhr",
      "asr",
      "sunset",
      "maghrib",
      "isha",
    ] as const;

    const nowM = now;
    for (const k of order) {
      const t = (times as any)[k];
      if (!t?.start) continue;
      const s = t.start;
      // используем end если есть, иначе iqama, иначе 30 мин «по умолчанию»
      const e = t.end || t.iqama || (s && s.add(30, "minute"));
      if (e && nowM.isAfter(s) && nowM.isBefore(e)) return k as string;
    }
    return null;
  }, [times, now]);

  const onToggleMode = () => {
    setMode((m) => (m === 1 ? 2 : 1));
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  if (!times)
    return (
      <div className="min-h-screen bg-[#E5E5E5] text-gray-900">
        <TopBar
          onToggleMode={onToggleMode}
          onOpenModal={() => setModalOpen(true)}
        />
        <div className="max-w-4xl mx-auto p-4 text-gray-600">
          Жүктөлүп жатат…{" "}
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-gray-900">
      <TopBar
        onToggleMode={onToggleMode}
        onOpenModal={() => setModalOpen(true)}
      />

      <main className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-3 items-start">
          <div className="text-xl font-semibold text-red-600">
            {now.format("DD.MM.YYYY")}
          </div>
          <h1 className="text-3xl font-bold text-[#0000FF] text-center">
            Бишкек намаз убактысы
          </h1>
          <div className="text-right text-xl font-semibold text-red-600">
            {now.format("HH:mm:ss")}
          </div>
        </div>

        {mode === 1 ? (
          <div className="mt-4 overflow-x-auto border border-gray-400">
            <table className="w-full border-collapse text-[18px] bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-3 border text-left text-[#1d3aa5] font-bold">
                    Аталышы
                  </th>
                  <th className="py-2 px-3 border text-right text-[#1d3aa5] font-bold">
                    Башы
                  </th>
                  <th className="py-2 px-3 border text-right text-[#1d3aa5] font-bold">
                    Аягы
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  name="Тахажжуд"
                  start={times.tahajjud.start}
                  iqama={times.tahajjud.end}
                  active={currentKey === "tahajjud"}
                />
                <TableRow
                  name="Фаҗр"
                  start={times.fajr.start}
                  iqama={times.fajr.end}
                  active={currentKey === "fajr"}
                />
                <TableRow
                  name="Күн чыгыш"
                  start={times.sunrise.start}
                  iqama={times.sunrise.end}
                  active={currentKey === "sunrise"}
                />
                <TableRow
                  name="Ишрок"
                  start={times.ishroq.start}
                  iqama={times.ishroq.end}
                  active={currentKey === "ishroq"}
                />
                <TableRow
                  name="Духа"
                  start={times.duha.start}
                  iqama={times.duha.end}
                  active={currentKey === "duha"}
                />
                <TableRow
                  name="Чак түш"
                  start={times.zenith.start}
                  iqama={times.zenith.end}
                  active={currentKey === "zenith"}
                />
                <TableRow
                  name="Зухр"
                  start={times.dhuhr.start}
                  iqama={times.dhuhr.iqama}
                  active={currentKey === "dhuhr"}
                />
                <TableRow
                  name="Аср"
                  start={times.asr.start}
                  iqama={times.asr.iqama}
                  active={currentKey === "asr"}
                />
                <TableRow
                  name="Күн батыш"
                  start={times.sunset.start}
                  iqama={times.sunset.end}
                  active={currentKey === "sunset"}
                />
                <TableRow
                  name="Магриб"
                  start={times.maghrib.start}
                  iqama={times.maghrib.iqama}
                  active={currentKey === "maghrib"}
                />
                <TableRow
                  name="Иша"
                  start={times.isha.start}
                  iqama={times.isha.iqama}
                  active={currentKey === "isha"}
                />
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border border-gray-400">
            <table className="w-full border-collapse text-[18px] bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-3 border text-left text-[#1d3aa5] font-bold">
                    Намаз
                  </th>
                  <th className="py-2 px-3 border text-right text-[#1d3aa5] font-bold">
                    Азан
                  </th>
                  <th className="py-2 px-3 border text-right text-[#1d3aa5] font-bold">
                    Икомат
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  name="Фаҗр"
                  start={times.fajr.start}
                  iqama={times.fajr.iqama}
                  active={currentKey === "fajr"}
                />
                <TableRow
                  name="Зухр"
                  start={times.dhuhr.start}
                  iqama={times.dhuhr.iqama}
                  active={currentKey === "dhuhr"}
                />
                <TableRow
                  name="Аср"
                  start={times.asr.start}
                  iqama={times.asr.iqama}
                  active={currentKey === "asr"}
                />
                <TableRow
                  name="Магриб"
                  start={times.maghrib.start}
                  iqama={times.maghrib.iqama}
                  active={currentKey === "maghrib"}
                />
                <TableRow
                  name="Иша"
                  start={times.isha.start}
                  iqama={times.isha.iqama}
                  active={currentKey === "isha"}
                />
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto p-4 text-xs text-gray-600">
        Дереккөз: Кыргызстан Муфтияты API · Локалдык убакыт: {TZ}
      </footer>

      <ModeFlash show={flash} label={mode === 1 ? "Кадимки" : "Мечит"} />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cfg={cfg}
        setCfg={setCfg}
      />
    </div>
  );
}
