import TimetableTable from "@/components/TimetableTable";
import BackToSearchButton from "@/components/BackToSearchButton";
import { fetchTimetableSlots } from "@/lib/microcms";
import styles from "./results.module.css";

type Props = {
  searchParams: {
    term?: string;
    department?: string;
    grade?: string;
    day?: string;
    timezone?: string;
  };
};

export default async function ResultsPage({ searchParams }: Props) {
  const { term, department, grade, day, timezone } = searchParams;

  // 必須が無ければ案内（ここはエラーでOK）
  if (!term || !department || !grade) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>検索結果</h1>
          <p className={styles.desc}>
            必須項目（学期・学年・学科）が不足しています。検索ページからやり直してください。
          </p>
          <div className={styles.actions}>
            <BackToSearchButton />
          </div>
        </div>
      </main>
    );
  }

  // ① 必須3つだけで存在チェック（ここがポイント）
  const baseSlots = await fetchTimetableSlots({
    term,
    department,
    grade,
  });

  // 必須3つで0件なら「条件そのものが間違い」なのでエラー表示
  if (baseSlots.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>検索結果</h1>
          <p className={styles.desc}>
            条件：{term} ／ {grade} ／ {department}
          </p>
          <p className={styles.noResult}>
            該当する時間割がありません。条件を変更して検索してください。
          </p>
          <div className={styles.actions}>
            <BackToSearchButton />
          </div>
        </div>
      </main>
    );
  }

  // ② 任意条件（曜日・午前午後）で絞る
  //    → ここが0件でも「授業がない＝休み」なので表は出す
  const slots = await fetchTimetableSlots({
    term,
    department,
    grade,
    day,
    timezone,
  });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>検索結果</h1>

        <p className={styles.desc}>
          条件：{term} ／ {grade} ／ {department}
          {day && ` ／ ${day}`}
          {timezone && ` ／ ${timezone}`}
        </p>

        {/* ✅ 0件でも必ず表を表示（=休みになる） */}
        <div className={styles.tableArea}>
          <TimetableTable
            slots={slots}
            selectedDay={day}
            selectedTimezone={timezone}
          />
        </div>

        <div className={styles.actions}>
          <BackToSearchButton />
        </div>
      </div>
    </main>
  );
}
