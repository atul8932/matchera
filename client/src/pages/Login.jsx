import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate("/explore");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />

      <div className="auth-container animate-scale-in">
        <Link to="/" className="auth-logo">
          <span>💫</span>
          <img src="/matchera-logo.png" alt="Matchera" style={{ height: 40 }} />
        </Link>

        <div className="auth-card glass">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Matchera account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">Email or Phone</label>
              <div className="input-icon">
                <span className="icon">📧</span>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-icon">
                <span className="icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign In →"}
            </button>
          </form>

          <div className="divider">or</div>

          {/* Demo login */}
          <button
            className="btn btn-outline"
            style={{ width: "100%" }}
            onClick={() => setForm({ email: "demo@companion.app", password: "demo123" })}
          >
            🎭 Fill Demo Credentials
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}