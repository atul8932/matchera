import { Link } from "react-router-dom";
import { INTENT_CONFIG } from "../utils/constants";
import "./Landing.css";

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "95%", label: "Match Rate" },
  { value: "200+", label: "Cities" },
  { value: "4.9⭐", label: "App Rating" },
];

const features = [
  {
    icon: "🎯",
    title: "Intent-Based Matching",
    desc: "Tell us what you're looking for — not just who. Walking, dining, travel, or dating — match with purpose.",
  },
  {
    icon: "🧠",
    title: "Smart Compatibility",
    desc: "Our algorithm scores compatibility based on interests, mood, location, and intent for better connections.",
  },
  {
    icon: "🔐",
    title: "Verified Profiles",
    desc: "Phone OTP + photo verification + blue-tick system ensures you meet real people only.",
  },
  {
    icon: "📅",
    title: "Session Creation",
    desc: "Post 'Looking for a breakfast partner at CP tomorrow 9AM' — and find your match instantly.",
  },
  {
    icon: "💬",
    title: "Real-Time Chat",
    desc: "Secure 1-on-1 chat with voice notes, media sharing, and disappearing messages for safety.",
  },
  {
    icon: "🛡️",
    title: "Safety First",
    desc: "Emergency SOS, live location sharing, check-in system, and AI moderation built-in.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma", city: "Delhi", intent: "travel", rating: 5,
    text: "Found my perfect Goa travel buddy in 10 minutes! Completely safe and super easy to use.",
    avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=14B8A6&color=0F172A&bold=true",
  },
  {
    name: "Arjun Mehta", city: "Mumbai", intent: "food", rating: 5,
    text: "Used it to find someone to try that new restaurant with. Best experience ever — total vibe match!",
    avatar: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=2DD4BF&color=0F172A&bold=true",
  },
  {
    name: "Sneha Nair", city: "Bangalore", intent: "work-study", rating: 5,
    text: "Found a study partner for my CA exams. We've been meeting weekly. This app literally changed my life.",
    avatar: "https://ui-avatars.com/api/?name=Sneha+Nair&background=3b82f6&color=fff&bold=true",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <span>✨</span> The Future of Matching
          </div>
          <h1 className="hero-title animate-fade-in delay-1">
            Find a Partner
            <br />
            <span className="gradient-text">for Everything</span>
          </h1>
          <p className="hero-desc animate-fade-in delay-2">
            Not just dating. Find partners for walking, travel, food, work, fitness, and more.
            <br />Intent-based matching that understands what you actually want.
          </p>
          <div className="hero-cta animate-fade-in delay-3">
            <Link to="/register" className="btn btn-primary btn-lg">
              🚀 Start for Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>

          {/* Intent chips */}
          <div className="hero-intents animate-fade-in delay-4">
            {Object.entries(INTENT_CONFIG).map(([key, cfg]) => (
              <span key={key} className="intent-chip" style={{ "--chip-color": cfg.color, "--chip-bg": cfg.bg }}>
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="container">
          <div className="stats-row animate-fade-in delay-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-card glass">
                <span className="stat-value gradient-text">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to <span className="gradient-text">Connect</span></h2>
            <p>A complete platform designed for meaningful Matchera experiences</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card card animate-fade-in delay-${(i % 4) + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2>How <span className="gradient-text">It Works</span></h2>
            <p>Three simple steps to find your perfect match on Matchera</p>
          </div>
          <div className="steps-row">
            {[
              { step: "01", icon: "🎯", title: "Set Your Intent", desc: "Choose what you're looking for — dining, travel, dating, walking, or more." },
              { step: "02", icon: "💫", title: "Get Matched", desc: "Our smart algorithm matches you with compatible people near you." },
              { step: "03", icon: "🤝", title: "Meet Safely", desc: "Chat, plan, check in, and meet your match with full safety features built into Matchera." },
            ].map((s, i) => (
              <div key={i} className={`step-card animate-fade-in delay-${i + 1}`}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 2 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by <span className="gradient-text">Thousands</span></h2>
            <p>Real stories from real Matchera users</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card card animate-fade-in delay-${i + 1}`}>
                <div className="stars">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <span key={j} className="star filled">★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="avatar avatar-md" />
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-meta">
                      {INTENT_CONFIG[t.intent]?.icon} {INTENT_CONFIG[t.intent]?.label} • {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card glass">
            <div className="cta-orb" />
            <h2>Ready to Find Your <span className="gradient-text">Perfect Match?</span></h2>
            <p>Join 50,000+ people already using Matchera to find meaningful connections.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              ✨ Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">💫</span>
            <span className="logo-text gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
              <img src="/matchera-logo.jpeg" alt="Matchera" style={{ height: 32 }} />
            </span>
          </div>
          <p className="footer-copy">© 2025 Matchera. Built with ❤️ for meaningful connections.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Safety</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
