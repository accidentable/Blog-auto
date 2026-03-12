import useSWR from "swr";
import type { NewsItem } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNewsList(status?: string) {
  const params = status ? `?status=${status}` : "";
  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(
    `/api/news${params}`,
    fetcher
  );
  return { news: data ?? [], error, isLoading, mutate };
}

export function useNewsItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR<NewsItem>(
    id ? `/api/news/${id}` : null,
    fetcher
  );
  return { news: data, error, isLoading, mutate };
}
