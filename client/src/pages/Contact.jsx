import { useState } from "react";
import "./StaticPages.css";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">📬 Get in Touch</div>
        <h1>We'd Love to <span>Hear From You</span></h1>
        <p>Questions, feedback, partnerships, or press? We read every message and respond within 24 hours.</p>
      </div>

      <div className="sp-content-wide">
        <div className="sp-contact-grid">
          {/* Info */}
          <div className="sp-contact-info">
            <h2>Let's Talk</h2>
            <p>Whether you have a question about features, pricing, safety, or anything else — our team is ready to answer.</p>

            {[
              { icon: "📧", title: "Email Us", info: "hello@matchera.in", sub: "Replies within 24 hours" },
              { icon: "📞", title: "Call Us", info: "+91 98765 43210", sub: "Mon–Sat, 10am–6pm IST" },
              { icon: "📍", title: "HQ", info: "Connaught Place, New Delhi", sub: "110001, India" },
              { icon: "💼", title: "Business & Partnerships", info: "partners@matchera.in", sub: "B2B and enterprise inquiries" },
              { icon: "🛡️", title: "Safety & Trust", info: "safety@matchera.in", sub: "Report abuse or urgent issues" },
              { icon: "📰", title: "Press", info: "press@matchera.in", sub: "Media and journalist inquiries" },
            ].map((item, i) => (
              <div key={i} className="sp-contact-item">
                <div className="sp-contact-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p style={{ color: "var(--primary)", fontWeight: 500, marginBottom: 2 }}>{item.info}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="sp-form">
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "var(--text-secondary)" }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 20, background: "var(--primary)", color: "#fff", border: "none", borderRadius: 999, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ color: "var(--text-primary)", marginBottom: 24, fontSize: "1.2rem" }}>Send a Message</h3>
                <div className="sp-form-row">
                  <div className="sp-form-group">
                    <label>Your Name *</label>
                    <input required placeholder="Aarav Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="sp-form-group">
                    <label>Email Address *</label>
                    <input required type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div className="sp-form-group">
                  <label>Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="safety">Safety & Trust</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Product Feedback</option>
                  </select>
                </div>
                <div className="sp-form-group">
                  <label>Message *</label>
                  <textarea required rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>
                <button type="submit" className="sp-form-submit">Send Message 🚀</button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="sp-section" style={{ marginTop: 64 }}>
          <h2>Frequently Asked Questions</h2>
          <div className="sp-grid sp-grid-2" style={{ marginTop: 24 }}>
            {[
              { q: "Is Matchera free to use?", a: "Yes! The core experience — explore, match, and chat — is completely free. Premium features like seeing who liked you are available with a subscription." },
              { q: "How do I delete my account?", a: "Go to Settings → Account → Delete Account. Your data is permanently removed within 30 days per our Privacy Policy." },
              { q: "I found a fake profile. What do I do?", a: "Tap the '⋯' on any profile and hit 'Report'. Our safety team reviews all reports within 24 hours." },
              { q: "How do I become a verified user?", a: "Complete phone OTP verification, upload a selfie, and optionally submit a government ID for full blue-tick verification." },
            ].map((faq, i) => (
              <div key={i} className="sp-card">
                <h3 style={{ fontSize: "0.97rem", marginBottom: 8 }}>❓ {faq.q}</h3>
                <p style={{ fontSize: "0.9rem" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
