import { Link } from "react-router-dom";

const featuredSkills = [
  { title: "React Development", user: "Alex Rivera", tags: ["Frontend", "JavaScript"], match: "98%" },
  { title: "Python for Data Science", user: "Sarah Chen", tags: ["Data", "Backend"], match: "95%" },
  { title: "Advanced UI/UX Design", user: "Jordan Lee", tags: ["Design", "Figma"], match: "92%" },
  { title: "Strategic Marketing", user: "Elena Gomez", tags: ["Business", "Strategy"], match: "89%" },
];

const steps = [
  { n: "1", title: "Register", desc: "Create your professional profile and join our vetted community of enthusiasts and experts." },
  { n: "2", title: "Add Skills", desc: "List the skills you've mastered and specify the new horizons you're eager to explore." },
  { n: "3", title: "Match & Barter", desc: "Browse matches, propose a swap, and start learning through collaborative sessions." },
];

const LandingPage = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", color: "var(--on-surface)", background: "var(--background)" }}>

    {/* ── Nav ───────────────────────────── */}
    <header className="sbs-nav">
      <div className="sbs-nav__inner">
        <Link to="/" className="sbs-nav__brand">Skill Barter System</Link>
        <nav>
          <ul className="sbs-nav__links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#skills">Skills</a></li>
          </ul>
        </nav>
        <div className="sbs-nav__actions">
          <Link to="/login" className="sbs-btn sbs-btn--outline" style={{ padding: "8px 18px", fontSize: "0.88rem" }}>Sign In</Link>
          <Link to="/register" className="sbs-btn sbs-btn--primary" style={{ padding: "8px 18px", fontSize: "0.88rem" }}>Get Started</Link>
        </div>
      </div>
    </header>

    {/* ── Hero ──────────────────────────── */}
    <section className="landing-hero" id="hero">
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span className="sbs-badge sbs-badge--primary" style={{ width: "fit-content", padding: "6px 14px", fontSize: "0.72rem", letterSpacing: "0.07em" }}>
            PEER-TO-PEER LEARNING
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.2, fontWeight: 800, color: "var(--on-surface)", maxWidth: 480 }}>
            Master New Skills,<br />Teach What You Know
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--on-surface-variant)", maxWidth: 420, lineHeight: 1.65 }}>
            Join a community where expertise is the currency. Exchange your coding skills for design lessons, or your business acumen for language mastery.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/register" className="sbs-btn sbs-btn--primary" style={{ fontSize: "1rem", padding: "14px 28px" }}>Get Started</Link>
            <Link to="/register" className="sbs-btn sbs-btn--outline" style={{ fontSize: "1rem", padding: "14px 28px" }}>Explore Skills</Link>
          </div>
        </div>

        {/* Hero graphic */}
        <div style={{ position: "relative" }}>
          <div style={{ background: "linear-gradient(135deg, #dee0ff 0%, #8bf1e6 100%)", borderRadius: 24, height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>
            🤝
          </div>
          <div style={{ position: "absolute", bottom: -20, left: -20, background: "var(--secondary-container)", borderRadius: 16, padding: "16px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {["#bac3ff","#8bf1e6","#ffdcc6"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -10 : 0 }} />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: "var(--on-secondary-container)", fontSize: "0.9rem" }}>12k+ Active Learners</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Features ──────────────────────── */}
    <section id="features" style={{ background: "var(--surface-container-low)", padding: "80px var(--sp-lg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Intelligent Skill Matching</h2>
          <p style={{ color: "var(--on-surface-variant)", marginTop: 8 }}>Our algorithms find the perfect exchange partners for your growth.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

          <div className="sbs-card">
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--primary-fixed)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>handshake</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>1-to-1 Matching</h3>
            <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.6 }}>The classic barter. You teach me Python, I teach you Photography. Direct, simple, and personal.</p>
          </div>

          <div className="sbs-card" style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>hub</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Chain Matching</h3>
                <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.6 }}>Can't find a direct swap? Our system links three or more people. Nobody gets left behind.</p>
              </div>
              <div style={{ flex: 1, background: "var(--surface-container)", borderRadius: 12, padding: "20px 24px", minWidth: 200 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "var(--primary)", color: "white", padding: "8px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700 }}>React</span>
                  <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>trending_flat</span>
                  <span style={{ background: "var(--secondary)", color: "white", padding: "8px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700 }}>UI Design</span>
                  <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>trending_flat</span>
                  <span style={{ background: "var(--tertiary-container)", color: "var(--tertiary-fixed)", padding: "8px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700 }}>SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── How it works ──────────────────── */}
    <section id="how-it-works" style={{ background: "white", padding: "80px var(--sp-lg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Your Path to Mastery</h2>
          <p style={{ color: "var(--on-surface-variant)", marginTop: 8 }}>Three simple steps to start your skill exchange journey.</p>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {steps.map(({ n, title, desc }, idx) => (
            <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 220, maxWidth: 300, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--surface-container)", border: "4px solid white", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
                  {n}
                </div>
                <h3 style={{ fontSize: "1.15rem" }}>{title}</h3>
                <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.6, fontSize: "0.92rem" }}>{desc}</p>
              </div>
              {idx < steps.length - 1 && (
                <span className="material-symbols-outlined" style={{ color: "var(--outline-variant)", fontSize: "2rem", marginTop: 22 }}>east</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Featured Skills ───────────────── */}
    <section id="skills" style={{ background: "var(--surface-container-lowest)", padding: "80px var(--sp-lg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Featured Skills</h2>
            <p style={{ color: "var(--on-surface-variant)", marginTop: 6 }}>Trending domains currently in high demand</p>
          </div>
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View All <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>arrow_forward</span>
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {featuredSkills.map(({ title, user, tags, match }) => (
            <div key={title} className="sbs-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 120, background: "linear-gradient(135deg, var(--primary-fixed) 0%, var(--secondary-container) 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                {title.includes("React") ? "⚛️" : title.includes("Python") ? "🐍" : title.includes("UI") ? "🎨" : "📈"}
                <span className="sbs-badge sbs-badge--secondary" style={{ position: "absolute", top: 10, right: 10 }}>{match} Match</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{title}</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)", marginBottom: 12 }}>by {user}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tags.map(t => <span key={t} className="sbs-chip">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Live Barter Updates ───────────── */}
    <section style={{ background: "white", padding: "80px var(--sp-lg)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", border: "1px solid var(--outline-variant)", borderRadius: 20, padding: 48 }}>
        <h3 style={{ textAlign: "center", fontSize: "1.4rem", marginBottom: 32 }}>Live Barter Updates</h3>
        <div className="sbs-timeline">
          {[
            { dot: "done", icon: "check", title: "Proposed: Webflow Mastery", sub: "Mark invited Sophie for an exchange" },
            { dot: "active", icon: "hourglass_empty", title: "Accepted: Barter in Progress", sub: "Sophie accepted. Session 1 scheduled." },
            { dot: "pending", icon: "flag", title: "Completed: Skills Swapped", sub: "Waiting for session completion" },
          ].map((item, i) => (
            <div key={i}>
              <div className="sbs-timeline__item">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`sbs-timeline__dot sbs-timeline__dot--${item.dot}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  </div>
                  {i < 2 && <div className="sbs-timeline__connector" />}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontWeight: 600, marginBottom: 2, color: item.dot === "pending" ? "var(--on-surface-variant)" : "var(--on-surface)" }}>{item.title}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)", opacity: item.dot === "pending" ? 0.6 : 1 }}>{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ───────────────────────────── */}
    <section style={{ padding: "80px var(--sp-lg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="landing-cta">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, color: "white", marginBottom: 12 }}>Ready to level up?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.65 }}>
              Join thousands of professionals bartering their way to expertise. It's free, collaborative, and transformative.
            </p>
            <Link to="/register" className="sbs-btn" style={{ background: "white", color: "var(--primary)", fontSize: "1rem", padding: "14px 32px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Create Your Profile Now
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* ── Footer ────────────────────────── */}
    <footer style={{ background: "#f8fafc", borderTop: "1px solid var(--outline-variant)", padding: "40px var(--sp-lg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", marginBottom: 6 }}>Skill Barter System</div>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>© 2024 Skill Barter System. Empowering peer-to-peer growth.</p>
        </div>
        <nav style={{ display: "flex", gap: 24 }}>
          {["About Us", "Guidelines", "Privacy Policy", "Support"].map(l => (
            <a key={l} href="#" style={{ color: "var(--on-surface-variant)", textDecoration: "none", fontSize: "0.88rem" }}
              onMouseOver={e => e.target.style.color = "var(--primary)"}
              onMouseOut={e => e.target.style.color = "var(--on-surface-variant)"}>{l}</a>
          ))}
        </nav>
      </div>
    </footer>
  </div>
);

export default LandingPage;
