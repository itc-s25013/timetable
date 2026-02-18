import SearchForm from "@/components/SearchForm";
import styles from "./page.module.css";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>時間割検索</h1>
        <p className={styles.desc}>学期・学年・学科を選択します。</p>

        <Suspense fallback={<div style={{ height: 420 }} />}>
          <SearchForm />
        </Suspense>
      </div>
    </main>
  );
}
