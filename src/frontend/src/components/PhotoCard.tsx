import { Heart } from "lucide-react";
import type { Photo } from "../hooks/useFetchPhotos";

interface PhotoCardProps {
  photo: Photo;
  isFavourited: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export function PhotoCard({
  photo,
  isFavourited,
  onToggle,
  index,
}: PhotoCardProps) {
  return (
    <article
      data-ocid={`photo.card.${index}`}
      className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${(index - 1) * 40}ms` }}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={`https://picsum.photos/id/${photo.id}/600/400`}
          alt={`By ${photo.author}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          type="button"
          data-ocid={`photo.toggle.${index}`}
          onClick={() => onToggle(photo.id)}
          aria-label={
            isFavourited
              ? `Remove ${photo.author} from favourites`
              : `Add ${photo.author} to favourites`
          }
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/85 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={16}
            className={
              isFavourited
                ? "fill-heart stroke-heart"
                : "stroke-muted-foreground"
            }
            style={isFavourited ? { color: "oklch(var(--heart))" } : {}}
          />
        </button>
      </div>
      <div className="px-4 py-3">
        <p
          className="text-sm font-medium text-foreground truncate"
          title={photo.author}
        >
          {photo.author}
        </p>
      </div>
    </article>
  );
}
