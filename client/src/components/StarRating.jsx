import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = ({ rating, size = "sm", interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const starSize =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-7 h-7";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} transition-colors ${
            star <= (interactive ? hovered || rating : rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          } ${interactive ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
