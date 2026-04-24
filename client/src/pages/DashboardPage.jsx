import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import StateView from "../components/StateView";

/* ── Sample match data shown alongside real data ── */
const SAMPLE_MATCHES = [
  {
    id: "s1",
    peer: "Bob Martinez",
    initials: "BM",
    matchPct: 95,
    exchange: "Web Dev ↔ Python",
    detail: "You teach Bob Web Development, Bob teaches you Python.",
    next: "Tomorrow, 2 PM",
    color: "#bac3ff",
  },
  {
    id: "s2",
    peer: "Sarah Park",
    initials: "SP",
    matchPct: 88,
    exchange: "UI Design ↔ French",
    detail: "You teach Sarah UI Principles, Sarah teaches you Conversational French.",
    next: "Curriculum Review",
    color: "#8bf1e6",
  },
];

const SAMPLE_REQUESTS = [
  { id: "r1", name: "Liam Carter",   initials: "LC", wants: "React",           offers: "Digital Illustration", color: "#ffdcc6" },
  { id: "r2", name: "Elena Rodriguez", initials: "ER", wants: "SQL",           offers: "Data Visualization",   color: "#dee0ff" },
];

const SKILL_PICKS = [
  { icon: "database",    title: "Advanced SQL",       sub: "3 Expert Mentors available" },
  { icon: "monitoring",  title: "Machine Learning",   sub: "12 Active Learners today" },
  { icon: "architecture", title: "Cloud Systems",     sub: "Highly requested for barter" },
];

/* ── Ring SVG ── */
const Ring = ({ pct, size = 44 }) => {
  const r = 16, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-container)" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--secondary)"
          strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s" }} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "var(--secondary)" }}>
        {pct}%
      </span>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ activeRequests: 0, matchesFound: 0, completedBarters: 0, unreadNotifications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/dashboard/user");
      setMetrics(data.metrics);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="anim-fade-up" style={{ display: "grid", gap: 32 }}>

      {/* ── Welcome ── */}
      <div>
        <h1 style={{ fontFamily: "Manrope", fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>
          Welcome back, {firstName}!
        </h1>
        <p style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>
          You have {metrics.unreadNotifications || 3} new skill recommendations today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <StateView loading={loading} error={error} onRetry={load}>
        <div className="sbs-grid-stats">
          {[
            { label: "Active Requests",      value: metrics.activeRequests,       icon: "bolt",      color: "var(--secondary)" },
            { label: "Matches Found",        value: metrics.matchesFound,         icon: "target",    color: "var(--tertiary)" },
            { label: "Completed Barters",    value: metrics.completedBarters,     icon: "handshake", color: "var(--secondary)" },
            { label: "Unread Notifications", value: metrics.unreadNotifications,  icon: "notifications", color: "var(--primary)" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="sbs-stat">
              <span className="sbs-stat__label">{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span className="sbs-stat__value">{value}</span>
                <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
              </div>
            </div>
          ))}
        </div>
      </StateView>

      {/* ── Main grid: Matches + Sidebar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

        {/* Left: Matches + Pending */}
        <div style={{ display: "grid", gap: 24 }}>

          {/* Active Matches */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Manrope", fontSize: "1.2rem", fontWeight: 700 }}>Active Matches</h2>
              <Link to="/matches" style={{ color: "var(--primary)", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View All <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
              </Link>
            </div>
            <div className="sbs-grid-2">
              {SAMPLE_MATCHES.map(m => (
                <div key={m.id} className="sbs-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: m.color, border: "2px solid white", display:"flex",alignItems:"center",justifyContent:"center", fontWeight:700, fontSize:"0.78rem", color:"var(--on-surface)", zIndex:2 }}>{m.initials}</div>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", border: "2px solid white", display:"flex",alignItems:"center",justifyContent:"center", fontWeight:700, fontSize:"0.78rem", color:"white", marginLeft:-12 }}>
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    </div>
                    <span className="sbs-badge sbs-badge--secondary">{m.matchPct}% Match</span>
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{m.exchange}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)" }}>{m.detail}</p>
                  <hr className="sbs-divider" style={{ margin: "4px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", fontStyle: "italic" }}>Next: {m.next}</span>
                    <Link to="/chat" className="sbs-btn sbs-btn--outline" style={{ padding: "4px 12px", fontSize: "0.78rem" }}>Chat</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Requests */}
          <div className="sbs-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", background: "var(--surface-container-low)", borderBottom: "1px solid var(--outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "Manrope", fontSize: "1rem", fontWeight: 700 }}>Pending Requests</h2>
              <span className="sbs-badge sbs-badge--primary" style={{ background: "var(--primary)", color: "white" }}>
                {SAMPLE_REQUESTS.length} NEW
              </span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {SAMPLE_REQUESTS.map((r, i) => (
                <li key={r.id} style={{
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  borderTop: i > 0 ? "1px solid var(--surface-container)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: r.color, display:"flex",alignItems:"center",justifyContent:"center", fontWeight:700, color:"var(--on-surface)", fontSize:"0.78rem", flexShrink:0 }}>{r.initials}</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>
                        {r.name} <span style={{ fontWeight: 400, color: "var(--on-surface-variant)" }}>wants to learn</span> {r.wants}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 600 }}>Offers: {r.offers}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Link to="/requests" className="sbs-btn sbs-btn--secondary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>Accept</Link>
                    <Link to="/requests" className="sbs-btn sbs-btn--ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>Decline</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Skill Picks + Progress */}
        <aside style={{ display: "grid", gap: 20 }}>

          {/* Skill Picks card */}
          <div style={{ background: "var(--primary-container)", borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -16, right: -16, opacity: 0.08 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 120, color: "white" }}>lightbulb</span>
            </div>
            <h3 style={{ fontFamily: "Manrope", color: "white", fontSize: "1.1rem", fontWeight: 700, position: "relative", zIndex: 1 }}>Skill Picks</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", marginBottom: 20, position: "relative", zIndex: 1 }}>
              Based on your profile skills.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
              {SKILL_PICKS.map(({ icon, title, sub }) => (
                <div key={title} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: "white", fontSize: "1.2rem" }}>{icon}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "white", fontSize: "0.88rem" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/matches" className="sbs-btn" style={{ marginTop: 20, width: "100%", justifyContent: "center", background: "white", color: "var(--primary)", position: "relative", zIndex: 1 }}>
              Explore All Skills
            </Link>
          </div>

          {/* Learning Progress */}
          <div className="sbs-card">
            <h3 style={{ fontFamily: "Manrope", fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>Your Progress</h3>
            {[
              { label: "Python Mastery",      pct: 65, color: "var(--secondary)" },
              { label: "Web App Architecture", pct: 40, color: "var(--primary)" },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div className="sbs-progress">
                  <div className="sbs-progress__fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
