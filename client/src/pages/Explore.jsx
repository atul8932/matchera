import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { INTENT_CONFIG, MOOD_CONFIG, generateAvatarUrl, formatLastSeen, isOnline, getCompatibilityColor } from "../utils/constants";
import "./Explore.css";

const INTENTS = Object.keys(INTENT_CONFIG);

const COMPANION_TABS = [
  { key: "", icon: "✨", label: "All Types", desc: "Browse everyone", color: "#2563EB", bg: "#DBEAFE" },
  { key: "walking", icon: "🚶", label: "Walking Partner", desc: "Parks & neighbourhoods", color: "#16A34A", bg: "#DCFCE7" },
  { key: "travel", icon: "✈️", label: "Travel Buddy", desc: "Trips & adventures", color: "#2563EB", bg: "#DBEAFE" },
  { key: "food", icon: "🍽️", label: "Food Partner", desc: "Restaurants & cafés", color: "#D97706", bg: "#FEF3C7" },
  { key: "dating", icon: "❤️", label: "Dating", desc: "Meaningful connections", color: "#DB2777", bg: "#FCE7F3" },
  { key: "work-study", icon: "💻", label: "Work / Study", desc: "Focus & collaboration", color: "#7C3AED", bg: "#EDE9FE" },
  { key: "casual-dating", icon: "☕", label: "Casual Dating", desc: "Relaxed no-pressure vibes", color: "#0891B2", bg: "#CFFAFE" },
  { key: "fitness", icon: "🏃", label: "Fitness Buddy", desc: "Gym, yoga & workouts", color: "#DC2626", bg: "#FEE2E2" },
  { key: "events", icon: "🎉", label: "Events / Outings", desc: "Concerts & social fun", color: "#0284C7", bg: "#E0F2FE" },
];

