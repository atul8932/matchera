import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { generateAvatarUrl, INTENT_CONFIG, getCompatibilityColor, isOnline, formatLastSeen } from "../utils/constants";
import "./Matches.css";

export default function Matches() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/users/me/matches")
      .then((res) => setMatches(res.data))
      .catch(() => toast.error("Failed to load matches"))
      .finally(() => setLoading(false));
  }, []);

  // Find the other user in the match (not the current logged-in user)
  const getOther = (match) =>
    match.users?.find((u) => u._id !== currentUser?._id) || match.users?.[0];

  const filtered = matches.filter((m) => {
    if (filter === "online") return isOnline(getOther(m)?.lastSeen);
    if (filter === "high") return (m.compatibilityScore || 0) >= 70;
    return true;
  });

  const onlineCount = matches.filter((m) => isOnline(getOther(m)?.lastSeen)).length;
  const avgScore = matches.length
    ? Math.round(matches.reduce((a, m) => a + (m.compatibilityScore || 0), 0) / matches.length)
    : 0;

  return (
    <div className="page matches-page">
      <div className="container">

        {/* Header */}
        <div className="matches-header">
          <div>
            <h2>Your Matches <span className="gradient-text">💫</span></h2>
            <p className="text-muted">People who liked you back — start a conversation!</p>
          </div>
          <a href="/explore" className="btn btn-primary btn-sm">+ Discover More</a>
        </div>

        {/* Stats row */}
        <div className="matches-stats-row">
          <div className="match-stat-card glass">
            <span className="msc-value gradient-text">{matches.length}</span>
            <span className="msc-label">Total Matches</span>
          </div>
          <div className="match-stat-card glass">
            <span className="msc-value" style={{ color: "#34d399" }}>{onlineCount}</span>
            <span className="msc-label">Online Now</span>
          </div>
          <div className="match-stat-card glass">
            <span className="msc-value" style={{ color: getCompatibilityColor(avgScore) }}>{avgScore}%</span>
            <span className="msc-label">Avg Compatibility</span>
          </div>
          <div className="match-stat-card glass">
            <span className="msc-value" style={{ color: "#f59e0b" }}>{matches.filter(m => !m.lastMessage).length}</span>
            <span className="msc-label">Not Started</span>
          </div>
        </div>

        {/* Filter pills */}
        <div className="matches-filter-row">
          {[["all", "All Matches"], ["online", "🟢 Online Now"], ["high", "🔥 High Compatibility"]].map(([val, label]) => (
            <button
              key={val}
              className={`filter-pill ${filter === val ? "active" : ""}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="matches-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="match-card-skeleton">
                <div className="skeleton" style={{ height: 180, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="skeleton" style={{ height: 16, width: "60%" }} />
                  <div className="skeleton" style={{ height: 13, width: "80%" }} />
                  <div className="skeleton" style={{ height: 32, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-matches-state">
            <div className="no-matches-visual">
              <div className="nm-ring nm-ring-1" />
              <div className="nm-ring nm-ring-2" />
              <div className="nm-ring nm-ring-3" />
              <span className="nm-emoji">💜</span>
            </div>
            <h3>{filter === "all" ? "No matches yet" : "No matches in this filter"}</h3>
            <p>{filter === "all"
              ? "Go explore profiles and start liking people you vibe with!"
              : "Try switching to 'All Matches' to see everyone."}</p>
            {filter === "all" && (
              <a href="/explore" className="btn btn-primary" style={{ marginTop: 20 }}>
                🔍 Explore Now
              </a>
            )}
            {filter !== "all" && (
              <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setFilter("all")}>
                Show All
              </button>
            )}
          </div>
        ) : (
          <div className="matches-grid">
            {filtered.map((match) => {
              const other = getOther(match);
              if (!other) return null;
              const online = isOnline(other.lastSeen);
              const score = match.compatibilityScore || 0;
              const scoreColor = getCompatibilityColor(score);
              return (
                <div key={match._id} className="match-card animate-fade-in">
                  {/* Photo */}
                  <div className="mc-photo-wrap">
                    <img
                      src={other.profilePhoto || generateAvatarUrl(other.name)}
                      alt={other.name}
                      className="mc-photo"
                    />
                    {/* Online dot */}
                    <div className={`mc-online-dot ${online ? "online" : "offline"}`} />
                    {/* Compatibility ring */}
                    {score > 0 && (
                      <div className="mc-score-badge" style={{ color: scoreColor, borderColor: scoreColor }}>
                        {score}%
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mc-info">
                    <div className="mc-name-row">
                      <h3 className="mc-name">
                        {other.name}
                        {other.isVerified && <span className="badge badge-verified" style={{ fontSize: "0.6rem", marginLeft: 4 }}>✓</span>}
                      </h3>
                      <span className="mc-age">{other.age}</span>
                    </div>

                    <p className="mc-meta">
                      {online
                        ? <span style={{ color: "#34d399" }}>🟢 Active now</span>
                        : <span style={{ color: "var(--text-muted)" }}>⚫ {formatLastSeen(other.lastSeen)}</span>
                      }
                      {other.location?.city && <span> · 📍 {other.location.city}</span>}
                    </p>

                    {/* Shared intents */}
                    {match.sharedIntents?.length > 0 && (
                      <div className="mc-shared-row">
                        {match.sharedIntents.slice(0, 2).map((intent) => {
                          const cfg = INTENT_CONFIG[intent];
                          return cfg ? (
                            <span key={intent} className="mc-intent-tag" style={{ color: cfg.color, background: cfg.bg }}>
                              {cfg.icon} {cfg.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* Shared interests */}
                    {match.sharedInterests?.length > 0 && (
                      <p className="mc-shared-interests">
                        Also into: {match.sharedInterests.slice(0, 3).join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mc-actions">
                    <button
                      className="btn btn-primary btn-sm mc-chat-btn"
                      onClick={() => navigate("/chat")}
                    >
                      💬 Message
                    </button>
                    <button className="btn btn-outline btn-sm mc-view-btn" title="View Profile">
                      👤
                    </button>
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
