import type { TimetableSlot } from "./types";

type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

function mustEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export async function fetchTimetableSlots(params: {
  term: string;
  department: string;
  grade: string;
  day?: string;
  timezone?: string;
}): Promise<TimetableSlot[]> {
  //   console.log(params);
  const domain = mustEnv("MICROCMS_SERVICE_DOMAIN", serviceDomain);
  const key = mustEnv("MICROCMS_API_KEY", apiKey);

  // microCMS filters（and でつなぐ）
  const filters: string[] = [
    `term[contains]${params.term}`,
    `department[contains]${params.department}`,
    `grade[contains]${params.grade}`,
    // `term[contains]${params.term}`,
  ];

  if (params.day) filters.push(`day[contains]${params.day}`);
  if (params.timezone) filters.push(`timezone[contains]${params.timezone}`);

  const temp = filters.join("[and]");
  console.log(temp);
  const query = new URLSearchParams({
    filters: temp,
    limit: "100",
  });

  const url = `https://${domain}.microcms.io/api/v1/timetableslots?${query.toString()}`;

  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": key },
    // 最新を見たいのでキャッシュを切る（開発中おすすめ）
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `microCMS fetch failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  const data = (await res.json()) as MicroCMSListResponse<TimetableSlot>;

  console.log(data.contents);
  return data.contents;
}
