const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getTutorToken() {
  try {
    const raw = localStorage.getItem("tutor");
    if (!raw) return null;
    const tutor = JSON.parse(raw);
    return tutor.authToken || null;
  } catch {
    return null;
  }
}

/**
 * Fail-closed approval check for the signed-in instructor account.
 * Publishing gates stay locked unless the stored account is explicitly approved.
 */
export function isTutorApproved() {
  try {
    if (typeof localStorage === "undefined") return false;
    const raw = localStorage.getItem("tutor");
    if (!raw) return false;
    return JSON.parse(raw)?.approved === true;
  } catch {
    return false;
  }
}

/** Mirror the server's approval decision into the stored instructor account. */
function applyTutorApproval(approved) {
  try {
    if (typeof localStorage === "undefined") return;
    const raw = localStorage.getItem("tutor");
    if (!raw) return;
    const tutor = JSON.parse(raw);
    if (tutor?.approved === approved) return;
    localStorage.setItem("tutor", JSON.stringify({ ...tutor, approved }));
  } catch {
    // Malformed or unavailable storage — leave it untouched.
  }
}

/**
 * Re-read the instructor's approval status so an admin decision applies on the
 * next page load instead of waiting for the tutor to log in again.
 * Returns the fresh boolean, or null when the check could not be completed
 * (offline, server error) so callers can keep the stored value.
 */
export async function syncTutorApproval() {
  if (!getTutorToken()) return null;

  try {
    // 404 (no profile yet) resolves to null, which counts as "not approved".
    const profile = await fetchMyTutorProfile();
    const approved = profile?.approved === true;
    applyTutorApproval(approved);
    return approved;
  } catch {
    return null;
  }
}


export async function uploadTutorProfile({
  fullName,
  headline,
  about,
  age,
  gender,
  nationality,
  profileImage,
  resume,
  certificates = [],
}) {
  const token = getTutorToken();
  if (!token) {
    throw new Error("You must be logged in as an instructor to submit your profile.");
  }

  const formData = new FormData();
  formData.append("fullName", fullName.trim());
  formData.append("headline", headline.trim());
  formData.append("about", about.trim());
  formData.append("age", String(age));
  formData.append("gender", gender);
  formData.append("nationality", nationality.trim());

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  if (resume) {
    formData.append("resume", resume);
  }

  if (certificates) {
    const certArray = Array.isArray(certificates) ? certificates : [certificates];
    for (const cert of certArray) {
      if (cert instanceof File) {
        formData.append("certificates", cert);
      }
    }
  }

  const response = await fetch(`${API_URL}/tutor-profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Do NOT set "Content-Type", fetch will set multipart/form-data boundary automatically.
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to create tutor profile.");
  }

  return data;
}


export async function fetchMyTutorProfile() {
  const token = getTutorToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/tutor-profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tutor profile.");
  }

  return data.profile;
}
