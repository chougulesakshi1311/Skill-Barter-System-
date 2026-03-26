import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card card shadow-lg border-0">
        <div className="card-body p-4">
          <h3 className="mb-3">Welcome Back</h3>
          <p className="text-muted">Login to exchange skills with your community.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
          <div className="mt-3 d-flex justify-content-between">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
