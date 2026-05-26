import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { INTENT_CONFIG, BUDGET_CONFIG } from "../utils/constants";
import "./Sessions.css";

const TYPES = Object.keys(INTENT_CONFIG);
const BUDGETS = Object.keys(BUDGET_CONFIG);

export default function Sessions() {
  const { user } = useAuth();
  const toast = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ type: "", budget: "", city: "" });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", type: "food", city: "", venue: "",
    time: "", budget: "moderate", maxParticipants: 1, tags: "",
  });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await api.get("/sessions", { params });
      setSessions(res.data);
    } catch { toast.error("Failed to load sessions"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.time) { toast.error("Fill required fields"); return; }
    setCreating(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      const res = await api.post("/sessions", payload);
      setSessions((prev) => [res.data, ...prev]);
      setShowCreate(false);
      toast.success("Session created! 🎉");
      setForm({ title: "", description: "", type: "food", city: "", venue: "", time: "", budget: "moderate", maxParticipants: 1, tags: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create session");
    } finally { setCreating(false); }
  };

  const handleJoin = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/join`);
      toast.success("Join request sent! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="page sessions-page">
      <div className="container">
        <div className="sessions-header">
          <div>
            <h2>Matchera Sessions</h2>
            <p className="text-muted">Post or join real-life sessions — breakfast, trek, coffee, study & more</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            🚀 Create Session
          </button>
        </div>

        {/* Quick stats */}
        <div className="sessions-stats">
          <div className="sess-stat-card">
            <span className="sess-stat-icon">📅</span>
            <div>
              <div className="sess-stat-val gradient-text">{sessions.length}</div>
              <div className="sess-stat-label">Active Sessions</div>
            </div>
          </div>
          <div className="sess-stat-card">
            <span className="sess-stat-icon">✅</span>
            <div>
              <div className="sess-stat-val" style={{ color: "#34d399" }}>{sessions.filter(s => s.status === "open").length}</div>
              <div className="sess-stat-label">Open to Join</div>
            </div>
          </div>
          <div className="sess-stat-card">
            <span className="sess-stat-icon">🌆</span>
            <div>
              <div className="sess-stat-val" style={{ color: "#f59e0b" }}>{[...new Set(sessions.map(s => s.location?.city).filter(Boolean))].length}</div>
              <div className="sess-stat-label">Cities</div>
            </div>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="create-session-card card animate-fade-in">
            <h3>Create a Session</h3>
            <form onSubmit={handleCreate} className="session-form">
              <div className="form-row-3">
                <div className="input-group">
                  <label className="input-label">Title *</label>
                  <input className="input" placeholder="e.g. Breakfast at CP" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Type *</label>
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map((k) => <option key={k} value={k}>{INTENT_CONFIG[k].icon} {INTENT_CONFIG[k].label}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Budget</label>
                  <select className="input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                    {BUDGETS.map((k) => <option key={k} value={k}>{BUDGET_CONFIG[k].icon} {BUDGET_CONFIG[k].label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Venue</label>
                  <input className="input" placeholder="Specific place (optional)" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Date & Time *</label>
                  <input className="input" type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Max People</label>
                  <input className="input" type="number" min={1} max={10} value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input" rows={2} placeholder="Tell more about this session..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "none" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Tags (comma separated)</label>
                <input className="input" placeholder="e.g. vegetarian, pet-friendly, nightlife" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? <span className="spinner" /> : "🚀 Post Session"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="session-filters">
          <select className="input" style={{ width: "auto" }} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            {TYPES.map((k) => <option key={k} value={k}>{INTENT_CONFIG[k].icon} {INTENT_CONFIG[k].label}</option>)}
          </select>
          <select className="input" style={{ width: "auto" }} value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })}>
            <option value="">Any Budget</option>
            {BUDGETS.map((k) => <option key={k} value={k}>{BUDGET_CONFIG[k].label}</option>)}
          </select>
          <input className="input" style={{ width: "auto" }} placeholder="🌆 City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <button className="btn btn-outline btn-sm" onClick={fetchSessions}>Search</button>
        </div>

        {/* Sessions grid */}
        {loading ? (
          <div className="sessions-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton" style={{ height: 220 }} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="no-sessions card">
            <div className="no-sessions-inner">
              <div className="ns-icon">📅</div>
              <h3>No sessions found</h3>
              <p>Be the first to create one! Hit the button above to post your session.</p>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setShowCreate(true)}>+ Create Session</button>
            </div>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((s) => {
              const cfg = INTENT_CONFIG[s.type];
              const isOwner = s.createdBy?._id === user?._id;
              return (
                <div key={s._id} className="session-card card animate-fade-in">
                  <div className="session-card-inner">
                    <div className="session-top">
                      <div className="session-type-badge" style={{ background: cfg?.bg, color: cfg?.color }}>
                        {cfg?.icon} {cfg?.label}
                      </div>
                      <span className={`badge ${s.status === "open" ? "badge-success" : "badge-warning"}`}>
                        {s.status === "open" ? "🟢 Open" : "🔴 Full"}
                      </span>
                    </div>
                    <h3 className="session-title">{s.title}</h3>
                    {s.description && <p className="session-desc">{s.description}</p>}
                    <div className="session-meta">
                      <span>📍 {s.location?.city}{s.location?.venue ? ` • ${s.location.venue}` : ""}</span>
                      <span>🕐 {formatDate(s.time)}</span>
                      <span>{BUDGET_CONFIG[s.budget]?.icon} {BUDGET_CONFIG[s.budget]?.label}</span>
                      <span>👥 {s.participants?.length || 0}/{s.maxParticipants} people</span>
                    </div>
                    {s.tags?.length > 0 && (
                      <div className="session-tags">
                        {s.tags.map((tag) => <span key={tag} className="tag" style={{ fontSize: "0.75rem" }}>{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="session-footer">
                    <div className="session-creator">
                      <img
                        src={s.createdBy?.profilePhoto || `https://ui-avatars.com/api/?name=${s.createdBy?.name}&background=14B8A6&color=0F172A&bold=true&size=64`}
                        alt={s.createdBy?.name}
                        className="avatar avatar-sm"
                      />
                      <span>{s.createdBy?.name}</span>
                      {s.createdBy?.isVerified && <span className="badge badge-verified" style={{ fontSize: "0.65rem" }}>✓</span>}
                    </div>
                    {!isOwner && s.status === "open" && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleJoin(s._id)}>
                        Join →
                      </button>
                    )}
                    {isOwner && <span className="badge badge-primary">⭐ Your session</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
