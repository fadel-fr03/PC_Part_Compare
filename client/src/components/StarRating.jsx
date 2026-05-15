import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  size = "text-2xl",
  readOnly = false,
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const activeValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= activeValue;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`${size} transition ${
              readOnly ? "cursor-default" : "cursor-pointer"
            } ${active ? "text-yellow-400" : "text-white/20 hover:text-yellow-300"}`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}

      {!readOnly && (
        <span className="ml-2 text-sm text-white/60">
          {value ? `${value}/5` : "Select rating"}
        </span>
      )}
    </div>
  );
}