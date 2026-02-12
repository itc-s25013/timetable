"use client";

import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Phase3で必須チェック＋クエリ付き遷移にする
        router.push("/results");
      }}
    >
      <button type="submit">検索（仮）</button>
    </form>
  );
}
