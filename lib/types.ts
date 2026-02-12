// Phase3で型定義をここにまとめる
export type Timezone = "午前" | "午後";

export type Day = "月曜日" | "火曜日" | "水曜日" | "木曜日" | "金曜日";

export type Term = "I" | "II" | "III" | "IV";

export type Grade = "1学年" | "2学年" | "3学年";

export type TimetableSlot = {
  id: string;
  term: Term;
  department: string;
  grade: Grade;
  day: Day;
  timezone: Timezone;
  subject: string;
  teacher?: string;
  room?: string;
};
