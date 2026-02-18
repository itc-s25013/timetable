import SearchForm from "@/components/SearchForm";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div style={{ width: "100%", maxWidth: 860 }}>
        <h1 className={styles.title}>時間割検索</h1>
        <p className={styles.desc}>学期・学年・学科を選択します。</p>
        <SearchForm />
      </div>
    </main>
  );
}
