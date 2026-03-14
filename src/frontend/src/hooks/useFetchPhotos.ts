import { useEffect, useState } from "react";

export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface UseFetchPhotosResult {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

export function useFetchPhotos(): UseFetchPhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://picsum.photos/v2/list?limit=30");
        if (!response.ok) {
          throw new Error(`Failed to fetch photos (${response.status})`);
        }
        const data: Photo[] = await response.json();
        if (!cancelled) {
          setPhotos(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, loading, error };
}
