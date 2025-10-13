import React, { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  cfg: { fajr: number; maghrib: number; isha: number };
  setCfg: React.Dispatch<
    React.SetStateAction<{ fajr: number; maghrib: number; isha: number }>
  >;
};

export default function Modal({ open, onClose, cfg, setCfg }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<"dalil" | "settings">("dalil");

  useEffect(() => {
    const onM = (e: MouseEvent) => {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onM);
    return () => document.removeEventListener("mousedown", onM);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative bg-white w-full max-w-2xl rounded shadow-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full bg-red-500 text-white"
        >
          ×
        </button>
        <div className="p-4 border-b flex gap-2">
          <button
            onClick={() => setTab("dalil")}
            className={`px-3 py-1 rounded ${
              tab === "dalil" ? "bg-gray-900 text-white" : "bg-gray-100"
            }`}
          >
            Далилдер
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-3 py-1 rounded ${
              tab === "settings" ? "bg-gray-900 text-white" : "bg-gray-100"
            }`}
          >
            Жɵндɵɵлɵр
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-auto text-sm leading-relaxed">
          {tab === "dalil" ? (
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                Бир жылдык намаз убактылары календары Кыргызстан муфтиятынын
                расмий сайтынан алынды;{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://muftiyat.kg/ru/calendar/?start=1-01-2025&end=31-12-2025"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль]
                </a>
              </li>
              <li>Тахажжуд убактысы - бул түндүн акыркы үчүнчү бөлүгү;</li>
              <li>
                Фажрдын парзы күндүн чыгуусуна 40 мүнөт калганда окулат
                (мустахаб);{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://islom.uz/vремyanamazov/27/11"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль1]
                </a>{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://al-isnad.kz/namaz/mustахab-vremya-fadzhr-namaza/"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль2]
                </a>
              </li>
              <li>Күндүн чыгышы жана батышы адатта 2-5 мүнөт созулат;</li>
              <li>
                Ишрок намазынын убактысы күн чыккандан 20 мүнөттөн кийин
                башталып;{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://azan.ru/maqalat/read/kogda-i-kak-sovershayutsya-zhelatelnyie-namazyi-v-techenie-дня-11050"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль1]
                </a>
                , күн чыгыш менен чак түштүн ортосуна чейинки аралык;{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://azan.ru/maqalat/read/kogda-i-kak-sovershayutsya-zhelatelnyie-namazyi-v-teченie-дня-11050"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль2]
                </a>
              </li>
              <li>
                Духа намазынын убактысы ишрок намзынын убактысы бүткөндөн баштап
                чак түшкө чейинки аралык;{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://azan.ru/maqalat/read/kogda-i-kak-sovershayutsya-зhelatelnyie-namazyi-v-teченie-дня-11050"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль]
                </a>
              </li>
              <li>
                Чак түштүн узундугу жөнүндө мүнөттөр менен айтуу туура эмес, бул
                чекит, ошондуктан этияттык менен 10 мүнөт көрсөтүлдү.
              </li>
              <li>
                Шам намазынын акыркы убактысы куптандын башталышына чейин.{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://youtu.be/9bOxgzeJEHg?si=6ubR08lZAgnBwwy9"
                  target="_blank"
                  rel="noreferrer"
                >
                  [Далиль]
                </a>
              </li>
            </ol>
          ) : (
            <div className="space-y-4 text-sm">
              <h3 className="text-lg font-semibold">Жɵндɵɵлɵр</h3>
              <p className="text-gray-700">
                Икомат аралыктарын (минут) кол менен белгилеңиз:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex flex-col gap-1">
                  <span>
                    Фажр:{" "}
                    <span className="text-xs text-gray-500">
                      мин. чейин Sunrise
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1"
                    value={cfg.fajr}
                    onChange={(e) =>
                      setCfg((c) => ({
                        ...c,
                        fajr: Math.max(0, parseInt(e.target.value || "0", 10)),
                      }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>
                    Магриб:{" "}
                    <span className="text-xs text-gray-500">
                      мин. кийин Азан
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1"
                    value={cfg.maghrib}
                    onChange={(e) =>
                      setCfg((c) => ({
                        ...c,
                        maghrib: Math.max(
                          0,
                          parseInt(e.target.value || "0", 10)
                        ),
                      }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>
                    Иша:{" "}
                    <span className="text-xs text-gray-500">
                      мин. кийин Азан
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1"
                    value={cfg.isha}
                    onChange={(e) =>
                      setCfg((c) => ({
                        ...c,
                        isha: Math.max(0, parseInt(e.target.value || "0", 10)),
                      }))
                    }
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Демейки маанилер: Фажр 40 (Sunrise-40), Магриб 3 (Азан+3), Иша
                10 (Азан+10). Маанилер localStorage'га сакталат.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
