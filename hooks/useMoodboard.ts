import { useEffect, useState } from "react";
import type { Moodboard } from "@/types/moodboard";

export function useMoodboard(id?: number) {
  const [moodboard, setMoodboard] = useState<Moodboard | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setMoodboard(null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    async function loadMoodboard() {
      setIsLoading(true);
      setMoodboard(null);

      try {
        const res = await fetch(`/api/moodboards/${id}`);
        if (!res.ok) throw new Error("Unable to load moodboard");

        const data = (await res.json()) as Moodboard;
        if (!cancelled) setMoodboard(data);
      } catch {
        if (!cancelled) setMoodboard(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadMoodboard();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { moodboard, isLoading };
}
