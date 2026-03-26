import { useState } from "react";
import api from "../api/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/forgot-password", { email });
    setStatus(data.message || "If account exists, email was sent.");
  };

  return (
    <div className="auth-screen">
      <div className="auth-card card border-0 shadow">
        <div className="card-body p-4">
          <h3>Forgot Password</h3>
          <p className="text-muted">Enter your account email to reset your password.</p>
          {status && <div className="alert alert-info">{status}</div>}
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
