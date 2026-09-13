import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { addCourseToWishlist, isCourseWishlisted } from "src/services/studentRepository";
import { isStudentAuthed } from "src/utils/authMock";

export default function WishlistHeartButton({
  courseId,
  title,
  onSave,
  onLoginClick,
  size = 18,
  withLabel = false,
  className = "",
}) {
  const numericId = Number(courseId);
  const [saved, setSaved] = useState(() => isCourseWishlisted(numericId));

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isStudentAuthed()) {
      try {
        sessionStorage.setItem(
          "ethiantech_login_return_to",
          window.location.pathname
        );
      } catch {
        // ignore storage failures (private mode, quota, etc.)
      }
      if (onLoginClick) onLoginClick();
      return;
    }
    addCourseToWishlist(numericId);
    setSaved(true);
    if (onSave) onSave();
  }

  const courseLabel = title || "course";

  return (
      <button
        type="button"
        onClick={saved ? undefined : handleClick}
        aria-label={
          saved ? "Saved to wishlist" : `Add ${courseLabel} to wishlist`
        }
        disabled={saved}
        className={`${className} select-none whitespace-nowrap`}
      >
        {saved ? (
          <Check size={size} className="fill-current text-current" aria-hidden="true" />
        ) : (
          <Heart size={size} className="text-current" aria-hidden="true" />
        )}
        {withLabel && <span>{saved ? "Saved to wishlist" : "Save to wishlist"}</span>}
      </button>
  );
}
