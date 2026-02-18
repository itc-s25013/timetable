import type { TimetableSlot } from "@/lib/types";
import styles from "./TimetableTable.module.css";

const DAYS = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"] as const;
const TIMEZONES = ["午前", "午後"] as const;

function cellKey(day: string, timezone: string) {
  return `${day}__${timezone}`;
}

type Props = {
  slots: TimetableSlot[];
  selectedDay?: string;
  selectedTimezone?: string;
};

export default function TimetableTable({
  slots,
  selectedDay,
  selectedTimezone,
}: Props) {
  // 1枠（曜日×午前午後）につき1レコード想定。重複があれば最初だけ採用
  const map = new Map<string, TimetableSlot>();
  for (const s of slots) {
    const k = cellKey(s.day, s.timezone);
    if (!map.has(k)) map.set(k, s);
  }

  // 表示範囲：指定があれば絞る／なければ週表示
  const displayDays = selectedDay ? [selectedDay] : [...DAYS];
  const displayTimezones = selectedTimezone
    ? [selectedTimezone]
    : [...TIMEZONES];

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thDay}>曜日</th>
            {displayTimezones.map((tz) => (
              <th key={tz} className={styles.th}>
                {tz}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayDays.map((day) => (
            <tr key={day}>
              <td className={styles.tdDay}>{day}</td>

              {displayTimezones.map((tz) => {
                const slot = map.get(cellKey(day, tz));
                return (
                  <td key={tz} className={styles.td}>
                    {slot ? (
                      <div className={styles.cell}>
                        <div className={styles.subject}>{slot.subject}</div>
                        <div className={styles.meta}>{slot.teacher ?? "—"}</div>
                        <div className={styles.meta}>{slot.room ?? "—"}</div>
                      </div>
                    ) : (
                      <div className={styles.off}>休み</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
