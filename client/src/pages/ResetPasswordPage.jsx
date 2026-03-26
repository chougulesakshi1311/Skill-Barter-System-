import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    setMessage(data.message || "Password reset successfully.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card card border-0 shadow">
        <div className="card-body p-4">
          <h3>Reset Password</h3>
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <input
              className="form-control"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btn btn-success" type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
