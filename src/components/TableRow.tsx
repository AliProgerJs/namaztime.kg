import { fmt24, diffHMS } from "../lib/time";

export default function TableRow({
  name,
  start,
  iqama,
  end,
  active,
}: {
  name: string;
  start: any;
  iqama: any;
  end?: any;
  active?: boolean;
}) {
  return (
    <tr className={`transition-colors ${active ? "bg-[#99FF99]" : ""}`}>
      <td className="py-2 px-3 border">{name}</td>
      <td className="py-2 px-3 border text-right align-top">
        <div className="text-[18px] font-medium">{fmt24(start)}</div>
        <div className="text-[12px] text-red-600">{diffHMS(start)}</div>
      </td>
      <td className="py-2 px-3 border text-right align-top">
        <div className="text-[18px] font-medium">{fmt24(iqama)}</div>
        <div className="text-[12px] text-red-600">{diffHMS(iqama)}</div>
      </td>
    </tr>
  );
}
