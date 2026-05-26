import "./StaticPages.css";

const jobs = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", tags: ["React", "Node.js", "MongoDB", "Remote"] },
  { title: "Product Manager — Growth", dept: "Product", tags: ["Growth", "Analytics", "Bangalore"] },
  { title: "UI/UX Designer", dept: "Design", tags: ["Figma", "Mobile", "Hybrid", "Remote"] },
  { title: "Data Scientist — Matching Algorithm", dept: "Engineering", tags: ["Python", "ML", "Delhi"] },
  { title: "Community Manager", dept: "Marketing", tags: ["Social Media", "Content", "Remote"] },
  { title: "Safety & Trust Analyst", dept: "Operations", tags: ["Moderation", "Policy", "Mumbai"] },
  { title: "Android Developer (React Native)", dept: "Engineering", tags: ["React Native", "Android", "Remote"] },
  { title: "Business Development Manager", dept: "Growth", tags: ["B2B", "Partnerships", "Bangalore"] },
];

const perks = [
  { icon: "💰", title: "Competitive Salary", desc: "Top-of-market compensation + ESOPs for all full-time employees." },
  { icon: "🏖️", title: "Unlimited PTO", desc: "We trust you. Take the time you need to recharge and come back fresh." },
  { icon: "🏠", title: "Remote-First", desc: "Work from anywhere in India. We have hubs in Delhi, Mumbai, and Bangalore." },
  { icon: "📚", title: "Learning Budget", desc: "₹50,000/year for courses, books, conferences — invest in yourself." },
  { icon: "🏥", title: "Health Insurance", desc: "Full medical, dental, and mental health coverage for you and your family." },
  { icon: "⚡", title: "Fast Shipping", desc: "We build in weeks, not quarters. Your work ships and matters immediately." },
];

export default function Careers() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">💼 We're Hiring</div>
        <h1>Build the Future of <span>Human Connection</span></h1>
        <p>Join a team of passionate builders working on one of India's most important social problems. We're small, fast, and deeply mission-driven.</p>
      </div>

      <div className="sp-content-wide">
        {/* Why Matchera */}
        <div className="sp-section">
          <h2>Why Matchera?</h2>
          <div className="sp-grid sp-grid-3" style={{ marginTop: 24 }}>
            {perks.map((p, i) => (
              <div key={i} className="sp-card">
                <div className="sp-card-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="sp-stats">
          <div><div className="sp-stat-val">45</div><div className="sp-stat-label">Team Members</div></div>
          <div><div className="sp-stat-val">8</div><div className="sp-stat-label">Open Roles</div></div>
          <div><div className="sp-stat-val">4.8★</div><div className="sp-stat-label">Glassdoor Rating</div></div>
          <div><div className="sp-stat-val">3</div><div className="sp-stat-label">Office Hubs</div></div>
        </div>

        {/* Open Roles */}
        <div className="sp-section">
          <h2>Open Positions ({jobs.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {jobs.map((j, i) => (
              <div key={i} className="sp-job-card">
                <div className="sp-job-info">
                  <h3>{j.title}</h3>
                  <div className="sp-job-tags">
                    <span className="sp-job-tag" style={{ background: "#DBEAFE", color: "#1D4ED8", borderColor: "#BFDBFE" }}>{j.dept}</span>
                    {j.tags.map((t, ti) => (
                      <span key={ti} className={`sp-job-tag ${t === "Remote" ? "remote" : ""}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <button className="sp-job-btn">Apply Now →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="sp-section">
          <h2>Our Hiring Process</h2>
          <div className="sp-timeline" style={{ marginTop: 32 }}>
            {[
              { step: "01", title: "Apply Online", desc: "Submit your resume and a short note on why Matchera excites you." },
              { step: "02", title: "Intro Call (30 min)", desc: "A casual chat with our recruiter. We want to know you, not quiz you." },
              { step: "03", title: "Skills Assessment", desc: "A practical, paid take-home challenge relevant to the role (4-6 hrs)." },
              { step: "04", title: "Team Interviews", desc: "Meet the team you'd work with. Collaborative, not interrogative." },
              { step: "05", title: "Offer & Onboarding", desc: "Offer within 48 hours of final round. 2-week structured onboarding." },
            ].map((s, i) => (
              <div key={i} className="sp-timeline-item">
                <div className="sp-timeline-dot">{s.step}</div>
                <div className="sp-timeline-body"><h4>{s.title}</h4><p>{s.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-cta">
          <h2>Don't See Your Role? 🎯</h2>
          <p>We're always looking for exceptional people. Send us a note and tell us how you'd contribute.</p>
          <a href="mailto:careers@matchera.in" className="sp-cta-btn">📧 Email Us Directly</a>
        </div>
      </div>
    </div>
  );
}
