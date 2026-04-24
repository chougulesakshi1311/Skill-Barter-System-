import { useEffect, useState } from "react";
import api from "../api/client";
import StateView from "../components/StateView";
import { useAuth } from "../context/AuthContext";

/* ── Ring component ── */
const Ring = ({ pct, size = 48 }) => {
  const r = 18, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-container)" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--secondary)"
          strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s" }} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--secondary)" }}>
        {pct}%
      </span>
    </div>
  );
};

/* ── Sample data shown when API returns nothing ── */
const SAMPLE_PAIRS = [
  {
    _id: "sp1", user: { _id: "u1", name: "Sarah Jenkins", location: "New York", skillsOffered: [{ name: "UI/UX Design" }, { name: "Figma" }] },
    wantsFromMe: ["Python", "Django"], matchPercentage: 90, stars: 4.9, reviews: 128,
  },
  {
    _id: "sp2", user: { _id: "u2", name: "Leila K.", location: "Paris", skillsOffered: [{ name: "Data Science" }] },
    wantsFromMe: ["Content Writing"], matchPercentage: 75, stars: 4.7, reviews: 42,
  },
  {
    _id: "sp3", user: { _id: "u3", name: "David Miller", location: "Berlin", skillsOffered: [{ name: "Guitar Performance" }] },
    wantsFromMe: ["Web Development"], matchPercentage: 50, stars: 5.0, reviews: 18,
  },
  {
    _id: "sp4", user: { _id: "u4", name: "Aisha Omar", location: "Dubai", skillsOffered: [{ name: "French Fluency" }] },
    wantsFromMe: ["Public Speaking"], matchPercentage: 85, stars: 4.8, reviews: 67,
  },
];

const SAMPLE_CHAINS = [
  {
    users: [
      { name: "Alex Rivera", skill: "Python",    initials: "AR", color: "var(--primary-fixed)" },
      { name: "Elena Moretti", skill: "Marketing", initials: "EM", color: "var(--secondary-container)" },
      { name: "Marcus Chen",  skill: "3D Art",    initials: "MC", color: "var(--tertiary-fixed)" },
    ],
    matchPercentage: 91,
    description: "A 3-way exchange. You teach Alex Python, Alex teaches Elena Marketing, and Elena teaches you 3D Art.",
  },
];

const AVATARS = {
  sp1: "🎨", sp2: "📊", sp3: "🎸", sp4: "🇫🇷",
};

