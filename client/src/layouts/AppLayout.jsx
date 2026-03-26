import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-vh-100 app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark glass-nav">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">
            Skill Barter System
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-lg-2">
              {[
                ["/dashboard", "Dashboard"],
                ["/profile", "Profile"],
                ["/matches", "Matches"],
                ["/requests", "Requests"],
                ["/chat", "Chat"],
              ].map(([path, label]) => (
                <li className="nav-item" key={path}>
                  <NavLink className="nav-link" to={path}>
                    {label}
                  </NavLink>
                </li>
              ))}
              {user?.role === "admin" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <button onClick={onLogout} className="btn btn-sm btn-warning mt-1">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
