import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { generateAvatarUrl } from "../utils/constants";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  const navLinks = [
    { path: "/explore", label: "Explore", icon: "🔍" },
    { path: "/sessions", label: "Sessions", icon: "📅" },
    { path: "/matches", label: "Matches", icon: "💫" },
    { path: "/chat", label: "Chat", icon: "💬" },
    { path: "/safety", label: "Safety", icon: "🛡️" },
  ];

  if (!user) {
    return (
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">💫</span>
            <img src="/matchera-logo.jpeg" alt="Matchera" className="logo-img" />
          </Link>
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💫</span>
          <img src="/matchera-logo.jpeg" alt="Matchera" className="logo-img" />
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links hide-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          {user.role === "admin" && (
            <Link to="/admin" className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>
              <span>⚙️</span> Admin
            </Link>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="navbar-profile" onClick={() => setProfileOpen(!profileOpen)}>
          <img
            src={user.profilePhoto || generateAvatarUrl(user.name)}
            alt={user.name}
            className="avatar avatar-sm"
          />
          {user.isVerified && <span className="verified-dot">✓</span>}

          {profileOpen && (
            <div className="profile-dropdown animate-scale-in">
              <div className="dropdown-header">
                <img
                  src={user.profilePhoto || generateAvatarUrl(user.name)}
                  alt={user.name}
                  className="avatar avatar-md"
                />
                <div>
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email || user.phone}</p>
                  {user.isPremium && <span className="badge badge-warning">⭐ Premium</span>}
                </div>
              </div>
              <div className="dropdown-divider" />
              <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                👤 My Profile
              </Link>
              <Link to="/my-sessions" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                📅 My Sessions
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                ⚙️ Settings
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                  🔧 Admin Panel
                </Link>
              )}
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger hide-desktop" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          <button className="mobile-link danger" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
