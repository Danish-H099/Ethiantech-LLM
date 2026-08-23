/**
 * Standard person placeholder for missing/broken avatars
 * (downloaded asset — see DECISIONS.md → Placeholder assets).
 */
export const AVATAR_PLACEHOLDER = "/avatar-placeholder.png";

/** onError handler: swap a broken/missing portrait to the standard placeholder. */
export const avatarFallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = AVATAR_PLACEHOLDER;
};

/** onError handler: hide a broken image so its sized container surface shows. */
export const hideOnError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.style.display = "none";
};
