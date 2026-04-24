import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    ["/dashboard", "Dashboard"],
    ["/profile", "Profile"],
    ["/matches", "Discover"],
    ["/requests", "Requests"],
    ["/chat", "Chat"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* ── Top Nav ── */}
      <header className="sbs-nav">
        <div className="sbs-nav__inner">
          {/* Brand */}
          <Link to="/dashboard" className="sbs-nav__brand">
            Skill Barter System
          </Link>

          {/* Nav Links */}
          <nav>
            <ul className="sbs-nav__links">
              {navLinks.map(([path, label]) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {user?.role === "admin" && (
                <li>
                  <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Actions */}
          <div className="sbs-nav__actions">
            {/* Notification bell */}
            <NavLink to="/notifications" className="sbs-nav__icon-btn" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </NavLink>

            {/* Avatar + name */}
            <NavLink
              to="/profile"
              style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary-fixed)" }}
                />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--primary)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.82rem"
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--on-surface)", display: "none" }}
                className="sbs-nav-name">
                {user?.name?.split(" ")[0]}
              </span>
            </NavLink>

            <button onClick={onLogout} className="sbs-btn-logout">Logout</button>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="sbs-page">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
