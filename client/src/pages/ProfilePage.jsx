import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import SkillInput from "../components/SkillInput";

const SAMPLE_REVIEWS = [
  {
    id: "rv1", name: "David Chen", initials: "DC", color: "#bac3ff",
    traded: "Traded Python for UI Design", stars: 5,
    text: "Alice is an absolute pro! Her eye for detail in UI design is incredible. She transformed my messy dashboard into something clean and professional. Highly recommend bartering with her!",
    when: "2 WEEKS AGO",
  },
  {
    id: "rv2", name: "Sarah Miller", initials: "SM", color: "#8bf1e6",
    traded: "Traded Spanish for Web Dev", stars: 4,
    text: "Great experience learning React basics. Very patient and explains complex concepts in a digestible way. Will definitely barter again.",
    when: "1 MONTH AGO",
  },
];

const Stars = ({ n }) => (
  <div style={{ display: "flex", gap: 2, color: "#f59e0b" }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="material-symbols-outlined" style={{ fontSize: "1rem", fontVariationSettings: i < n ? "'FILL' 1" : "'FILL' 0" }}>star</span>
    ))}
  </div>
);

const LEVEL_COLORS = {
  Expert:       { bg: "var(--primary)", color: "white" },
  Advanced:     { bg: "var(--primary-fixed-dim)", color: "var(--on-primary-fixed)" },
  Intermediate: { bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  Beginner:     { bg: "var(--secondary-fixed)", color: "var(--on-secondary-fixed)" },
};

const ProfilePage = () => {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({ name: "", bio: "", location: "", profilePicture: "", skillsOffered: [], skillsWanted: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      profilePicture: user.profilePicture || "",
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
    });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/users/me", form);
      await refreshMe();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const totalRep  = 4.9;
  const totalRevs = 24;

  return (
    <div className="anim-fade-up">

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: "2rem", fontWeight: 800 }}>Profile Settings</h1>
          <p style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>Manage your skills, bio, and barter preferences.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setEditing(!editing)} className="sbs-btn sbs-btn--outline">
            <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>edit</span>
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {saved && (
        <div style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)", borderRadius: 10, padding: "10px 18px", marginBottom: 20, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined">check_circle</span> Profile updated successfully!
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Left sidebar ── */}
          <aside style={{ display: "grid", gap: 20 }}>

            {/* Identity Card */}
            <div className="sbs-card" style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
                {form.profilePicture ? (
                  <img src={form.profilePicture} alt="avatar" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--surface-container)" }} />
                ) : (
                  <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 800, color: "white", border: "4px solid var(--surface-container)" }}>
                    {form.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="material-symbols-outlined" style={{ position: "absolute", bottom: 4, right: 4, background: "var(--secondary-fixed)", color: "var(--on-secondary-fixed)", borderRadius: "50%", padding: 4, fontSize: "1rem", border: "2px solid white", fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>

              {editing ? (
                <div style={{ display: "grid", gap: 10, textAlign: "left" }}>
                  {[["Name", "name", "text"], ["Location", "location", "text"], ["Profile Picture URL", "profilePicture", "url"]].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--on-surface-variant)", display: "block", marginBottom: 4 }}>{label}</label>
                      <input type={type} value={form[key]} className="form-control" style={{ fontSize: "0.88rem" }}
                        onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--on-surface-variant)", display: "block", marginBottom: 4 }}>Bio</label>
                    <textarea rows={3} value={form.bio} className="form-control" style={{ fontSize: "0.88rem", resize: "vertical" }}
                      onChange={e => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: "Manrope", fontSize: "1.3rem", fontWeight: 700 }}>{form.name || user?.name}</h2>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--on-surface-variant)", marginTop: 6 }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "1.1rem" }}>location_on</span>
                    <span style={{ fontSize: "0.88rem" }}>{form.location || "Location not set"}</span>
                  </div>
                  {form.bio && <p style={{ marginTop: 12, fontSize: "0.88rem", color: "var(--on-surface-variant)", fontStyle: "italic", lineHeight: 1.6 }}>"{form.bio}"</p>}
                </>
              )}

              <hr className="sbs-divider" />
              <div style={{ display: "grid", gap: 10, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)" }}>Availability</span>
                  <span className="sbs-badge sbs-badge--secondary">Weekends</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)" }}>Member Since</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "2024"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div className="sbs-card">
              <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ color: "var(--tertiary)" }}>workspace_premium</span>
                Reputation
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "Manrope", fontSize: "2rem", fontWeight: 800 }}>{totalRep}</span>
                  <Stars n={5} />
                </div>
                <span style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)" }}>{totalRevs} Reviews</span>
              </div>
              {[["Punctual", 95], ["Expertise", 98], ["Friendly", 92]].map(([label, pct]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ width: 60, fontSize: "0.8rem", color: "var(--on-surface-variant)", flexShrink: 0 }}>{label}</span>
                  <div className="sbs-progress" style={{ flex: 1 }}>
                    <div className="sbs-progress__fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right column ── */}
          <div style={{ display: "grid", gap: 24 }}>

            {/* Skills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* Skills Offered */}
              <div className="sbs-card">
                <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Skills I Offer
                </h3>
                {editing ? (
                  <SkillInput label="" value={form.skillsOffered} onChange={skillsOffered => setForm({ ...form, skillsOffered })} />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {(form.skillsOffered.length ? form.skillsOffered : [
                      { name: "Web Development", level: "Expert",   details: "React, Tailwind, Node.js" },
                      { name: "UI/UX Design",    level: "Advanced", details: "Figma, Prototyping" },
                    ]).map((s, i) => {
                      const lvl = typeof s === "string" ? "Expert" : (s.level || "Advanced");
                      const name = typeof s === "string" ? s : s.name;
                      const det  = typeof s === "string" ? "" : (s.details || "");
                      const lc   = LEVEL_COLORS[lvl] || LEVEL_COLORS.Advanced;
                      return (
                        <div key={i} style={{ padding: "12px 14px", background: "var(--surface-container-low)", border: "1px solid rgba(36,56,156,0.1)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{name}</p>
                            {det && <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>{det}</p>}
                          </div>
                          <span className="sbs-badge" style={{ ...lc }}>{lvl}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Skills Wanted */}
              <div className="sbs-card">
                <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", color: "var(--secondary)", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="material-symbols-outlined">psychology</span>
                  Skills I Want
                </h3>
                {editing ? (
                  <SkillInput label="" value={form.skillsWanted} onChange={skillsWanted => setForm({ ...form, skillsWanted })} />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {(form.skillsWanted.length ? form.skillsWanted : [
                      { name: "Python",       level: "Beginner",     details: "Data Science, Automation" },
                      { name: "Video Editing", level: "Intermediate", details: "Premiere Pro, CapCut" },
                    ]).map((s, i) => {
                      const lvl = typeof s === "string" ? "Beginner" : (s.level || "Beginner");
                      const name = typeof s === "string" ? s : s.name;
                      const det  = typeof s === "string" ? "" : (s.details || "");
                      const lc   = LEVEL_COLORS[lvl] || LEVEL_COLORS.Beginner;
                      return (
                        <div key={i} style={{ padding: "12px 14px", background: "var(--surface-container-high)", border: "1px solid rgba(0,106,99,0.1)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{name}</p>
                            {det && <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>{det}</p>}
                          </div>
                          <span className="sbs-badge" style={{ ...lc }}>{lvl}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Save button (only in edit mode) */}
            {editing && (
              <button type="submit" className="sbs-btn sbs-btn--primary" style={{ justifySelf: "start" }} disabled={saving}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>save</span>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            )}

            {/* Reviews */}
            <div className="sbs-card">
              <h3 style={{ fontFamily: "Manrope", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span className="material-symbols-outlined" style={{ color: "var(--outline)" }}>reviews</span>
                Recent Reviews
              </h3>
              <div>
                {SAMPLE_REVIEWS.map((r, i) => (
                  <div key={r.id} style={{ paddingTop: i === 0 ? 0 : 20, paddingBottom: 20, borderBottom: i < SAMPLE_REVIEWS.length - 1 ? "1px solid var(--outline-variant)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.78rem", flexShrink: 0 }}>{r.initials}</div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{r.name}</p>
                          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>{r.traded}</p>
                        </div>
                      </div>
                      <Stars n={r.stars} />
                    </div>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>"{r.text}"</p>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em", color: "var(--outline)", display: "block", marginTop: 8 }}>{r.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
