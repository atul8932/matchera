import { Link } from "react-router-dom";
import { INTENT_CONFIG } from "../utils/constants";
import "./Home.css";

const stats = [
  { icon: "👥", value: "50K+",  label: "Active Users" },
  { icon: "🎯", value: "95%",   label: "Match Success Rate" },
  { icon: "🌆", value: "200+",  label: "Cities Covered" },
  { icon: "⭐", value: "4.9",   label: "App Rating" },
];

const steps = [
  {
    num: "01",
    icon: "🎯",
    title: "Set Your Intent",
    desc: "Choose exactly what you're looking for — a walking buddy, travel companion, dining partner, study mate, or something more romantic.",
  },
  {
    num: "02",
    icon: "💫",
    title: "Get Smart Matches",
    desc: "Our AI-powered algorithm scores compatibility based on your interests, mood, location, and intent — delivering only the most relevant profiles.",
  },
  {
    num: "03",
    icon: "🤝",
    title: "Meet Safely",
    desc: "Chat, plan your session, share live location, check in with friends, and meet — all within Matchera's built-in safety ecosystem.",
  },
];

const features = [
  { icon: "🧠", title: "Intent-Based Matching",   desc: "Not just 'who' — but 'why'. Every match is curated around your specific purpose and activity intent." },
  { icon: "🔐", title: "Verified Profiles",        desc: "Phone OTP + photo verification + blue-tick system. Only real, verified humans on Matchera." },
  { icon: "📅", title: "Session Creation",          desc: "Post 'Looking for breakfast partner at CP tomorrow 9AM' — and find your match instantly." },
  { icon: "💬", title: "Real-Time Chat",            desc: "Secure 1-on-1 messaging with voice notes, media, and disappearing messages for privacy." },
  { icon: "🛡️", title: "Safety First",             desc: "Emergency SOS, live location sharing, guardian check-in, and AI content moderation." },
  { icon: "⚡", title: "Instant Availability",     desc: "See who's available right now, tonight, or this weekend — and connect in the moment." },
];

const intentData = [
  { key: "walking",      desc: "Morning walks, evening strolls, park time" },
  { key: "travel",       desc: "Trips, treks, weekend getaways" },
  { key: "food",         desc: "Cafés, restaurants, food trails" },
  { key: "fitness",      desc: "Gym, running, yoga, sports" },
  { key: "work-study",   desc: "Co-working, libraries, study groups" },
  { key: "dating",       desc: "Meaningful romantic connections" },
  { key: "events",       desc: "Concerts, exhibitions, meetups" },
  { key: "casual-dating",desc: "Coffee dates, casual hangouts" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Delhi",
    intent: "travel",
    rating: 5,
    text: "Found my perfect Goa travel buddy in 10 minutes! Completely safe, super easy, and the match was spot on. This app genuinely understands what I need.",
    avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=2563EB&color=fff&bold=true&size=128",
  },
  {
    name: "Arjun Mehta",
    city: "Mumbai",
    intent: "food",
    rating: 5,
    text: "Used it to find someone to try that new rooftop restaurant with. Best experience ever — total vibe match from the first message. Highly recommend!",
    avatar: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=6366f1&color=fff&bold=true&size=128",
  },
  {
    name: "Sneha Nair",
    city: "Bangalore",
    intent: "work-study",
    rating: 5,
    text: "Found a CA exam study partner through Matchera. We've been meeting weekly at the library for months. This app literally changed my productivity.",
    avatar: "https://ui-avatars.com/api/?name=Sneha+Nair&background=0ea5e9&color=fff&bold=true&size=128",
  },
];

const safetyFeatures = [
  { icon: "🆘", title: "Emergency SOS",         desc: "One-tap alert sends your location to emergency contacts instantly." },
  { icon: "📍", title: "Live Location Share",    desc: "Share real-time location with trusted friends during any meetup." },
  { icon: "✅", title: "Check-In System",        desc: "Auto check-in reminders — your guardian is always in the loop." },
  { icon: "🤖", title: "AI Moderation",          desc: "Proactive detection of fake profiles, harassment, and scams." },
];

const tickerItems = [
  "50,000+ Active Users",
  "Intent-Based Matching",
  "Verified Profiles Only",
  "Real-Time Chat",
  "200+ Cities",
  "Safety Built-In",
  "4.9★ Rated App",
  "AI-Powered Compatibility",
];

