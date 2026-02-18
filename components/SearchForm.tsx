"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./SearchForm.module.css";

import {
  TERMS,
  GRADES,
  DAYS,
  TIMEZONES,
  DEPARTMENTS_BY_GRADE,
  Term,
  Grade,
  Department,
  Day,
  Timezone,
} from "@/lib/constants";

type FieldErrors = {
  term?: string;
  grade?: string;
  department?: string;
};

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから初期値（検索条件保持）
  const initialTerm = searchParams.get("term") ?? "";
  const initialGrade = searchParams.get("grade") ?? "";
  const initialDepartment = searchParams.get("department") ?? "";
  const initialDay = searchParams.get("day") ?? "";
  const initialTimezone = searchParams.get("timezone") ?? "";

  const [term, setTerm] = useState<Term | "">(initialTerm as Term | "");
  const [grade, setGrade] = useState<Grade | "">(initialGrade as Grade | "");
  const [department, setDepartment] = useState<Department | "">(
    initialDepartment as Department | "",
  );
  const [day, setDay] = useState<Day | "">(initialDay as Day | "");
  const [timezone, setTimezone] = useState<Timezone | "">(
    initialTimezone as Timezone | "",
  );

  // 「必須項目です」出す用（最初から赤だらけにしない）
  const [touched, setTouched] = useState({
    term: false,
    grade: false,
    department: false,
  });

  // 学年に応じた学科候補
  const availableDepartments = useMemo<Department[]>(() => {
    if (!grade) return [];
    return [...DEPARTMENTS_BY_GRADE[grade]];
  }, [grade]);

  // 学年変更時：学科を自動調整（候補外ならリセット／候補1つなら自動選択）
  useEffect(() => {
    if (!grade) {
      setDepartment("");
      return;
    }

    if (availableDepartments.length === 1) {
      setDepartment(availableDepartments[0]);
      return;
    }

    if (department && !availableDepartments.includes(department)) {
      setDepartment("");
    }
  }, [grade, department, availableDepartments]);

  // 必須チェック
  const errors: FieldErrors = useMemo(() => {
    const e: FieldErrors = {};
    if (!term) e.term = "必須項目です";
    if (!grade) e.grade = "必須項目です";
    if (!department) e.department = "必須項目です";
    return e;
  }, [term, grade, department]);

  const canSearch = !errors.term && !errors.grade && !errors.department;

  function buildQuery() {
    const qs = new URLSearchParams();
    qs.set("term", term);
    qs.set("grade", grade);
    qs.set("department", department);
    if (day) qs.set("day", day);
    if (timezone) qs.set("timezone", timezone);
    return qs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 送信時は必須を全部表示
    setTouched({ term: true, grade: true, department: true });

    if (!canSearch) return;

    const qs = buildQuery();
    router.push(`/results?${qs.toString()}`);
  }

  function onReset() {
    setTerm("");
    setGrade("");
    setDepartment("");
    setDay("");
    setTimezone("");
    setTouched({ term: false, grade: false, department: false });
    router.push("/"); // URLも綺麗に
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* 学期 */}
      <div className={styles.field}>
        <label className={styles.label}>学期（必須）</label>
        <select
          className={styles.control}
          value={term}
          onChange={(e) => setTerm(e.target.value as Term)}
          onBlur={() => setTouched((t) => ({ ...t, term: true }))}
        >
          <option value="">選択してください</option>
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {touched.term && errors.term && (
          <p className={styles.error}>{errors.term}</p>
        )}
      </div>

      {/* 学年 */}
      <div className={styles.field}>
        <label className={styles.label}>学年（必須）</label>
        <select
          className={styles.control}
          value={grade}
          onChange={(e) => setGrade(e.target.value as Grade)}
          onBlur={() => setTouched((t) => ({ ...t, grade: true }))}
        >
          <option value="">選択してください</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {touched.grade && errors.grade && (
          <p className={styles.error}>{errors.grade}</p>
        )}
      </div>

      {/* 学科（学年連動） */}
      <div className={styles.field}>
        <label className={styles.label}>学科（必須）</label>
        <select
          className={styles.control}
          value={department}
          onChange={(e) => setDepartment(e.target.value as Department)}
          onBlur={() => setTouched((t) => ({ ...t, department: true }))}
          disabled={!grade}
        >
          <option value="">
            {!grade ? "先に学年を選択してください" : "選択してください"}
          </option>
          {availableDepartments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {touched.department && errors.department && (
          <p className={styles.error}>{errors.department}</p>
        )}
      </div>

      {/* 曜日（任意） */}
      <div className={styles.field}>
        <label className={styles.label}>曜日（任意）</label>
        <select
          className={styles.control}
          value={day}
          onChange={(e) => setDay(e.target.value as Day)}
        >
          <option value="">指定しない</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* 午前/午後（任意） */}
      <div className={styles.field}>
        <label className={styles.label}>午前 / 午後（任意）</label>
        <select
          className={styles.control}
          value={timezone}
          onChange={(e) => setTimezone(e.target.value as Timezone)}
        >
          <option value="">指定しない</option>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* ボタン */}
      <div className={styles.actions}>
        <button type="submit" disabled={!canSearch} className={styles.primary}>
          検索
        </button>

        <button type="button" onClick={onReset} className={styles.secondary}>
          リセット
        </button>
      </div>
    </form>
  );
}
