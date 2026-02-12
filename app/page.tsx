import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>時間割検索</h1>
      <p style={{ marginTop: 8 }}>学期・学科・学年を選んで検索します。</p>
      <div style={{ marginTop: 16 }}>
        <SearchForm />
      </div>
    </main>
  );
}