export default function Home() {
  return (
    <div className="home">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="h-hero">
        <div className="h-grid-lines" />
        <div className="h-orb h-orb-1" />
        <div className="h-orb h-orb-2" />
        <div className="h-orb h-orb-3" />

        <div className="h-hero-content">
          <div className="h-eyebrow h-fade-up h-d1">
            <span className="dot" />
            India's #1 Intent-Based Companion Platform
          </div>

          <h1 className="h-hero-title h-fade-up h-d2">
            Find Someone to<br />
            <span className="h-grad">Share Life With</span>
          </h1>

          <p className="h-hero-sub h-fade-up h-d3">
            Not just dating — find partners for walking, travel, food, fitness, work, and more.
            Matchera understands <em>what</em> you want, not just <em>who</em> you want.
          </p>

          <div className="h-hero-cta h-fade-up h-d4">
            <Link to="/register" className="h-btn-primary">
              🚀 Start for Free
            </Link>
            <Link to="/login" className="h-btn-outline">
              Sign In →
            </Link>
          </div>

          <div className="h-pills h-fade-up h-d5">
            {Object.entries(INTENT_CONFIG).map(([key, cfg]) => (
              <span key={key} className="h-pill">
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ─────────────────────────────────────────────────────── */}
      <div className="h-ticker">
        <div className="h-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="h-ticker-item">
              <span className="h-ticker-sep">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <div className="h-stats">
        <div className="h-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="h-stat">
              <span className="h-stat-icon">{s.icon}</span>
              <span className="h-stat-val">{s.value}</span>
              <span className="h-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="h-section h-section-dark">
        <div className="h-container">
          <div className="h-section-header">
            <div className="h-section-tag">⚡ How It Works</div>
            <h2 className="h-section-title">Three Steps to Your <span className="h-grad">Perfect Match</span></h2>
            <p className="h-section-desc">From intent to in-person — Matchera makes it seamless, safe, and meaningful.</p>
          </div>
          <div className="h-steps">
            {steps.map((s, i) => (
              <div key={i} className={`h-step h-fade-up h-d${i + 1}`}>
                <div className="h-step-num">{s.num}</div>
                <span className="h-step-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTENT SHOWCASE ────────────────────────────────────────────── */}
      <section className="h-section h-section-mid">
        <div className="h-container">
          <div className="h-section-header">
            <div className="h-section-tag">🎯 Match by Intent</div>
            <h2 className="h-section-title">Every Kind of <span className="h-grad">Connection</span></h2>
            <p className="h-section-desc">From casual coffee to long-haul travel — Matchera has an intent category for every moment.</p>
          </div>
          <div className="h-intents-grid">
            {intentData.map(({ key, desc }) => {
              const cfg = INTENT_CONFIG[key];
              if (!cfg) return null;
              return (
                <div
                  key={key}
                  className="h-intent-card"
                  style={{
                    background: cfg.bg,
                    borderColor: cfg.color + "44",
                    color: cfg.color,
                  }}
                >
                  <span className="h-ic-emoji">{cfg.icon}</span>
                  <h4 style={{ color: cfg.color }}>{cfg.label}</h4>
                  <p style={{ color: cfg.color }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section className="h-section h-section-dark">
        <div className="h-container">
          <div className="h-section-header">
            <div className="h-section-tag">✨ Platform Features</div>
            <h2 className="h-section-title">Everything You Need to <span className="h-grad">Connect</span></h2>
            <p className="h-section-desc">A complete ecosystem built for purposeful, safe, and meaningful human connections.</p>
          </div>
          <div className="h-features">
            {features.map((f, i) => (
              <div key={i} className={`h-feat h-fade-up h-d${(i % 3) + 1}`}>
                <div className="h-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="h-section h-section-mid">
        <div className="h-container">
          <div className="h-section-header">
            <div className="h-section-tag">💬 Real Stories</div>
            <h2 className="h-section-title">Loved by <span className="h-grad">Thousands</span></h2>
            <p className="h-section-desc">Real users, real connections, real results — across India.</p>
          </div>
          <div className="h-testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`h-testi h-fade-up h-d${i + 1}`}>
                <div className="h-testi-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="h-testi-text">"{t.text}"</p>
                <div className="h-testi-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <p className="h-testi-name">{t.name}</p>
                    <p className="h-testi-meta">
                      {INTENT_CONFIG[t.intent]?.icon} {INTENT_CONFIG[t.intent]?.label} · {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY BAND ────────────────────────────────────────────────── */}
      <div className="h-safety">
        <div className="h-safety-inner">
          <div>
            <div className="h-section-tag">🛡️ Your Safety Matters</div>
            <h2 className="h-section-title" style={{ marginTop: 16 }}>
              Meet Confidently,<br /><span className="h-grad">Stay Protected</span>
            </h2>
            <p className="h-section-desc" style={{ marginTop: 16 }}>
              Matchera is built safety-first. Every feature, from profile verification to live check-ins,
              is designed to ensure your meetups are safe, comfortable, and trusted.
            </p>
            <Link to="/register" className="h-btn-primary" style={{ marginTop: 32, display: "inline-flex" }}>
              Join Safely — It's Free
            </Link>
          </div>
          <div className="h-safety-features">
            {safetyFeatures.map((s, i) => (
              <div key={i} className="h-safety-item">
                <span className="h-safety-icon">{s.icon}</span>
                <div>
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="h-cta">
        <div className="h-cta-ring h-cta-ring-1" />
        <div className="h-cta-ring h-cta-ring-2" />
        <div className="h-cta-ring h-cta-ring-3" />
        <div className="h-cta-content">
          <div className="h-section-tag" style={{ margin: "0 auto 20px" }}>🎉 Join Matchera Today</div>
          <h2>
            Ready to Find Your<br />
            <span className="h-grad">Perfect Companion?</span>
          </h2>
          <p>Join 50,000+ people across India already using Matchera to find meaningful, purposeful connections.</p>
          <div className="h-cta-btns">
            <Link to="/register" className="h-btn-primary">✨ Create Free Account</Link>
            <Link to="/login"    className="h-btn-outline">I Have an Account →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="h-footer">
        <div className="h-footer-inner">
          <div className="h-footer-top">
            <div className="h-footer-brand">
              <img src="/matchera-logo.jpeg" alt="Matchera" />
              <p>India's #1 intent-based companion platform. Find partners for every moment of life — safely and meaningfully.</p>
            </div>
            <div className="h-footer-col">
              <h5>Platform</h5>
              <a href="#">Explore</a>
              <a href="#">Sessions</a>
              <a href="#">Matches</a>
              <a href="#">Safety</a>
            </div>
            <div className="h-footer-col">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            <div className="h-footer-col">
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Safety Guidelines</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="h-footer-bottom">
            <p className="h-footer-copy">© 2025 Matchera. Built with ❤️ for meaningful connections.</p>
            <div className="h-footer-socials">
              <a href="#" className="h-footer-social">𝕏</a>
              <a href="#" className="h-footer-social">in</a>
              <a href="#" className="h-footer-social">ig</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