const MatchesPage = () => {
  const { user } = useAuth();
  const [pairMatches, setPairMatches]   = useState([]);
  const [chainMatches, setChainMatches] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [tab, setTab]                   = useState("pair");   // "pair" | "chain"
  const [search, setSearch]             = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/match");
      setPairMatches(data.pairMatches || []);
      setChainMatches(data.chainMatches || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load matches");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  /* Merge real + sample pairs */
  const allPairs = [
    ...pairMatches,
    ...SAMPLE_PAIRS.filter(s => !pairMatches.find(p => p._id === s._id)),
  ].filter(m => !search || m.user.name.toLowerCase().includes(search.toLowerCase()));

  const allChains = chainMatches.length ? chainMatches : SAMPLE_CHAINS;

  return (
    <div className="anim-fade-up" style={{ display: "grid", gap: 28 }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: "Manrope", fontSize: "2rem", fontWeight: 800 }}>Discover</h1>
        <p style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>Find your perfect skill exchange partner</p>
      </div>

      {/* ── Search + Tabs ── */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 520 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", fontSize: "1.2rem" }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or skill…"
            style={{ width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: "1.5px solid var(--outline-variant)", borderRadius: 12, fontSize: "0.9rem", outline: "none", fontFamily: "Inter" }}
            onFocus={e => e.target.style.borderColor = "var(--primary)"}
            onBlur={e => e.target.style.borderColor = "var(--outline-variant)"}
          />
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "var(--surface-container)", borderRadius: 12, padding: 4 }}>
          {[["pair","1-to-1 Matches"],["chain","Chain Matches"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="sbs-btn"
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: "0.85rem",
                background: tab === key ? "white" : "transparent",
                color: tab === key ? "var(--primary)" : "var(--on-surface-variant)",
                boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                fontWeight: tab === key ? 700 : 500,
                border: "none",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <StateView loading={loading} error={error} onRetry={load}>

        {/* ── 1-to-1 Pairs ── */}
        {tab === "pair" && (
          <div className="sbs-grid-3">
            {allPairs.map((m) => {
              const skills = (m.user.skillsOffered || []).map(s => s.name || s);
              const wants  = m.wantsFromMe || [];
              const pct = m.matchPercentage;
              const emoji = AVATARS[m._id] || "👤";
              return (
                <div key={m._id} className="sbs-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-fixed), var(--secondary-container))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                        {emoji}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{m.user.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--secondary)", marginTop: 2 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "0.9rem", fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{m.stars || "4.8"}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>({m.reviews || "–"} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <Ring pct={pct} />
                  </div>

                  {/* Skills */}
                  <div style={{ display: "grid", gap: 10 }}>
                    <div>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)", marginBottom: 6 }}>HAS SKILLS YOU WANT</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {skills.length ? skills.map(s => <span key={s} className="sbs-chip">{s}</span>) : <span className="sbs-chip">—</span>}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)", marginBottom: 6 }}>WANTS SKILLS YOU HAVE</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {wants.length ? wants.map(s => <span key={s} className="sbs-chip sbs-chip--primary">{s}</span>) : <span className="sbs-chip">—</span>}
                      </div>
                    </div>
                  </div>

                  {m.user.location && (
                    <p style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>location_on</span>
                      {m.user.location}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                    <button className="sbs-btn sbs-btn--primary" style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}>
                      Send Request
                    </button>
                    <button className="sbs-btn sbs-btn--outline" style={{ fontSize: "0.85rem", padding: "10px 14px" }}>
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Chain Matches ── */}
        {tab === "chain" && (
          <div style={{ display: "grid", gap: 24 }}>
            {allChains.map((chain, idx) => {
              const users = chain.users || [];
              return (
                <div key={idx} className="sbs-card" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, white 100%)", border: "1px solid rgba(36,56,156,0.15)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", fontWeight: 700 }}>Skill Chain Discovery</h3>
                    <span className="sbs-badge sbs-badge--secondary" style={{ background: "var(--secondary)", color: "white" }}>OPTIMAL CHAIN FOUND</span>
                  </div>

                  {/* Chain visualization */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", padding: "16px 0" }}>
                    {users.map((u, i) => {
                      const name = u.name || u?.name || `User ${i+1}`;
                      const skill = u.skill || (u.skillsOffered?.[0]?.name) || "Skills";
                      const initials = u.initials || name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                      const bgColor = [
                        "var(--primary-fixed)", "var(--secondary-container)", "var(--tertiary-fixed)"
                      ][i % 3];
                      const textColor = [
                        "var(--on-primary-fixed)", "var(--on-secondary-container)", "var(--on-tertiary-fixed)"
                      ][i % 3];
                      const skillColor = ["var(--primary)", "var(--secondary)", "var(--tertiary)"][i % 3];
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: bgColor, border: "4px solid white", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: textColor, position: "relative" }}>
                              {initials}
                              {i === 0 && (
                                <span style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", background: "var(--primary)", color: "white", fontSize: "0.6rem", padding: "2px 6px", borderRadius: 999, whiteSpace: "nowrap", fontWeight: 700 }}>YOU</span>
                              )}
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>{name}</p>
                              <p style={{ margin: 0, fontSize: "0.78rem", color: skillColor, fontWeight: 600 }}>Teaches {skill}</p>
                            </div>
                          </div>
                          {i < users.length - 1 && (
                            <span className="material-symbols-outlined" style={{ color: "var(--outline-variant)", fontSize: "1.8rem" }}>trending_flat</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <hr className="sbs-divider" />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <p style={{ fontSize: "0.88rem", color: "var(--on-surface-variant)", maxWidth: 480, margin: 0, lineHeight: 1.65 }}>
                      {chain.description || "A multi-way chain exchange providing maximum value for all participants."}
                    </p>
                    <button className="sbs-btn sbs-btn--primary" style={{ whiteSpace: "nowrap", padding: "12px 24px" }}>
                      Propose Chain Exchange
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <button className="sbs-btn sbs-btn--outline" style={{ padding: "12px 32px" }}>
            View More Matches
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </StateView>
    </div>
  );
};

export default MatchesPage;
