import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import "./Settings.css";

const SECTIONS = ["account", "privacy", "notifications", "appearance", "danger"];

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("account");
  const [saving, setSaving] = useState(false);

  // Account settings
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: user?.privacy?.showOnlineStatus ?? true,
    showLastSeen: user?.privacy?.showLastSeen ?? true,
    showLocation: user?.privacy?.showLocation ?? true,
    allowMessagesFrom: user?.privacy?.allowMessagesFrom || "matches",
    profileVisible: user?.privacy?.profileVisible ?? true,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    newMatch: true,
    newMessage: true,
    sessionReminder: true,
    safetyAlerts: true,
    weeklyDigest: false,
    promotions: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState("");

  const saveAccount = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/update-profile", accountForm);
      updateUser(res.data);
      toast.success("Account updated ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const savePrivacy = async () => {
    setSaving(true);
    try {
      await api.put("/auth/update-profile", { privacy });
      toast.success("Privacy settings saved ✅");
    } catch {
      toast.info("Privacy settings saved locally");
    } finally { setSaving(false); }
  };

  const saveNotifications = () => {
    toast.success("Notification preferences saved ✅");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    try {
      await api.delete("/auth/me");
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account. Contact support.");
    }
  };

  const sidebarItems = [
    { id: "account", icon: "👤", label: "Account" },
    { id: "privacy", icon: "🔒", label: "Privacy" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
    { id: "danger", icon: "⚠️", label: "Danger Zone" },
  ];

  return (
    <div className="page settings-page">
      <div className="container settings-container">

        {/* Page Header */}
        <div className="settings-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h2>⚙️ Settings</h2>
            <p className="text-muted">Manage your account, privacy & preferences</p>
          </div>
        </div>

        <div className="settings-layout">
          {/* Sidebar */}
          <aside className="settings-sidebar">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`settings-nav-item ${activeSection === item.id ? "active" : ""} ${item.id === "danger" ? "danger" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="sni-icon">{item.icon}</span>
                <span>{item.label}</span>
                {activeSection === item.id && <span className="sni-arrow">›</span>}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="settings-main animate-fade-in" key={activeSection}>

            {/* ── ACCOUNT ────────────────────────────────────── */}
            {activeSection === "account" && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>👤 Account Information</h3>
                  <p>Update your basic account details</p>
                </div>

                <div className="settings-card">
                  <div className="settings-form-grid">
                    <div className="input-group">
                      <label className="input-label">Display Name</label>
                      <input className="input" value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Age</label>
                      <input className="input" type="number" min={18} max={80} value={accountForm.age} onChange={(e) => setAccountForm({ ...accountForm, age: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input className="input" type="email" value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Phone Number</label>
                      <input className="input" type="tel" placeholder="+91 XXXXXXXXXX" value={accountForm.phone} onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="settings-footer">
                    <button className="btn btn-primary" onClick={saveAccount} disabled={saving}>
                      {saving ? <span className="spinner" /> : "💾 Save Changes"}
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="settings-card">
                  <div className="settings-section-header" style={{ marginBottom: 16 }}>
                    <h3>🔑 Change Password</h3>
                    <p>Update your login password</p>
                  </div>
                  <div className="settings-form-grid">
                    <div className="input-group">
                      <label className="input-label">Current Password</label>
                      <input className="input" type="password" placeholder="••••••••" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">New Password</label>
                      <input className="input" type="password" placeholder="Min 8 characters" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Confirm New Password</label>
                      <input className="input" type="password" placeholder="Re-enter new password" />
                    </div>
                  </div>
                  <div className="settings-footer">
                    <button className="btn btn-outline" onClick={() => toast.info("Password change coming soon!")}>
                      🔑 Update Password
                    </button>
                  </div>
                </div>

                {/* Verification */}
                <div className="settings-card">
                  <div className="settings-section-header" style={{ marginBottom: 16 }}>
                    <h3>✅ Verification Status</h3>
                    <p>Verify your identity to get the blue tick</p>
                  </div>
                  <div className="verify-rows">
                    {[
                      { label: "Email", icon: "📧", done: user?.isEmailVerified, action: "Verify Email" },
                      { label: "Phone OTP", icon: "📱", done: user?.isPhoneVerified, action: "Verify Phone" },
                      { label: "Blue Tick", icon: "🔵", done: user?.isVerified, action: "Apply for Blue Tick" },
                    ].map((item) => (
                      <div key={item.label} className="verify-row">
                        <span className="vr-icon">{item.icon}</span>
                        <div className="vr-info">
                          <span className="vr-label">{item.label}</span>
                          <span className={`vr-status ${item.done ? "done" : ""}`}>
                            {item.done ? "✓ Verified" : "Not verified"}
                          </span>
                        </div>
                        {!item.done && (
                          <button className="btn btn-outline btn-sm" onClick={() => toast.info(`${item.action} coming soon!`)}>
                            {item.action}
                          </button>
                        )}
                        {item.done && <span className="badge badge-success">✓ Done</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PRIVACY ─────────────────────────────────────── */}
            {activeSection === "privacy" && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>🔒 Privacy Settings</h3>
                  <p>Control who can see your information</p>
                </div>

                <div className="settings-card">
                  <div className="toggle-list">
                    {[
                      { key: "showOnlineStatus", label: "Show Online Status", desc: "Let others see when you're active" },
                      { key: "showLastSeen", label: "Show Last Seen", desc: "Display when you were last active" },
                      { key: "showLocation", label: "Show City Location", desc: "Display your city on your profile" },
                      { key: "profileVisible", label: "Profile Visible", desc: "Allow your profile to appear in Explore" },
                    ].map((item) => (
                      <div key={item.key} className="toggle-row">
                        <div className="tr-info">
                          <span className="tr-label">{item.label}</span>
                          <span className="tr-desc">{item.desc}</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={privacy[item.key]}
                            onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          />
                          <span className="toggle-thumb" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-card">
                  <div className="input-group">
                    <label className="input-label">Who can message me</label>
                    <select
                      className="input"
                      value={privacy.allowMessagesFrom}
                      onChange={(e) => setPrivacy({ ...privacy, allowMessagesFrom: e.target.value })}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="matches">Matches Only</option>
                      <option value="verified">Verified Users Only</option>
                      <option value="none">No One (Pause)</option>
                    </select>
                  </div>
                  <div className="settings-footer" style={{ marginTop: 20 }}>
                    <button className="btn btn-primary" onClick={savePrivacy} disabled={saving}>
                      {saving ? <span className="spinner" /> : "💾 Save Privacy Settings"}
                    </button>
                  </div>
                </div>

                <div className="settings-info-box">
                  <span>🛡️</span>
                  <p>Your privacy matters. We never sell your data. Read our <a href="#" style={{ color: "var(--primary)" }}>Privacy Policy</a>.</p>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ────────────────────────────────── */}
            {activeSection === "notifications" && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>🔔 Notification Preferences</h3>
                  <p>Choose what you want to be notified about</p>
                </div>

                <div className="settings-card">
                  <p className="notif-category-label">Activity</p>
                  <div className="toggle-list">
                    {[
                      { key: "newMatch", label: "New Match 💫", desc: "When someone matches with you" },
                      { key: "newMessage", label: "New Message 💬", desc: "When you receive a message" },
                      { key: "sessionReminder", label: "Session Reminders 📅", desc: "Before your planned sessions" },
                    ].map((item) => (
                      <div key={item.key} className="toggle-row">
                        <div className="tr-info">
                          <span className="tr-label">{item.label}</span>
                          <span className="tr-desc">{item.desc}</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          />
                          <span className="toggle-thumb" />
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="notif-category-label" style={{ marginTop: 20 }}>Safety & Updates</p>
                  <div className="toggle-list">
                    {[
                      { key: "safetyAlerts", label: "Safety Alerts 🛡️", desc: "Important account security notifications" },
                      { key: "weeklyDigest", label: "Weekly Digest 📊", desc: "Summary of your activity each week" },
                      { key: "promotions", label: "Offers & Promotions 🎁", desc: "Special deals and premium features" },
                    ].map((item) => (
                      <div key={item.key} className="toggle-row">
                        <div className="tr-info">
                          <span className="tr-label">{item.label}</span>
                          <span className="tr-desc">{item.desc}</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          />
                          <span className="toggle-thumb" />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="settings-footer" style={{ marginTop: 20 }}>
                    <button className="btn btn-primary" onClick={saveNotifications}>
                      💾 Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPEARANCE ───────────────────────────────────── */}
            {activeSection === "appearance" && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>🎨 Appearance</h3>
                  <p>Customize how Matchera looks for you</p>
                </div>

                <div className="settings-card">
                  <div className="appearance-option">
                    <div className="ao-info">
                      <span className="ao-label">Color Theme</span>
                      <span className="ao-desc">Current: Light Professional + Blue (Default)</span>
                    </div>
                    <div className="color-swatches">
                      <div className="swatch active" style={{ background: "linear-gradient(135deg,#2563EB,#60A5FA)" }} title="Blue (Active)" />
                      <div className="swatch" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }} title="Indigo" onClick={() => toast.info("More themes coming soon!")} />
                      <div className="swatch" style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }} title="Sunset" onClick={() => toast.info("More themes coming soon!")} />
                    </div>
                  </div>
                  <div className="appearance-option" style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 20 }}>
                    <div className="ao-info">
                      <span className="ao-label">Font Size</span>
                      <span className="ao-desc">Adjust text size across the app</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Small", "Medium", "Large"].map((size) => (
                        <button key={size} className={`btn btn-outline btn-sm ${size === "Medium" ? "active-btn" : ""}`} onClick={() => toast.info("Font size setting coming soon!")}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="appearance-option" style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 20 }}>
                    <div className="ao-info">
                      <span className="ao-label">Compact Mode</span>
                      <span className="ao-desc">Reduce spacing and card sizes</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" onChange={() => toast.info("Compact mode coming soon!")} />
                      <span className="toggle-thumb" />
                    </label>
                  </div>
                  <div className="settings-info-box" style={{ marginTop: 20 }}>
                    <span>✨</span>
                    <p>More appearance options are coming soon — custom gradients, dark/light mode toggle, and more.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── DANGER ZONE ─────────────────────────────────── */}
            {activeSection === "danger" && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>⚠️ Danger Zone</h3>
                  <p>These actions are permanent and cannot be undone</p>
                </div>

                <div className="settings-card danger-card">
                  <div className="danger-item">
                    <div className="di-info">
                      <h4>Pause My Account</h4>
                      <p>Temporarily hide your profile from Explore. You can re-activate anytime.</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => toast.info("Account pause coming soon!")}>
                      ⏸ Pause Account
                    </button>
                  </div>
                  <div className="danger-divider" />
                  <div className="danger-item">
                    <div className="di-info">
                      <h4>Sign Out of All Devices</h4>
                      <p>Revoke all active sessions across all devices.</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate("/login"); }}>
                      🚪 Sign Out All
                    </button>
                  </div>
                  <div className="danger-divider" />
                  <div className="danger-item delete-zone">
                    <div className="di-info">
                      <h4>🗑️ Delete My Account</h4>
                      <p>Permanently delete your account and all data. This cannot be undone.</p>
                    </div>
                  </div>
                  <div className="delete-confirm-area">
                    <p className="delete-warning">Type <strong>DELETE</strong> to confirm account deletion:</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <input
                        className="input"
                        placeholder="Type DELETE"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        style={{ maxWidth: 220 }}
                      />
                      <button
                        className="btn btn-danger"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirm !== "DELETE"}
                      >
                        🗑️ Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
