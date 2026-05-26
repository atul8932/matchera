import { Link } from "react-router-dom";
import "./StaticPages.css";

const rules = [
  { icon: "🚫", title: "No Fake Profiles", color: "#EF4444", desc: "Use your real name, real age, and real photos. Impersonating anyone — celebrity or otherwise — results in immediate, permanent ban." },
  { icon: "🤝", title: "Respect Everyone", color: "#F59E0B", desc: "Treat all users with dignity. Harassment, bullying, threats, or discriminatory language based on gender, religion, caste, or orientation is strictly prohibited." },
  { icon: "💰", title: "No Solicitation", color: "#8B5CF6", desc: "Do not ask for or offer money, gifts, or financial benefits. Matchera is not a platform for commercial exchanges of any kind." },
  { icon: "🔞", title: "Adults Only", color: "#EC4899", desc: "You must be 18+. Attempting to connect with minors or sharing age-inappropriate content will result in legal action and permanent ban." },
  { icon: "📸", title: "Appropriate Content", color: "#0EA5E9", desc: "No explicit, graphic, or sexual content in profiles, sessions, or public chats. Keep content appropriate for a general audience." },
  { icon: "🛡️", title: "Protect Privacy", color: "#22C55E", desc: "Never share another user's personal information (phone, address, photos) without their explicit consent. Privacy violations are taken very seriously." },
];

const meetSafely = [
  { step: "01", icon: "📍", title: "Always Meet in Public", desc: "For first meetings, always choose a busy, public location — a café, mall, or park. Never go to someone's home or an isolated place for a first meet." },
  { step: "02", icon: "📱", title: "Tell Someone You Trust", desc: "Before meeting, tell a friend or family member where you're going, who you're meeting, and when you expect to be back. Share your live location with them." },
  { step: "03", icon: "✅", title: "Use Matchera's Check-In", desc: "Enable safe check-in on the Safety page. A guardian will receive automatic alerts if you don't check in on time." },
  { step: "04", icon: "🚨", title: "Know How to Use SOS", desc: "Familiarize yourself with the SOS button in the Safety section. One tap sends your location and an alert to your emergency contact." },
  { step: "05", icon: "🚗", title: "Arrange Your Own Transport", desc: "Never depend on your match for transportation. Have your own way to get there and leave independently." },
  { step: "06", icon: "🧠", title: "Trust Your Instincts", desc: "If something feels off — the conversation, the meeting, anything — it's okay to leave. You don't owe anyone an explanation. Your safety is paramount." },
];

const reportReasons = [
  { icon: "👤", label: "Fake Profile" },
  { icon: "😡", label: "Harassment" },
  { icon: "📧", label: "Spam" },
  { icon: "🔞", label: "Inappropriate Content" },
  { icon: "💸", label: "Scam / Fraud" },
  { icon: "👶", label: "Underage User" },
  { icon: "❓", label: "Other" },
];

export default function SafetyGuidelines() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">🛡️ Safety Guidelines</div>
        <h1>Your Safety is Our <span>Top Priority</span></h1>
        <p>Matchera is built safety-first. These guidelines help every user have a safe, respectful, and genuine experience.</p>
      </div>

      <div className="sp-content-wide">
        {/* Quick Stats */}
        <div className="sp-stats">
          <div><div className="sp-stat-val">&lt;24h</div><div className="sp-stat-label">Report Response Time</div></div>
          <div><div className="sp-stat-val">100%</div><div className="sp-stat-label">Profiles Screened</div></div>
          <div><div className="sp-stat-val">AI</div><div className="sp-stat-label">Content Moderation</div></div>
          <div><div className="sp-stat-val">1-Tap</div><div className="sp-stat-label">SOS Emergency Alert</div></div>
        </div>

        {/* Community Rules */}
        <div className="sp-section">
          <h2>Community Standards</h2>
          <p>These rules apply to every Matchera user without exception. Violations result in immediate account suspension or permanent ban.</p>
          <div className="sp-grid sp-grid-3" style={{ marginTop: 24 }}>
            {rules.map((r, i) => (
              <div key={i} className="sp-card" style={{ borderTop: `3px solid ${r.color}` }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>{r.icon}</div>
                <h3 style={{ color: r.color }}>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meet Safely */}
        <div className="sp-section">
          <h2>How to Meet Safely in Person</h2>
          <p>Matchera connects you digitally — but here's how to stay safe when taking it offline.</p>
          <div className="sp-timeline" style={{ marginTop: 32 }}>
            {meetSafely.map((s, i) => (
              <div key={i} className="sp-timeline-item">
                <div className="sp-timeline-dot">{s.step}</div>
                <div className="sp-timeline-body">
                  <h4>{s.icon} {s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Report */}
        <div className="sp-section">
          <h2>How to Report a User</h2>
          <div className="sp-grid sp-grid-2" style={{ marginTop: 24 }}>
            <div className="sp-card sp-card-accent">
              <h3>In the App</h3>
              <p>Tap the <strong>⋯ menu</strong> on any profile or in any chat → Select <strong>"Report"</strong> → Choose a reason → Add details → Submit. We review every report within 24 hours.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {reportReasons.map((r, i) => (
                  <span key={i} style={{ background: "#F1F5F9", border: "1px solid var(--border)", borderRadius: 999, padding: "4px 12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{r.icon} {r.label}</span>
                ))}
              </div>
            </div>
            <div className="sp-card sp-card-accent">
              <h3>Emergency / Urgent</h3>
              <p>For urgent safety concerns — threats, blackmail, or abuse — contact us immediately:</p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
                  <div style={{ fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>🚨 Emergency</div>
                  <div style={{ fontSize: "0.88rem", color: "#DC2626" }}>Call 112 (India Emergency)</div>
                </div>
                <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
                  <div style={{ fontWeight: 700, color: "#1D4ED8", marginBottom: 4 }}>📧 Safety Team</div>
                  <div style={{ fontSize: "0.88rem", color: "#1D4ED8" }}>safety@matchera.in · Response in 2 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="sp-section">
          <h2>Built-In Safety Features</h2>
          <div className="sp-grid sp-grid-4" style={{ marginTop: 24 }}>
            {[
              { icon: "🆘", title: "One-Tap SOS", desc: "Instantly alerts your emergency contact with GPS location" },
              { icon: "📍", title: "Live Check-In", desc: "Scheduled check-ins — guardian is notified if you miss one" },
              { icon: "✅", title: "Blue Tick Verify", desc: "Phone, photo, and ID verification for maximum trust" },
              { icon: "🤖", title: "AI Moderation", desc: "Automatic detection of fake profiles and harmful content" },
            ].map((f, i) => (
              <div key={i} className="sp-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: "0.95rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-cta">
          <h2>🛡️ Use Matchera's Safety Center</h2>
          <p>Access SOS, check-in, and reporting tools all in one place.</p>
          <Link to="/safety" className="sp-cta-btn">Open Safety Center →</Link>
        </div>
      </div>
    </div>
  );
}
