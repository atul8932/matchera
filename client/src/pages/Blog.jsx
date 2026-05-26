import "./StaticPages.css";

const posts = [
  { tag: "Product", emoji: "🎯", title: "How Intent-Based Matching Changes Everything About Social Apps", excerpt: "Why 'what do you want to do?' is a better question than 'who do you want to meet?' — and how it 10x'd our match quality.", author: "Priya Menon", date: "May 20, 2025", read: "6 min read", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)" },
  { tag: "Safety", emoji: "🛡️", title: "Building Safety-First: How We Designed Matchera's Emergency SOS System", excerpt: "A deep dive into the engineering and UX decisions behind India's most comprehensive companion safety feature.", author: "Meera Singh", date: "May 14, 2025", read: "8 min read", bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)" },
  { tag: "Growth", emoji: "📈", title: "From 500 to 50,000 Users: Lessons from Matchera's First Year", excerpt: "What worked, what didn't, and the counterintuitive growth levers that took us from Delhi to 200+ cities.", author: "Karan Joshi", date: "May 8, 2025", read: "10 min read", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)" },
  { tag: "Design", emoji: "✨", title: "Designing for Trust: UI Patterns That Make Users Feel Safe", excerpt: "How visual design choices — colors, animations, micro-copy — can build or destroy user trust in a social platform.", author: "Anika Rao", date: "Apr 30, 2025", read: "7 min read", bg: "linear-gradient(135deg,#FDF4FF,#FAE8FF)" },
  { tag: "Community", emoji: "🤝", title: "Stories from the Field: 10 Matchera Connections That Changed Lives", excerpt: "Real users, real stories — from solo travelers who found lifelong friends to professionals who found business partners.", author: "Aarav Kapoor", date: "Apr 22, 2025", read: "5 min read", bg: "linear-gradient(135deg,#FFF1F2,#FFE4E6)" },
  { tag: "Tech", emoji: "⚙️", title: "Real-Time at Scale: Building Socket.IO Chat for 50,000 Concurrent Users", excerpt: "The technical architecture behind Matchera's real-time messaging — from a single Node server to a distributed cluster.", author: "Rohan Desai", date: "Apr 15, 2025", read: "12 min read", bg: "linear-gradient(135deg,#F0F9FF,#E0F2FE)" },
];

const categories = ["All", "Product", "Safety", "Growth", "Design", "Community", "Tech"];

export default function Blog() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">📝 Matchera Blog</div>
        <h1>Ideas, Stories & <span>Insights</span></h1>
        <p>Product updates, safety insights, growth lessons, and real stories from the Matchera team and community.</p>
      </div>

      <div className="sp-content-wide">
        {/* Categories */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          {categories.map((c, i) => (
            <button key={i} style={{
              background: i === 0 ? "var(--primary)" : "var(--bg-surface)",
              color: i === 0 ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${i === 0 ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 999, padding: "8px 18px", fontSize: "0.88rem",
              fontWeight: 600, cursor: "pointer", transition: "var(--transition)"
            }}>{c}</button>
          ))}
        </div>

        {/* Featured */}
        <div style={{ background: posts[0].bg, borderRadius: "var(--radius-xl)", padding: 40, marginBottom: 40, border: "1px solid var(--border)" }}>
          <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "4px 12px", fontSize: "0.78rem", fontWeight: 700 }}>⭐ Featured</span>
          <div style={{ fontSize: "3.5rem", margin: "16px 0 12px" }}>{posts[0].emoji}</div>
          <h2 style={{ fontSize: "1.6rem", color: "var(--text-primary)", marginBottom: 12, maxWidth: 600 }}>{posts[0].title}</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.7, marginBottom: 20 }}>{posts[0].excerpt}</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>By {posts[0].author}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>· {posts[0].date}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>{posts[0].read}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="sp-grid sp-grid-3">
          {posts.slice(1).map((p, i) => (
            <div key={i} className="sp-blog-card">
              <div className="sp-blog-img" style={{ background: p.bg }}>{p.emoji}</div>
              <div className="sp-blog-body">
                <span className="sp-blog-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="sp-blog-meta">
                  <span>{p.author}</span>
                  <span>·</span>
                  <span>{p.read}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="sp-cta" style={{ marginTop: 64 }}>
          <h2>📬 Subscribe to Our Newsletter</h2>
          <p>Get the latest insights, product updates, and community stories — straight to your inbox.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <input placeholder="your@email.com" style={{ padding: "14px 20px", borderRadius: 999, border: "none", fontSize: "0.95rem", width: 280, outline: "none" }} />
            <button className="sp-cta-btn" style={{ background: "#fff", color: "var(--primary)" }}>Subscribe →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
