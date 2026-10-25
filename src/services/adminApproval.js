const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchPendingTutors() {
  const response = await fetch(`${API_URL}/admin-approve/pending`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch pending tutors.");
  }

  return data.tutors || [];
}

export async function approveTutor(id) {
  const response = await fetch(`${API_URL}/admin-approve/${id}/approve`, {
    method: "POST",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to approve tutor.");
  }

  return data;
}
