import TimetableTable from "@/components/TimetableTable";
import BackToSearchButton from "@/components/BackToSearchButton";
import { fetchTimetableSlots } from "@/lib/microcms";

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
  const term = searchParams.term;
  const department = searchParams.department;
  const grade = searchParams.grade;
  const day = searchParams.day;
  const timezone = searchParams.timezone;

  // 必須が無ければ案内（ここは今まで通り）
  if (!term || !department || !grade) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>検索結果</h1>
        <p style={{ marginTop: 8 }}>
          必須項目（学期・学科・学年）が不足しています。検索ページからやり直してください。
        </p>
        <div style={{ marginTop: 24 }}>
          <BackToSearchButton />
        </div>
      </main>
    );
  }

  // ① まず「必須3項目だけ」で存在チェック（ここがポイント）
  const baseSlots = await fetchTimetableSlots({
    term,
    department,
    grade,
  });

  // 必須3項目で0件なら、条件そのものが間違ってる（学科/学年の指定ミス等）
  if (baseSlots.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>検索結果</h1>

        <p style={{ marginTop: 8 }}>
          条件：{term} / {department} / {grade}
        </p>

        <div style={{ marginTop: 16 }}>
          <p>該当する時間割がありません。条件を変更して検索してください。</p>
        </div>

        <div style={{ marginTop: 24 }}>
          <BackToSearchButton />
        </div>
      </main>
    );
  }

  // ② 次に「任意条件（曜日・午前午後）」で絞った結果を取得
  //    → ここが0件でも「授業がない＝休み」なので、表は出す
  const slots = await fetchTimetableSlots({
    term,
    department,
    grade,
    day,
    timezone,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>検索結果</h1>

      <p style={{ marginTop: 8 }}>
        条件：{term} / {department} / {grade}
        {day ? ` / ${day}` : ""}
        {timezone ? ` / ${timezone}` : ""}
      </p>

      {/* 0件でも表は表示（=休み扱い） */}
      <div style={{ marginTop: 16 }}>
        <TimetableTable
          slots={slots}
          selectedDay={day}
          selectedTimezone={timezone}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <BackToSearchButton />
      </div>
    </main>
  );
}
