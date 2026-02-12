import type { TimetableSlot } from "@/lib/types";

const DAYS = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"] as const;
const TIMEZONES = ["午前", "午後"] as const;

function cellKey(day: string, timezone: string) {
  return `${day}__${timezone}`;
}

export default function TimetableTable({
  slots,
  selectedDay,
  selectedTimezone,
}: {
  slots: TimetableSlot[];
  selectedDay?: string;
  selectedTimezone?: string;
}) {
  // 1枠（曜日×午前午後）につき1レコードを想定
  const map = new Map<string, TimetableSlot>();
  for (const s of slots) {
    const k = cellKey(s.day, s.timezone);
    if (!map.has(k)) map.set(k, s);
  }

  // ★ ここが追加：表示範囲を検索条件で絞る
  const displayDays = selectedDay ? [selectedDay] : [...DAYS];
  const displayTimezones = selectedTimezone
    ? [selectedTimezone]
    : [...TIMEZONES];

  return (
    <table style={{ borderCollapse: "collapse", width: "100%", marginTop: 8 }}>
      <thead>
        <tr>
          <th
            style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}
          >
            曜日
          </th>

          {displayTimezones.map((tz) => (
            <th
              key={tz}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                textAlign: "left",
              }}
            >
              {tz}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {displayDays.map((day) => (
          <tr key={day}>
            <td
              style={{ border: "1px solid #ddd", padding: 12, fontWeight: 700 }}
            >
              {day}
            </td>

            {displayTimezones.map((tz) => {
              const s = map.get(cellKey(day, tz));
              return (
                <td
                  key={tz}
                  style={{
                    border: "1px solid #ddd",
                    padding: 12,
                    verticalAlign: "top",
                  }}
                >
                  {s ? (
                    <div style={{ lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700 }}>{s.subject}</div>
                      <div>{s.teacher ?? "—"}</div>
                      <div>{s.room ?? "—"}</div>
                    </div>
                  ) : (
                    <div>休み</div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
