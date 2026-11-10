import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Image, FileText, Award } from "lucide-react";
import { toast } from "sonner";
import { isTutorAuthed } from "src/utils/authMock";
import { fetchMyTutorProfile } from "src/services/tutorProfile";
import TutorProfileForm from "src/components/tutor/TutorProfileForm";

export default function TutorProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("view");

  const { refreshBanner } = useOutletContext?.() || {};
  const navigate = useNavigate();
  
    const loadProfile = useCallback(async () => {
      try {
        const existing = await fetchMyTutorProfile();
        if (existing) {
          setProfileData(existing);
          setMode("view");
        } else {
          setMode("edit");
        }
      } catch {
        setMode("edit");
      } finally {
        setLoading(false);
        if (refreshBanner) refreshBanner();
      }
    }, [refreshBanner]);

  useEffect(() => {
    if (!isTutorAuthed()) {
      navigate("/", { replace: true });
      return;
    }

    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancel = () => {
    if (profileData) {
      setMode("view");
    }
  };

  const handleSuccess = async (newProfile) => {
    if (newProfile) setProfileData(newProfile);
    setMode("view");
    toast.success("Profile saved successfully!");
    try {
      const freshProfile = await fetchMyTutorProfile();
      if (freshProfile) setProfileData(freshProfile);
    } catch { /* ignore refresh failure */ }
    if (refreshBanner) refreshBanner();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-brand-strong mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">            
            {profileData
              ? "Manage your profile"
              : "Create your profile"
            }</h1>
        </div>
      </div>

      {profileData && mode === "view" && (
        <div className="card p-6">
          <div className="mb-6 flex items-start gap-6">
            <div className="h-20 w-20 flex-shrink-0 rounded-full bg-brand/10">
              {profileData.profileImage ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${profileData.profileImage}`}
                  alt={profileData.fullName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-heading font-semibold text-ink-strong">
                {profileData.fullName}
              </h2>
              <p className="text-body text-ink-muted mt-1">
                {profileData.headline}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Age:</span>
                  <span>{profileData.age}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Gender:</span>
                  <span>{profileData.gender}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Nationality:</span>
                  <span>{profileData.nationality}</span>
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {profileData?.approved === true ? (
                <div className="rounded-full bg-green-50 px-3 py-1">
                  <span className="text-xs font-medium text-green-700">Verified Instructor</span>
                </div>
              ) : (
                <div className="rounded-full bg-amber-50 px-3 py-1">
                  <span className="text-xs font-medium text-amber-700">Under Review</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-body-lg font-medium text-ink-strong mb-2">About</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {profileData.about}
              </p>
            </div>

            {(profileData.profileImage || profileData.resume) && (
              <div>
                <h3 className="text-body-lg font-medium text-ink-strong mb-3">Documents</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {profileData.profileImage && (
                    <a href={`${import.meta.env.VITE_API_URL}${profileData.profileImage}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft p-3 transition hover:border-brand hover:bg-tint-tutor">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand shadow-sm">
                        <Image size={20} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">Profile Image</p>
                        <p className="text-xs text-ink-muted">View / Download</p>
                      </div>
                    </a>
                  )}
                  {profileData.resume && (
                    <a href={`${import.meta.env.VITE_API_URL}${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft p-3 transition hover:border-brand hover:bg-tint-tutor">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand shadow-sm">
                        <FileText size={20} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">Resume</p>
                        <p className="text-xs text-ink-muted">View / Download</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {profileData.certificates && profileData.certificates.length > 0 && (
              <div>
                <h3 className="text-body-lg font-medium text-ink-strong mb-3">Certificates ({profileData.certificates.length})</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {profileData.certificates.map((cert, index) => (
                    <a key={cert.id || index} href={`${import.meta.env.VITE_API_URL}${cert.filePath}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft p-3 transition hover:border-brand hover:bg-tint-tutor">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand shadow-sm">
                        <Award size={16} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{cert.fileName}</p>
                        <p className="text-xs text-ink-muted">View / Download</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleEdit}
              className="btn-brand px-6 py-2"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="card p-6">
          <TutorProfileForm
            initialData={profileData}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
