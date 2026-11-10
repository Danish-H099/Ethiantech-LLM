const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadTutorProfile({
  fullName, headline, about, age, gender, nationality,
  profileImage, resume, certificates = [],
}) {

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
    credentials: "include",
    headers: {
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
  const response = await fetch(`${API_URL}/tutor-profile/me`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile.");
  }

  return data.profile;
}
