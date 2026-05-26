import "./StaticPages.css";

const coverage = [
  { outlet: "TechCrunch India", headline: "Matchera is solving urban loneliness with intent-based social matching", date: "May 2025" },
  { outlet: "YourStory", headline: "How this Delhi startup went from 500 to 50,000 users by rethinking why people connect", date: "Apr 2025" },
  { outlet: "Inc42", headline: "Matchera raises ₹2.5Cr seed to build India's 'companion OS'", date: "Jan 2025" },
  { outlet: "Economic Times", headline: "Safety-first dating apps: why Matchera's SOS feature is a game changer", date: "Mar 2025" },
  { outlet: "Entrackr", headline: "Matchera crosses 200 cities, eyes Series A at ₹50Cr valuation", date: "May 2025" },
  { outlet: "Moneycontrol", headline: "Beyond dating: the rise of intent-based companion platforms in India", date: "Apr 2025" },
];

const awards = [
  { icon: "🏆", title: "Best Social Startup 2025", org: "TechSparks India" },
  { icon: "🥇", title: "Top Safety Innovation", org: "India Safety Tech Awards" },
  { icon: "⭐", title: "Product of the Year", org: "Inc42 Startup Awards" },
  { icon: "🎖️", title: "Top 25 Startups to Watch", org: "YourStory" },
];

export default function Press() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">📰 Press & Media</div>
        <h1>Matchera in the <span>News</span></h1>
        <p>Media coverage, press releases, awards, and brand assets. For press inquiries, reach us at press@matchera.in</p>
      </div>

      <div className="sp-content-wide">
        {/* Press Logos */}
        <div className="sp-section" style={{ textAlign: "center" }}>
          <h2>As Seen In</h2>
          <div className="sp-press-logos" style={{ marginTop: 28 }}>
            {["TechCrunch", "YourStory", "Inc42", "Economic Times", "Entrackr", "Moneycontrol"].map((name, i) => (
              <div key={i} className="sp-press-logo">{name}</div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="sp-section">
          <h2>Awards & Recognition</h2>
          <div className="sp-grid sp-grid-4" style={{ marginTop: 24 }}>
            {awards.map((a, i) => (
              <div key={i} className="sp-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{a.icon}</div>
                <h3 style={{ fontSize: "0.95rem" }}>{a.title}</h3>
                <p style={{ fontSize: "0.82rem" }}>{a.org}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage */}
        <div className="sp-section">
          <h2>Recent Coverage</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            {coverage.map((c, i) => (
              <div key={i} className="sp-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.82rem", marginBottom: 6 }}>{c.outlet}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.97rem" }}>{c.headline}</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{c.date}</span>
                  <button style={{ background: "var(--primary-soft)", color: "var(--primary)", border: "1px solid #BFDBFE", borderRadius: 999, padding: "6px 14px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>Read →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Kit */}
        <div className="sp-section">
          <h2>Press Kit & Brand Assets</h2>
          <div className="sp-grid sp-grid-3" style={{ marginTop: 24 }}>
            {[
              { icon: "🎨", title: "Logo Package", desc: "SVG, PNG in light/dark variants, all sizes.", btn: "Download" },
              { icon: "📸", title: "Product Screenshots", desc: "High-res screenshots of all major features.", btn: "Download" },
              { icon: "📋", title: "Company Fact Sheet", desc: "Key stats, timeline, team, funding history.", btn: "Download" },
            ].map((item, i) => (
              <div key={i} className="sp-card sp-card-accent" style={{ textAlign: "center" }}>
                <div className="sp-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p style={{ marginBottom: 16 }}>{item.desc}</p>
                <button style={{ background: "var(--primary)", color: "#fff", borderRadius: 999, padding: "8px 20px", fontSize: "0.85rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
                  ⬇ {item.btn}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-cta">
          <h2>Press Inquiries 📬</h2>
          <p>For interviews, press releases, or media partnerships — our comms team responds within 2 hours.</p>
          <a href="mailto:press@matchera.in" className="sp-cta-btn">✉️ press@matchera.in</a>
        </div>
      </div>
    </div>
  );
}
