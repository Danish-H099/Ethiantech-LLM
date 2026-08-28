import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist, isCourseWishlisted } from "src/data/studentRepository";
import { isStudentAuthed } from "src/utils/authMock";
export default function WishlistHeartButton({
  courseId,
  title,
  onToggle,
  onLoginClick,
  size = 18,
  withLabel = false,
  className = "",
}) {
  const numericId = Number(courseId);
  const [wishlisted, setWishlisted] = useState(() => isCourseWishlisted(numericId));

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onLoginClick && !isStudentAuthed()) {
      onLoginClick();
      return;
    }
    const result = toggleWishlist(numericId);
    setWishlisted(result.added);
    if (onToggle) onToggle(result.added, numericId);
  }

  const courseLabel = title || "course";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={wishlisted}
      aria-label={
        wishlisted
          ? `Remove ${courseLabel} from wishlist`
          : `Add ${courseLabel} to wishlist`
      }
      className={className}
    >
      <Heart size={size} className={wishlisted ? "fill-brand text-brand" : "text-ink-muted"} />
      {withLabel && (
        <span>
          {wishlisted ? "Saved to wishlist" : "Save to wishlist"}
        </span>
      )}
    </button>
  );
}
