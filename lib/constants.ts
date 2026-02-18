// lib/constants.ts

export type Term = "I" | "II" | "III" | "IV";
export type Grade = "1学年" | "2学年" | "3学年";
export type Day = "月曜日" | "火曜日" | "水曜日" | "木曜日" | "金曜日";
export type Timezone = "午前" | "午後";

// 学期
export const TERMS: Term[] = ["I", "II", "III", "IV"];

// 学年
export const GRADES: Grade[] = ["1学年", "2学年", "3学年"];

// 曜日・時間帯（任意）
export const DAYS: Day[] = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
export const TIMEZONES: Timezone[] = ["午前", "午後"];

// 学科（union型をあとで使う）
export const DEPARTMENTS_BY_GRADE = {
  "1学年": ["情報工学", "情報セキュリティ", "ゲームクリエイター"],
  "2学年": [
    "ITスペシャリスト",
    "サイバーセキュリティ",
    "ゲームCG",
    "ゲームプログラム",
  ],
  "3学年": ["ITスペシャリスト"],
} as const;

export type Department = (typeof DEPARTMENTS_BY_GRADE)[Grade][number];
