import { ImageOff, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { PhotoCard } from "./components/PhotoCard";
import { useFetchPhotos } from "./hooks/useFetchPhotos";

// ── Favourites reducer ───────────────────────────────────────────────────────

type FavouritesAction = { type: "TOGGLE"; id: string };

function favouritesReducer(
  state: Set<string>,
  action: FavouritesAction,
): Set<string> {
  const next = new Set(state);
  if (next.has(action.id)) {
    next.delete(action.id);
  } else {
    next.add(action.id);
  }
  return next;
}

function initFavourites(): Set<string> {
  try {
    const raw = localStorage.getItem("favourites");
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {
    // ignore
  }
  return new Set<string>();
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [query, setQuery] = useState("");
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    initFavourites,
  );

  // Persist favourites to localStorage on every change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(Array.from(favourites)));
  }, [favourites]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleToggle = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", id });
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!query.trim()) return photos;
    const q = query.toLowerCase();
    return photos.filter((p) => p.author.toLowerCase().includes(q));
  }, [photos, query]);

  const favouriteCount = favourites.size;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Picsum
              </h1>
              <span className="hidden sm:block text-muted-foreground text-sm font-light">
                Gallery
              </span>
            </div>
            {favouriteCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                  ♥ {favouriteCount}{" "}
                  {favouriteCount === 1 ? "favourite" : "favourites"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              data-ocid="search.search_input"
              type="search"
              placeholder="Search by photographer..."
              value={query}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-shadow"
            />
          </div>
          {query && !loading && (
            <p className="mt-2 text-xs text-muted-foreground">
              {filteredPhotos.length === 0
                ? `No photos found for "${query}"`
                : `${filteredPhotos.length} photo${
                    filteredPhotos.length !== 1 ? "s" : ""
                  } by "${query}"`}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div
            data-ocid="gallery.loading_state"
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-border" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Loading photos…
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            data-ocid="gallery.error_state"
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <ImageOff size={24} className="text-destructive" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground mb-1">
                Failed to load photos
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            </div>
          </div>
        )}

        {/* Gallery grid */}
        {!loading &&
          !error &&
          (filteredPhotos.length === 0 ? (
            <div
              data-ocid="gallery.empty_state"
              className="flex flex-col items-center justify-center py-32 gap-3"
            >
              <p className="font-display text-xl text-muted-foreground">
                No results
              </p>
              <p className="text-sm text-muted-foreground">
                Try a different photographer name
              </p>
            </div>
          ) : (
            <div
              data-ocid="gallery.list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {filteredPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourited={favourites.has(photo.id)}
                  onToggle={handleToggle}
                  index={i + 1}
                />
              ))}
            </div>
          ))}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
