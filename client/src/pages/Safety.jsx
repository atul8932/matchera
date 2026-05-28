import { useState, useRef } from "react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { REPORT_REASONS } from "../utils/constants";
import "./Safety.css";

export default function Safety() {
  const toast = useToast();
  const { user } = useAuth();
  const [reportForm, setReportForm] = useState({ reportedId: "", reason: "", description: "" });
  const [rateForm, setRateForm] = useState({ ratedId: "", rating: 5, review: "", tags: [] });
  const [sosActive, setSosActive] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const sosTimerRef = useRef(null);
  const [checkInDone, setCheckInDone] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [submitting, setSubmitting] = useState(false);
  const emergencyContact = user?.emergencyContact || null;

  const RATING_TAGS = ["punctual", "friendly", "safe", "fun", "professional", "respectful"];

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportForm.reportedId || !reportForm.reason) { toast.error("Fill all required fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/safety/report", reportForm);
      toast.success("Report submitted. Our team will review it within 24 hours.");
      setReportForm({ reportedId: "", reason: "", description: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally { setSubmitting(false); }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    if (!rateForm.ratedId) { toast.error("Enter the user ID to rate"); return; }
    setSubmitting(true);
    try {
      await api.post("/safety/rate", rateForm);
      toast.success("Rating submitted! ⭐");
      setRateForm({ ratedId: "", rating: 5, review: "", tags: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating");
    } finally { setSubmitting(false); }
  };

  // Send SOS with real GPS coordinates
  const handleSOS = async () => {
    if (sosActive) return;

    if (!emergencyContact) {
      toast.error("⚠️ No emergency contact saved. Please add one in your Profile settings.");
      return;
    }

    setSosActive(true);
    setSosSending(true);
    toast.warning("🚨 Getting your GPS location...");

    const sendAlert = async (locationStr, coords) => {
      try {
        await api.post("/safety/sos", {
          location: locationStr,
          coordinates: coords,
          message: `🚨 EMERGENCY SOS from ${user?.name || "Matchera User"}. I need help! My location: ${locationStr}`,
          contact: emergencyContact,
        });
        toast.error(`🚨 SOS Alert sent to ${emergencyContact}!`);
      } catch {
        toast.error("⚠️ Server SOS failed. Call 112 immediately!");
      } finally {
        setSosSending(false);
        sosTimerRef.current = setTimeout(() => setSosActive(false), 8000);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          sendAlert(mapsLink, [longitude, latitude]);
        },
        () => {
          // GPS denied — still send SOS without coordinates
          sendAlert("Location unavailable (GPS access denied)", null);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      sendAlert("GPS not supported on this device", null);
    }
  };

  const cancelSOS = () => {
    if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    setSosActive(false);
    setSosSending(false);
    toast.success("SOS cancelled");
  };

  const handleCheckIn = () => {
    setCheckInDone(true);
    toast.success("✅ Safe check-in confirmed!");
    setTimeout(() => setCheckInDone(false), 10000);
  };

  const copyMyLocation = () => {
    if (!navigator.geolocation) { toast.error("GPS not supported on this device."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(link)
            .then(() => toast.success("📍 Location link copied to clipboard!"))
            .catch(() => toast.info("Your location: " + link));
        } else {
          toast.info("Your location: " + link);
        }
      },
      () => toast.error("Could not get location. Please enable GPS.")
    );
  };

  const tabs = ["overview", "contacts", "report", "rate"];

  return (
    <div className="page safety-page">
      <div className="container">
        <div className="safety-header">
          <h2>🛡️ Safety Center</h2>
          <p className="text-muted">Your safety is our top priority. Use these tools to stay safe.</p>
        </div>

        {/* SOS Banner */}
        <div className={`sos-banner card ${sosActive ? "sos-banner--active" : ""}`}>
          <div className="sos-info">
            <div className="sos-icon">🆘</div>
            <div>
              <h3>Emergency SOS</h3>
              <p>In danger? Press SOS to share your <strong>live GPS location</strong> with your emergency contact instantly.</p>
              {emergencyContact ? (
                <div className="sos-contact-badge">
                  <span>📞</span>
                  <span>Will alert: <strong>{emergencyContact}</strong></span>
                </div>
              ) : (
                <div className="sos-contact-badge sos-contact-badge--warn">
                  <span>⚠️</span>
                  <span>No emergency contact set — <a href="/profile" style={{ color: "var(--primary)", fontWeight: 600 }}>add one in Profile</a></span>
                </div>
              )}
              {sosActive && (
                <div className="sos-status-badge">
                  {sosSending ? "📡 Getting GPS & sending alert..." : "✅ Alert sent! Stay safe."}
                </div>
              )}
            </div>
          </div>
          <div className="sos-btn-group">
            <button
              className={`sos-btn ${sosActive ? "active" : ""} ${!emergencyContact ? "sos-btn--disabled" : ""}`}
              onClick={handleSOS}
              disabled={sosActive}
              title={!emergencyContact ? "Set an emergency contact in Profile first" : ""}
            >
              {sosSending ? "📡 Locating..." : sosActive ? "✅ Sent!" : "🆘 SOS"}
            </button>
            {sosActive && (
              <button className="btn btn-outline btn-sm" onClick={cancelSOS} style={{ marginTop: 8 }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="safety-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`safety-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" ? "🛡️ Safety Tips"
                : tab === "contacts" ? "📞 Trusted Contacts"
                : tab === "report" ? "🚩 Report User"
                : "⭐ Rate Experience"}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="safety-overview animate-fade-in">
            {/* Check-in */}
            <div className="card checkin-card">
              <div className="checkin-info">
                <div style={{ fontSize: "2rem" }}>✅</div>
                <div>
                  <h3>Safe Check-In</h3>
                  <p>Tap to confirm you're safe. Your emergency contact will be notified if you miss a check-in.</p>
                </div>
              </div>
              <button
                className={`btn ${checkInDone ? "btn-outline" : "btn-primary"}`}
                onClick={handleCheckIn}
              >
                {checkInDone ? "✅ Checked In!" : "Check In Now"}
              </button>
            </div>

            <div className="safety-tips-grid">
              {[
                { icon: "📍", title: "Meet in Public", desc: "Always meet your match in well-lit, public places for your first Matchera meetup." },
                { icon: "📱", title: "Share Location", desc: "Share your live location with a trusted friend or family member before meeting." },
                { icon: "🔵", title: "Verified Only", desc: "Look for the blue verification tick. Verified users have confirmed their identity." },
                { icon: "🚗", title: "Own Transport", desc: "Arrange your own transport to and from the meeting point initially." },
                { icon: "💬", title: "Trust Your Gut", desc: "If something feels off in chat, don't meet. Trust your instincts." },
                { icon: "📞", title: "Emergency Numbers", desc: "Police: 100 | Women Helpline: 1091 | Emergency: 112" },
              ].map((tip, i) => (
                <div key={i} className="safety-tip-card card animate-fade-in">
                  <div className="safety-tip-icon">{tip.icon}</div>
                  <h4>{tip.title}</h4>
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts tab */}
        {activeTab === "contacts" && (
          <div className="contacts-section animate-fade-in">
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 20 }}>📞 SOS Emergency Contact</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
                This person receives your <strong>GPS location</strong> + emergency message when you trigger SOS.
              </p>

              {emergencyContact ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(16,185,129,0.06)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.3)", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>📞</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>{emergencyContact}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--color-success)" }}>✅ SOS Ready — will receive GPS alert</div>
                  </div>
                  <a href="/profile" className="btn btn-outline btn-sm">✏️ Edit</a>
                </div>
              ) : (
                <div style={{ padding: "20px", background: "rgba(239,68,68,0.06)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.5rem" }}>⚠️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>No Emergency Contact Set</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>The SOS button won't work until you add an emergency contact phone number in your Profile.</div>
                  </div>
                  <a href="/profile" className="btn btn-primary btn-sm">+ Add Contact</a>
                </div>
              )}

              <div style={{ padding: "16px", background: "rgba(59,130,246,0.06)", borderRadius: "var(--radius-md)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <p style={{ fontSize: "0.85rem", color: "#60a5fa" }}>
                  💡 <strong>How SOS works:</strong> When you tap SOS, the app captures your GPS coordinates and sends a Google Maps link + emergency message to your saved contact number via the server.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 16 }}>📍 Share Live Location Now</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
                Before any meetup, copy your current GPS location link to share with a trusted contact.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" onClick={copyMyLocation}>
                  📍 Copy My Location Link
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => toast.info("Timer check-in coming soon!")}>
                  ⏰ Set Check-in Timer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report tab */}
        {activeTab === "report" && (
          <div className="report-section animate-fade-in">
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 24 }}>🚩 Report a User</h3>
              <form onSubmit={handleReport} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="input-group">
                  <label className="input-label">User ID to Report *</label>
                  <input className="input" placeholder="Paste the user's ID" value={reportForm.reportedId} onChange={(e) => setReportForm({ ...reportForm, reportedId: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Reason *</label>
                  <select className="input" value={reportForm.reason} onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}>
                    <option value="">Select a reason</option>
                    {REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Additional Details</label>
                  <textarea className="input" rows={4} placeholder="Describe what happened..." value={reportForm.description} onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })} style={{ resize: "none" }} />
                </div>
                <button type="submit" className="btn btn-danger" disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "🚩 Submit Report"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Rate tab */}
        {activeTab === "rate" && (
          <div className="rate-section animate-fade-in">
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 24 }}>⭐ Rate Your Experience</h3>
              <form onSubmit={handleRate} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="input-group">
                  <label className="input-label">User ID to Rate *</label>
                  <input className="input" placeholder="Paste the user's ID" value={rateForm.ratedId} onChange={(e) => setRateForm({ ...rateForm, ratedId: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Rating</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= rateForm.rating ? "filled" : ""}`}
                        onClick={() => setRateForm({ ...rateForm, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                    <span>{rateForm.rating}/5</span>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Tags</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {RATING_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag ${rateForm.tags.includes(tag) ? "active" : ""}`}
                        onClick={() => setRateForm((p) => ({
                          ...p,
                          tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag],
                        }))}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Review (optional)</label>
                  <textarea className="input" rows={3} placeholder="Share your experience..." value={rateForm.review} onChange={(e) => setRateForm({ ...rateForm, review: e.target.value })} style={{ resize: "none" }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "⭐ Submit Rating"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
