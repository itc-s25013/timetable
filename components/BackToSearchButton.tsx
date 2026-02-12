"use client";

import { useRouter } from "next/navigation";

export default function BackToSearchButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/")}>
      検索に戻る
    </button>
  );
}
