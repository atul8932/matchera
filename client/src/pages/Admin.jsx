import { useState, useEffect } from "react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { generateAvatarUrl } from "../utils/constants";
import "./Admin.css";

export default function Admin() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Passkey gate state
  const [passkey, setPasskey] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch { toast.error("Failed to load stats"); }
    finally { setLoading(false); }
  };

  const loadUsers = async (status = "") => {
    try {
      const params = { limit: 30 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await api.get("/admin/users", { params });
      setUsers(res.data.users);
    } catch { toast.error("Failed to load users"); }
  };

  const loadReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch { toast.error("Failed to load reports"); }
  };

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "reports") loadReports();
  }, [tab]);

  const banUser = async (userId, ban) => {
    try {
      await api.put(`/admin/users/${userId}/ban`, { ban });
      toast.success(ban ? "User banned" : "User unbanned");
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isBanned: ban } : u));
    } catch { toast.error("Action failed"); }
  };

  const verifyUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`);
      toast.success("User verified with blue tick ✓");
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isVerified: true } : u));
    } catch { toast.error("Action failed"); }
  };

  const resolveReport = async (reportId, status) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { status });
      toast.success(`Report ${status}`);
      setReports((prev) => prev.map((r) => r._id === reportId ? { ...r, status } : r));
    } catch { toast.error("Action failed"); }
  };

  // ── Submit passkey to unlock admin ─────────────────────────────────────
  const handlePasskey = async (e) => {
    e.preventDefault();
    if (!passkey.trim()) { toast.error("Enter the admin passkey"); return; }
    setPasskeyLoading(true);
    try {
      const res = await api.post("/auth/admin-passkey", { passkey });
      login(res.data.user, res.data.token); // refresh auth context with admin role
      toast.success("Admin access granted! 🔓");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid passkey");
    } finally {
      setPasskeyLoading(false);
      setPasskey("");
    }
  };

  // ── Gate: show passkey form if not admin ───────────────────────────────
  if (user?.role !== "admin") {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <div className="card animate-scale-in" style={{ padding: "44px 36px", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <p style={{ fontSize: "3.5rem", marginBottom: 8 }}>🔐</p>
          <h3 style={{ marginBottom: 6, fontSize: "1.3rem" }}>Admin Access Required</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 28 }}>
            Enter the secret passkey to unlock the control panel.
          </p>

          <form onSubmit={handlePasskey} style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
            <div className="input-group">
              <label className="input-label">Admin Passkey</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showKey ? "text" : "password"}
                  className="input"
                  placeholder="Enter secret passkey..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  autoComplete="off"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", fontSize: "1.1rem",
                    color: "var(--text-muted)", padding: 0
                  }}
                >
                  {showKey ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={passkeyLoading}>
              {passkeyLoading ? <span className="spinner" /> : "🔓 Unlock Admin Panel"}
            </button>
          </form>

          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 20 }}>
            Set <code style={{ background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>ADMIN_PASSKEY</code> in your Render environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h2>⚙️ Admin Panel</h2>
            <p className="text-muted">Manage users, reports, and platform analytics</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "users", label: "👥 Users" },
            { key: "reports", label: "🚩 Reports" },
          ].map((t) => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="admin-overview animate-fade-in">
            {loading ? (
              <div className="stats-grid">
                {Array.from({ length: 7 }, (_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
              </div>
            ) : stats && (
              <div className="stats-grid">
                {[
                  { label: "Total Users",    value: stats.totalUsers,    icon: "👥", color: "#2563EB" },
                  { label: "Active Users",   value: stats.activeUsers,   icon: "🟢", color: "#22C55E" },
                  { label: "New Today",      value: stats.newUsersToday, icon: "✨", color: "#60A5FA" },
                  { label: "Total Sessions", value: stats.totalSessions, icon: "📅", color: "#F59E0B" },
                  { label: "Total Matches",  value: stats.totalMatches,  icon: "💙", color: "#93C5FD" },
                  { label: "Pending Reports", value: stats.pendingReports, icon: "🚩", color: "#ef4444" },
                  { label: "Banned Users", value: stats.bannedUsers, icon: "🚫", color: "#6b7280" },
                ].map((s, i) => (
                  <div key={i} className="stat-box card">
                    <div className="stat-box-icon" style={{ color: s.color }}>{s.icon}</div>
                    <div className="stat-box-val" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-box-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="animate-fade-in">
            <div className="admin-search-bar">
              <input
                className="input"
                placeholder="🔍 Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadUsers()}
                style={{ flex: 1 }}
              />
              <select className="input" style={{ width: "auto" }} onChange={(e) => loadUsers(e.target.value)}>
                <option value="">All</option>
                <option value="banned">Banned</option>
                <option value="flagged">Flagged</option>
                <option value="verified">Verified</option>
              </select>
              <button className="btn btn-outline btn-sm" onClick={() => loadUsers()}>Search</button>
            </div>

            <div className="admin-table card">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className={u.isBanned ? "banned-row" : ""}>
                      <td>
                        <div className="admin-user-cell">
                          <img src={u.profilePhoto || generateAvatarUrl(u.name)} alt={u.name} className="avatar avatar-sm" />
                          <div>
                            <p style={{ fontWeight: 600 }}>{u.name}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.age && `${u.age}y`} {u.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{u.email || u.phone}</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {u.isBanned && <span className="badge badge-danger">Banned</span>}
                          {u.isVerified && <span className="badge badge-verified">✓ Verified</span>}
                          {u.isAdminFlagged && <span className="badge badge-warning">Flagged</span>}
                          {u.role === "admin" && <span className="badge badge-primary">Admin</span>}
                          {!u.isBanned && !u.isVerified && !u.isAdminFlagged && u.role !== "admin" && (
                            <span className="badge" style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}>Active</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {!u.isBanned ? (
                            <button className="btn btn-danger btn-sm" onClick={() => banUser(u._id, true)}>Ban</button>
                          ) : (
                            <button className="btn btn-outline btn-sm" onClick={() => banUser(u._id, false)}>Unban</button>
                          )}
                          {!u.isVerified && (
                            <button className="btn btn-outline btn-sm" onClick={() => verifyUser(u._id)}>Verify ✓</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports */}
        {tab === "reports" && (
          <div className="animate-fade-in">
            <div className="reports-list">
              {reports.length === 0 ? (
                <div className="card" style={{ padding: 60, textAlign: "center" }}>
                  <p style={{ fontSize: "2.5rem" }}>✅</p>
                  <h3 style={{ marginTop: 12 }}>No pending reports</h3>
                  <p style={{ color: "var(--text-secondary)" }}>The platform is clean!</p>
                </div>
              ) : reports.map((report) => (
                <div key={report._id} className="report-card card animate-fade-in">
                  <div className="report-header">
                    <div className="report-users">
                      <div className="report-user">
                        <img src={report.reporter?.profilePhoto || generateAvatarUrl(report.reporter?.name)} alt="" className="avatar avatar-sm" />
                        <span>{report.reporter?.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>reported</span>
                      </div>
                      <span>→</span>
                      <div className="report-user">
                        <img src={report.reported?.profilePhoto || generateAvatarUrl(report.reported?.name)} alt="" className="avatar avatar-sm" />
                        <span>{report.reported?.name}</span>
                      </div>
                    </div>
                    <span className={`badge ${report.status === "pending" ? "badge-warning" : report.status === "resolved" ? "badge-success" : "badge-danger"}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-body">
                    <p><strong>Reason:</strong> {report.reason}</p>
                    {report.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{report.description}</p>}
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      Reported {new Date(report.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="report-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => resolveReport(report._id, "dismissed")}>Dismiss</button>
                      <button className="btn btn-danger btn-sm" onClick={() => resolveReport(report._id, "resolved")}>Mark Resolved</button>
                      <button className="btn btn-primary btn-sm" onClick={() => banUser(report.reported?._id, true)}>Ban User</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
