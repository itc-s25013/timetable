"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./BackToSearchButton.module.css";

export default function BackToSearchButton() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => {
        const qs = params.toString();
        router.push(qs ? `/?${qs}` : "/");
      }}
    >
      検索に戻る
    </button>
  );
}
