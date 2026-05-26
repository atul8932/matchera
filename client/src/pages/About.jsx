import { Link } from "react-router-dom";
import "./StaticPages.css";

const team = [
  { name: "Aarav Kapoor", role: "Co-Founder & CEO", bio: "IIT Delhi grad, prev. Zomato. Passionate about building India's social infrastructure.", avatar: "https://ui-avatars.com/api/?name=Aarav+Kapoor&background=2563EB&color=fff&bold=true&size=128" },
  { name: "Priya Menon", role: "Co-Founder & CPO", bio: "Ex-Tinder India product lead. Obsessed with human connection at scale.", avatar: "https://ui-avatars.com/api/?name=Priya+Menon&background=0EA5E9&color=fff&bold=true&size=128" },
  { name: "Rohan Desai", role: "CTO", bio: "Full-stack architect with 10+ years. Built real-time systems at Swiggy.", avatar: "https://ui-avatars.com/api/?name=Rohan+Desai&background=6366F1&color=fff&bold=true&size=128" },
  { name: "Meera Singh", role: "Head of Safety", bio: "Former cybersecurity analyst. Ensures every Matchera interaction is safe.", avatar: "https://ui-avatars.com/api/?name=Meera+Singh&background=22C55E&color=fff&bold=true&size=128" },
  { name: "Karan Joshi", role: "Head of Growth", bio: "Ex-OYO, 3x startup experience. Scaling Matchera across 200+ cities.", avatar: "https://ui-avatars.com/api/?name=Karan+Joshi&background=F59E0B&color=fff&bold=true&size=128" },
  { name: "Anika Rao", role: "Design Lead", bio: "Award-winning UX designer. Crafts every pixel with empathy and intention.", avatar: "https://ui-avatars.com/api/?name=Anika+Rao&background=EC4899&color=fff&bold=true&size=128" },
];

const values = [
  { icon: "🎯", title: "Intent First", desc: "We believe every connection needs a purpose. Matchera is built around what you want to do, not just who you want to meet." },
  { icon: "🛡️", title: "Safety Always", desc: "From AI moderation to SOS buttons, your safety is our non-negotiable foundation — built into every feature." },
  { icon: "🤝", title: "Authenticity", desc: "Verified profiles, real people, real intentions. No bots, no fakes — only genuine human connections." },
  { icon: "🌍", title: "India First", desc: "Built for India's diversity — 22 languages, 5000+ cities, and the beautiful complexity of Indian social life." },
  { icon: "⚡", title: "Velocity", desc: "We move fast, ship fast, and improve fast. Your feedback shapes our product every single sprint." },
  { icon: "❤️", title: "Empathy", desc: "Every feature is designed by asking: how does this make our user feel? Empathy is our design principle." },
];

const timeline = [
  { year: "2022", title: "The Idea", desc: "Founders Aarav and Priya meet at a startup conclave and bond over a shared frustration: existing apps were all about romance, ignoring the vast social needs of urban Indians." },
  { year: "2023", title: "First Build", desc: "A scrappy team of 5 builds the first MVP in 3 months. 500 beta users in Delhi validate the core intent-matching concept." },
  { year: "2024 Q1", title: "Seed Round", desc: "Raised ₹2.5 Cr seed from prominent angels. Expanded to Mumbai and Bangalore. 10,000 users by March." },
  { year: "2024 Q3", title: "Safety Launch", desc: "Launched the industry-first Safety Center with SOS, live check-ins, and AI content moderation. Press coverage in TechCrunch India." },
  { year: "2025", title: "Series A & Scale", desc: "50,000+ users across 200+ cities. Series A underway. Expanding to Tier-2 cities and launching mobile apps." },
];

export default function About() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">🏢 Our Story</div>
        <h1>We're Building India's <span>Companion Layer</span></h1>
        <p>Matchera was born from one belief: every moment is better shared. We're on a mission to make meaningful human connection accessible to every Indian.</p>
      </div>

      <div className="sp-content-wide">
        {/* Mission */}
        <div className="sp-section" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 56px" }}>
          <h2 style={{ border: "none", fontSize: "2rem" }}>Our Mission</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.9 }}>
            To eliminate loneliness in urban India by connecting people with the right companion for every activity, moment, and purpose — safely, authentically, and meaningfully.
          </p>
        </div>

        {/* Stats */}
        <div className="sp-stats">
          <div><div className="sp-stat-val">50K+</div><div className="sp-stat-label">Active Users</div></div>
          <div><div className="sp-stat-val">200+</div><div className="sp-stat-label">Cities</div></div>
          <div><div className="sp-stat-val">95%</div><div className="sp-stat-label">Match Success Rate</div></div>
          <div><div className="sp-stat-val">4.9★</div><div className="sp-stat-label">Average Rating</div></div>
        </div>

        {/* Values */}
        <div className="sp-section">
          <h2>What We Stand For</h2>
          <div className="sp-grid sp-grid-3" style={{ marginTop: 24 }}>
            {values.map((v, i) => (
              <div key={i} className="sp-card sp-card-accent">
                <div className="sp-card-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="sp-section">
          <h2>Our Journey</h2>
          <div className="sp-timeline" style={{ marginTop: 32 }}>
            {timeline.map((t, i) => (
              <div key={i} className="sp-timeline-item">
                <div className="sp-timeline-dot">{t.year.slice(-2)}</div>
                <div className="sp-timeline-body">
                  <h4>{t.year} — {t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="sp-section">
          <h2>Meet the Team</h2>
          <div className="sp-grid sp-grid-3" style={{ marginTop: 24 }}>
            {team.map((m, i) => (
              <div key={i} className="sp-team-card">
                <img src={m.avatar} alt={m.name} className="sp-team-avatar" />
                <div className="sp-team-name">{m.name}</div>
                <div className="sp-team-role">{m.role}</div>
                <div className="sp-team-bio">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-cta">
          <h2>Join Our Journey 🚀</h2>
          <p>50,000 people are already building meaningful connections on Matchera. Be part of the story.</p>
          <Link to="/register" className="sp-cta-btn">✨ Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