export default function Explore() {
  const toast = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [filters, setFilters] = useState({ intent: "", gender: "", mood: "", city: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [matchModal, setMatchModal] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null);
  // Track IDs that have been liked/passed to prevent re-showing
  const seenIds = useRef(new Set());

  const fetchUsers = async (intentOverride) => {
    setLoading(true);
    try {
      const intentVal = intentOverride !== undefined ? intentOverride : filters.intent;
      const params = Object.fromEntries(
        Object.entries({ ...filters, intent: intentVal }).filter(([, v]) => v)
      );
      const res = await api.get("/users", { params });
      // Filter out already seen profiles
      const fresh = res.data.filter((u) => !seenIds.current.has(u._id));
      setUsers(fresh);
      setCurrentIdx(0);
    } catch {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Toggle companion tab — second click deselects
  const handleTabChange = (key) => {
    const newKey = activeTab === key ? "" : key;
    setActiveTab(newKey);
    setFilters(prev => ({ ...prev, intent: newKey }));
    seenIds.current = new Set(); // reset seen on filter change
    fetchUsers(newKey);
  };

  const handleLike = async () => {
    const user = users[currentIdx];
    if (!user) return;
    setSwipeDir("right");
    setTimeout(async () => {
      seenIds.current.add(user._id); // mark as seen
      try {
        const res = await api.post(`/users/${user._id}/like`);
        if (res.data.isMatch) {
          setMatchModal({ user, score: res.data.compatibilityScore });
        } else {
          toast.success("💜 Liked!");
        }
      } catch { toast.error("Failed to like"); }
      setCurrentIdx((i) => i + 1);
      setSwipeDir(null);
    }, 400);
  };

  const handlePass = async () => {
    const user = users[currentIdx];
    if (!user) return;
    setSwipeDir("left");
    setTimeout(async () => {
      seenIds.current.add(user._id); // mark as seen
      try { await api.post(`/users/${user._id}/pass`); } catch {}
      setCurrentIdx((i) => i + 1);
      setSwipeDir(null);
    }, 400);
  };

  const current = users[currentIdx];

  return (
    <div className="page explore-page">
      <div className="container">
        {/* Header */}
        <div className="explore-header">
          <div>
            <h2>Discover on Matchera</h2>
            <p className="text-muted">{Math.max(0, users.length - currentIdx)} profiles remaining</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)}>
            🔧 Filters
          </button>
        </div>

        {/* ── COMPANION TYPE CARDS ───────────────────────────── */}
        <div className="companion-cards-section">
          <div className="companion-cards-header">
            <div>
              <h3 className="companion-cards-title">What are you looking for?</h3>
              <p className="companion-cards-sub">Choose a type to filter · tap again to deselect</p>
            </div>
          </div>
          <div className="companion-cards-strip">
            {COMPANION_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`companion-card ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => handleTabChange(tab.key)}
                style={{ "--ctab-color": tab.color, "--ctab-bg": tab.bg }}
              >
                <div className="ccard-icon-wrap">
                  <span className="ccard-icon">{tab.icon}</span>
                </div>
                <div className="ccard-body">
                  <span className="ccard-title">{tab.label}</span>
                  <span className="ccard-desc">{tab.desc}</span>
                </div>
                {activeTab === tab.key && <span className="ccard-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel animate-fade-in">
            <div className="filters-grid">
              <div className="input-group">
                <label className="input-label">Intent</label>
                <select className="input" value={filters.intent} onChange={(e) => setFilters({ ...filters, intent: e.target.value })}>
                  <option value="">All Intents</option>
                  {INTENTS.map((k) => (
                    <option key={k} value={k}>{INTENT_CONFIG[k].icon} {INTENT_CONFIG[k].label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Gender</label>
                <select className="input" value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Mood</label>
                <select className="input" value={filters.mood} onChange={(e) => setFilters({ ...filters, mood: e.target.value })}>
                  <option value="">Any Mood</option>
                  {Object.entries(MOOD_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">City</label>
                <input className="input" placeholder="e.g. Mumbai" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { seenIds.current = new Set(); fetchUsers(); }}>Apply Filters</button>
          </div>
        )}

        {/* Card area */}
        <div className="explore-area">
          {loading ? (
            <div className="profile-card skeleton-card">
              <div className="skeleton" style={{ height: 300, borderRadius: "var(--radius-xl)" }} />
            </div>
          ) : !current ? (
            <div className="no-more-card card">
              <div className="no-more-icon">🌟</div>
              <h3>You've seen everyone!</h3>
              <p>Try changing your filters or check back later for new profiles.</p>
              <button className="btn btn-primary" onClick={() => { seenIds.current = new Set(); fetchUsers(); }}>
                🔄 Refresh Profiles
              </button>
            </div>
          ) : (
            <div className={`profile-card-wrapper ${swipeDir ? `swipe-${swipeDir}` : ""}`}>
              <div className="profile-card">
                {/* Photo */}
                <div className="profile-photo-wrap">
                  <img
                    src={current.profilePhoto || generateAvatarUrl(current.name)}
                    alt={current.name}
                    className="profile-photo"
                  />
                  <div className="profile-photo-overlay">
                    <div className="profile-quick-info">
                      {current.isVerified && <span className="badge badge-verified">✓ Verified</span>}
                      <span className={`online-badge ${isOnline(current.lastSeen) ? "online" : "offline"}`}>
                        {isOnline(current.lastSeen) ? "🟢 Online" : `⚫ ${formatLastSeen(current.lastSeen)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="profile-info">
                  <div className="profile-name-row">
                    <h3>{current.name}, <span>{current.age}</span></h3>
                    <div className="stars">
                      <span className="star filled">★</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{current.rating?.toFixed(1)}</span>
                    </div>
                  </div>

                  {current.location?.city && <p className="profile-location">📍 {current.location.city}</p>}
                  {current.bio && <p className="profile-bio">{current.bio}</p>}

                  <div className="profile-intents">
                    {current.intents?.map((intent) => {
                      const cfg = INTENT_CONFIG[intent];
                      return cfg ? (
                        <span key={intent} className="intent-badge" style={{ "--color": cfg.color, "--bg": cfg.bg }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {current.interests?.length > 0 && (
                    <div className="profile-interests">
                      {current.interests.slice(0, 5).map((interest) => (
                        <span key={interest} className="tag">{interest}</span>
                      ))}
                    </div>
                  )}

                  {current.mood && (
                    <p className="profile-mood">
                      Mood: {MOOD_CONFIG[current.mood]?.icon} {MOOD_CONFIG[current.mood]?.label}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button className="action-btn pass-btn" onClick={handlePass} title="Pass">✕</button>
                  <button className="action-btn super-btn" onClick={() => toast.info("Super like saved! ⭐")} title="Super Like">⭐</button>
                  <button className="action-btn like-btn" onClick={handleLike} title="Like">♥</button>
                </div>
              </div>

              {/* Next card peek */}
              {users[currentIdx + 1] && (
                <div className="profile-card-peek glass">
                  <img
                    src={users[currentIdx + 1].profilePhoto || generateAvatarUrl(users[currentIdx + 1].name)}
                    alt=""
                    className="profile-photo"
                    style={{ opacity: 0.5 }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Progress bar */}
          {users.length > 0 && !loading && (
            <div className="explore-progress">
              <div className="progress">
                <div className="progress-fill" style={{ width: `${(currentIdx / users.length) * 100}%` }} />
              </div>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>{currentIdx}/{users.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Match modal */}
      {matchModal && (
        <div className="modal-backdrop" onClick={() => setMatchModal(null)}>
          <div className="modal match-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="match-confetti">🎉</div>
            <h2 className="gradient-text">It's a Match!</h2>
            <div className="match-avatars">
              <img src={generateAvatarUrl("You")} alt="You" className="avatar avatar-xl" />
              <div className="match-heart">💜</div>
              <img src={matchModal.user.profilePhoto || generateAvatarUrl(matchModal.user.name)} alt={matchModal.user.name} className="avatar avatar-xl" />
            </div>
            <p>You and <strong>{matchModal.user.name}</strong> are</p>
            <div className="compat-score" style={{ color: getCompatibilityColor(matchModal.score) }}>
              {matchModal.score}% Compatible
            </div>
            <div className="match-actions">
              <button className="btn btn-primary" onClick={() => { setMatchModal(null); navigate("/chat"); }}>
                💬 Send Message
              </button>
              <button className="btn btn-outline" onClick={() => setMatchModal(null)}>
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
