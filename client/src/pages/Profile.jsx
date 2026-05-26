import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { generateAvatarUrl, INTENT_CONFIG, MOOD_CONFIG } from "../utils/constants";
import "./Profile.css";

const INTERESTS_LIST = [
  "Music", "Travel", "Cooking", "Fitness", "Reading", "Movies", "Photography",
  "Art", "Gaming", "Yoga", "Hiking", "Dancing", "Coding", "Fashion", "Sports",
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location?.city || "",
    intents: user?.intents || [],
    interests: user?.interests || [],
    mood: user?.mood || "chill",
    emergencyContact: user?.emergencyContact || "",
    availability: user?.availability || { now: false, tonight: false, weekend: false },
  });

  const toggleItem = (field, val) => {
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(val) ? p[field].filter((i) => i !== val) : [...p[field], val],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/update-profile", form);
      updateUser(res.data);
      setEditing(false);
      toast.success("Profile updated! ✅");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  // Profile completion score
  const completionFields = [
    !!user.name,
    !!user.bio,
    !!user.location?.city,
    (user.intents?.length || 0) > 0,
    (user.interests?.length || 0) > 0,
    !!user.profilePhoto,
    !!user.emergencyContact,
    !!user.mood,
  ];
  const completionScore = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  const missingField = !user.bio ? "Add a bio" : !user.location?.city ? "Add your city" : !(user.intents?.length) ? "Set your intents" : !(user.interests?.length) ? "Add interests" : null;

  return (
    <div className="page profile-page">
      <div className="container profile-container">
        {/* Left column */}
        <div className="profile-left">
          <div className="profile-hero-card card">
            <div className="profile-avatar-wrap">
              <img
                src={user.profilePhoto || generateAvatarUrl(user.name)}
                alt={user.name}
                className="profile-avatar"
              />
              <button className="avatar-edit-btn">📷</button>
            </div>
            <h2 className="profile-hero-name">
              {user.name}
              {user.isVerified && <span className="badge badge-verified" style={{ fontSize: "0.7rem" }}>✓ Verified</span>}
              {user.isPremium && <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>⭐ Premium</span>}
            </h2>
            <p className="profile-hero-sub">{user.age && `${user.age} years`}{user.location?.city && ` • ${user.location.city}`}</p>
            {user.bio && <p className="profile-hero-bio">{user.bio}</p>}

            {/* Completion bar */}
            <div className="profile-completion">
              <div className="completion-header">
                <span className="completion-label">Profile Strength</span>
                <span className="completion-pct">{completionScore}%</span>
              </div>
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${completionScore}%` }} />
              </div>
              {missingField && <span className="completion-hint">💡 {missingField} to improve</span>}
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-val">★ {user.rating?.toFixed(1) || "5.0"}</span>
                <span className="profile-stat-label">Rating</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-val">{user.totalRatings || 0}</span>
                <span className="profile-stat-label">Reviews</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-val">{user.matches?.length || 0}</span>
                <span className="profile-stat-label">Matches</span>
              </div>
            </div>

            {/* Verification status */}
            <div className="verification-status">
              <div className={`verify-item ${user.isEmailVerified ? "done" : ""}`}>
                <span>📧 Email</span>
                <span className="verify-check">{user.isEmailVerified ? "✓ Verified" : "Pending"}</span>
              </div>
              <div className={`verify-item ${user.isPhoneVerified ? "done" : ""}`}>
                <span>📱 Phone</span>
                <span className="verify-check">{user.isPhoneVerified ? "✓ Verified" : "Pending"}</span>
              </div>
              <div className={`verify-item ${user.isVerified ? "done" : ""}`}>
                <span>🔵 Blue Tick</span>
                <span className="verify-check">{user.isVerified ? "✓ Earned" : "—"}</span>
              </div>
            </div>

            {!user.isPremium && (
              <div className="premium-cta">
                <span>⭐</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Upgrade to Premium</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>See who liked you & more</p>
                </div>
                <button className="btn btn-primary btn-sm">Upgrade</button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="profile-right">
          <div className="card profile-detail-card">
            <div className="card-header-row">
              <h3>Profile Details</h3>
              {!editing ? (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="spinner" /> : "💾 Save"}
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="edit-form">
                <div className="input-group">
                  <label className="input-label">Display Name</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">City</label>
                  <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Bio</label>
                  <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ resize: "none" }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Looking for</label>
                  <div className="intent-picker">
                    {Object.entries(INTENT_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        className={`intent-pick-btn ${form.intents.includes(key) ? "selected" : ""}`}
                        style={{ "--color": cfg.color, "--bg": cfg.bg }}
                        onClick={() => toggleItem("intents", key)}
                      >
                        <span>{cfg.icon}</span> <span>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Mood</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        className={`mood-btn ${form.mood === key ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, mood: key })}
                      >
                        {cfg.icon} {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Interests</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {INTERESTS_LIST.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={`tag ${form.interests.includes(interest) ? "active" : ""}`}
                        onClick={() => toggleItem("interests", interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Emergency Contact (for safety)</label>
                  <input className="input" placeholder="Phone number" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Availability</label>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[["now", "Available Now"], ["tonight", "Tonight"], ["weekend", "This Weekend"]].map(([key, label]) => (
                      <label key={key} className="avail-toggle">
                        <input
                          type="checkbox"
                          checked={form.availability[key]}
                          onChange={(e) => setForm({ ...form, availability: { ...form.availability, [key]: e.target.checked } })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <div className="pv-row"><span className="pv-label">Looking for</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {user.intents?.map((intent) => {
                      const cfg = INTENT_CONFIG[intent];
                      return cfg ? <span key={intent} className="intent-badge" style={{ "--color": cfg.color, "--bg": cfg.bg }}>{cfg.icon} {cfg.label}</span> : null;
                    })}
                  </div>
                </div>
                <div className="pv-row"><span className="pv-label">Interests</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {user.interests?.map((i) => <span key={i} className="tag">{i}</span>)}
                  </div>
                </div>
                <div className="pv-row"><span className="pv-label">Mood</span>
                  <span>{MOOD_CONFIG[user.mood]?.icon} {MOOD_CONFIG[user.mood]?.label}</span>
                </div>
                <div className="pv-row"><span className="pv-label">Member since</span>
                  <span>{new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                </div>
              </div>
            )}
          </div>

          {/* Activity stats card */}
          <div className="card profile-activity-card">
            <h3>📊 Activity Overview</h3>
            <div className="activity-grid">
              <div className="activity-item">
                <span className="ai-icon">💜</span>
                <span className="ai-val gradient-text">{user.matches?.length || 0}</span>
                <span className="ai-label">Matches</span>
              </div>
              <div className="activity-item">
                <span className="ai-icon">📅</span>
                <span className="ai-val" style={{ color: "#3b82f6" }}>0</span>
                <span className="ai-label">Sessions</span>
              </div>
              <div className="activity-item">
                <span className="ai-icon">⭐</span>
                <span className="ai-val" style={{ color: "#f59e0b" }}>★ {user.rating?.toFixed(1) || "5.0"}</span>
                <span className="ai-label">Rating</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card profile-avail-card">
            <h3>🕐 Current Availability</h3>
            <div className="avail-chips">
              {[["now", "⚡ Available Now"], ["tonight", "🌙 Tonight"], ["weekend", "🎉 This Weekend"]].map(([key, label]) => (
                <span key={key} className={`avail-chip ${user.availability?.[key] ? "on" : ""}`}>
                  {label}
                </span>
              ))}
            </div>
            {!editing && (
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 10 }}>
                Edit your profile to update availability
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
