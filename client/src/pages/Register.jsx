import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { INTENT_CONFIG, MOOD_CONFIG } from "../utils/constants";
import "./Auth.css";

const STEPS = ["Account", "Profile", "Preferences"];

const INTERESTS_LIST = [
  "Music", "Travel", "Cooking", "Fitness", "Reading", "Movies", "Photography",
  "Art", "Gaming", "Yoga", "Hiking", "Dancing", "Coding", "Fashion", "Sports",
];

export default function Register() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    age: "", gender: "", bio: "", location: "",
    intents: [], interests: [], mood: "chill",
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const toggleIntent = (key) => {
    setForm((p) => ({
      ...p,
      intents: p.intents.includes(key) ? p.intents.filter((i) => i !== key) : [...p.intents, key],
    }));
  };

  const toggleInterest = (interest) => {
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  const nextStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password) { toast.error("Fill all required fields"); return; }
      if (form.password !== form.confirmPassword) { toast.error("Passwords don't match"); return; }
      if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    }
    if (step === 1) {
      if (!form.age || !form.gender || !form.location) { toast.error("Fill all profile fields"); return; }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const toggleMood = (key) => {
    setForm((p) => ({ ...p, mood: p.mood === key ? "" : key }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.intents.length === 0) { toast.error("Select at least one intent"); return; }
    if (!agreed) { toast.error("Please accept the Terms & Privacy Policy to continue"); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      const res = await api.post("/auth/register", payload);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to Matchera, ${res.data.user.name}! 🎉`);
      navigate("/explore");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />

      <div className="auth-container register-container animate-scale-in">
        <Link to="/" className="auth-logo">
          <span>💫</span>
          <img src="/matchera-logo.png" alt="Matchera" style={{ height: 40 }} />
        </Link>

        <div className="auth-card glass">
          {/* Step indicator */}
          <div className="step-indicator">
            {STEPS.map((s, i) => (
              <div key={i} className={`step-dot-wrap ${i <= step ? "active" : ""}`}>
                <div className={`step-dot ${i < step ? "done" : i === step ? "current" : ""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span>{s}</span>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
              </div>
            ))}
          </div>

          <div className="auth-header">
            <h2>{step === 0 ? "Create Account" : step === 1 ? "Your Profile" : "Your Preferences"}</h2>
            <p>{step === 0 ? "Join thousands on Matchera" : step === 1 ? "Tell others about yourself" : "What are you looking for?"}</p>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {/* Step 0: Account */}
            {step === 0 && (
              <div className="form-grid animate-fade-in">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="input" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Password *</label>
                  <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm Password *</label>
                  <input className="input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="form-grid animate-fade-in">
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Age *</label>
                    <input className="input" type="number" min="18" max="60" placeholder="18-60" value={form.age} onChange={(e) => update("age", e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Gender *</label>
                    <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-Binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input className="input" placeholder="e.g. Delhi, Mumbai, Bangalore" value={form.location} onChange={(e) => update("location", e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Bio (optional)</label>
                  <textarea className="input" rows={3} placeholder="Tell people about yourself..." value={form.bio} onChange={(e) => update("bio", e.target.value)} style={{ resize: "none" }} />
                </div>
              </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="pref-section">
                  <label className="input-label" style={{ marginBottom: 12, display: "block" }}>Looking for * (select all that apply)</label>
                  <div className="intent-picker">
                    {Object.entries(INTENT_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        className={`intent-pick-btn ${form.intents.includes(key) ? "selected" : ""}`}
                        style={{ "--color": cfg.color, "--bg": cfg.bg }}
                        onClick={() => toggleIntent(key)}
                      >
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pref-section">
                  <label className="input-label" style={{ marginBottom: 12, display: "block" }}>Your Mood</label>
                  <div className="mood-picker">
                    {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        className={`mood-btn ${form.mood === key ? "selected" : ""}`}
                        onClick={() => toggleMood(key)}
                      >
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pref-section">
                  <label className="input-label" style={{ marginBottom: 12, display: "block" }}>Interests (optional)</label>
                  <div className="interests-picker">
                    {INTERESTS_LIST.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={`tag ${form.interests.includes(interest) ? "active" : ""}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* T&C checkbox */}
                <label className="auth-tnc-row" style={{ marginTop: 16 }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="auth-tnc-checkbox"
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    I agree to Matchera's{" "}
                    <a href="/terms" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 600 }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 600 }}>Privacy Policy</a>
                  </span>
                </label>
              </div>
            )}

            <div className="form-actions">
              {step > 0 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                  ← Back
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading || (step === 2 && !agreed)}
              >
                {loading ? <span className="spinner" /> : step < 2 ? "Continue →" : "🚀 Create Account"}
              </button>
            </div>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}