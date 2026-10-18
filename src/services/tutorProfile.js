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
