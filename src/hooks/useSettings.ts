import useSWR from "swr";
import type { Settings } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<Settings>(
    "/api/settings",
    fetcher
  );
  return { settings: data, error, isLoading, mutate };
}
