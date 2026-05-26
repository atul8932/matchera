export const INTENT_CONFIG = {
  walking: { label: "Walking Partner", icon: "🚶", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  travel: { label: "Travel Buddy", icon: "✈️", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  food: { label: "Food Partner", icon: "🍽️", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  dating: { label: "Dating", icon: "❤️", color: "#F472B6", bg: "rgba(244,114,182,0.12)" },
  "work-study": { label: "Work / Study", icon: "💻", color: "#818CF8", bg: "rgba(129,140,248,0.12)" },
  "casual-dating": { label: "Casual Dating", icon: "☕", color: "#2DD4BF", bg: "rgba(45,212,191,0.12)" },
  fitness: { label: "Fitness Buddy", icon: "🏃", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  events: { label: "Events / Outings", icon: "🎉", color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
};

export const MOOD_CONFIG = {
  chill: { label: "Chill", icon: "😌" },
  adventurous: { label: "Adventurous", icon: "🚀" },
  professional: { label: "Professional", icon: "💼" },
  romantic: { label: "Romantic", icon: "🌹" },
};

export const AVAILABILITY_CONFIG = {
  now: "Available Now",
  tonight: "Tonight",
  weekend: "This Weekend",
};

export const BUDGET_CONFIG = {
  budget: { label: "Budget-Friendly", icon: "💰" },
  moderate: { label: "Moderate", icon: "💳" },
  premium: { label: "Premium", icon: "💎" },
};

export const REPORT_REASONS = [
  { value: "fake-profile", label: "Fake Profile" },
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam" },
  { value: "inappropriate-content", label: "Inappropriate Content" },
  { value: "scam", label: "Scam" },
  { value: "underage", label: "Underage User" },
  { value: "other", label: "Other" },
];

export const formatLastSeen = (date) => {
  if (!date) return "Offline";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Online";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const isOnline = (date) => {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 120000; // 2 min
};

export const getCompatibilityColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#14B8A6";
};

export const generateAvatarUrl = (name) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";
  const colors = ["#14B8A6", "#2DD4BF", "#38BDF8", "#22C55E", "#FCD34D", "#EF4444"];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=${color.slice(1)}&color=fff&bold=true&size=128`;
};
