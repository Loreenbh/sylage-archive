import { useEffect, useState } from "react";
import type { Silhouette } from "@/types/silhouette";
import { getSilhouetteData } from "@/lib/services/silhouette";
import type { User } from "@/types/user";

export function useSilhouettes(
  userId?: number,
  moodboardId?: number,
  from?: string,
) {
  const [silhouettes, setSilhouettes] = useState<Silhouette[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSilhouettes() {
      setIsLoading(true);

      try {
        const data = await getSilhouetteData(userId, moodboardId, from);
        if (cancelled) return;

        setSilhouettes(data.silhouettes);
        setUser(data.user);
      } catch {
        if (cancelled) return;

        setSilhouettes([]);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadSilhouettes();

    return () => {
      cancelled = true;
    };
  }, [userId, moodboardId, from]);

  return {
    silhouettes,
    user,
    isLoading,
    setSilhouettes,
  };
}
