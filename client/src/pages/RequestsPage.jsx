import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import StateView from "../components/StateView";

const STATUS_STYLES = {
  pending:   { bg: "#fef9c3", color: "#854d0e" },
  accepted:  { bg: "#dcfce7", color: "#166534" },
  rejected:  { bg: "#fee2e2", color: "#991b1b" },
  completed: { bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  canceled:  { bg: "var(--surface-container)", color: "var(--on-surface-variant)" },
};

const RequestsPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ toUser: "", offeredSkill: "", requestedSkill: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [formError, setFormError] = useState("");

  // Pre-fill form from navigation state if available
  useEffect(() => {
    if (location.state?.selectedUserId) {
      setForm(prev => ({ ...prev, toUser: location.state.selectedUserId }));
    }
  }, [location.state]);

  const loadRequests = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/barter");
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadRequests(); }, []);

  const grouped = useMemo(() => {
    const stats = { pending: 0, accepted: 0, rejected: 0, completed: 0, canceled: 0 };
    requests.forEach(r => { stats[r.status] = (stats[r.status] || 0) + 1; });
    return stats;
  }, [requests]);

  const submitRequest = async (e) => {
    e.preventDefault(); setFormError("");
    try {
      await api.post("/barter", form);
      setForm({ toUser: "", offeredSkill: "", requestedSkill: "", message: "" });
      loadRequests();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to send request");
    }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/barter/${id}/status`, { status }); loadRequests(); }
    catch (err) { setError(err.response?.data?.message || "Failed to update status"); }
  };

  const cancel = async (id) => {
    try { await api.patch(`/barter/${id}/cancel`); loadRequests(); }
    catch (err) { setError(err.response?.data?.message || "Failed to cancel request"); }
  };

  const STAT_ICONS = { pending: "hourglass_empty", accepted: "check_circle", rejected: "cancel", completed: "workspace_premium", canceled: "block" };

  return (
    <div className="anim-fade-up" style={{ display: "grid", gap: 28 }}>

      {/* ── Page header ── */}
      <div>
        <h1 style={{ fontFamily: "Manrope", fontSize: "2rem", fontWeight: 800 }}>Barter Requests</h1>
        <p style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>Manage your skill exchange proposals</p>
      </div>

      {/* ── Send Request form ── */}
      <div className="sbs-card">
        <h2 style={{ fontFamily: "Manrope", fontSize: "1.15rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>send</span>
          Send Barter Request
        </h2>
        {formError && (
          <div style={{ background: "var(--error-container)", color: "var(--error)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: "0.88rem", fontWeight: 600 }}>
            {formError}
          </div>
        )}
        <form onSubmit={submitRequest}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {[
              ["toUser",        "Target User ID",  "text"],
              ["offeredSkill",  "Skill you offer", "text"],
              ["requestedSkill","Skill you need",  "text"],
            ].map(([key, ph, type]) => (
              <div key={key}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--on-surface-variant)", display: "block", marginBottom: 6 }}>{ph}</label>
                <input type={type} value={form[key]} required placeholder={ph}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--outline-variant)", borderRadius: 10, fontSize: "0.9rem", fontFamily: "Inter", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "var(--primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--outline-variant)"}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--on-surface-variant)", display: "block", marginBottom: 6 }}>Message (optional)</label>
            <textarea rows={3} value={form.message} placeholder="Add a personal note…"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--outline-variant)", borderRadius: 10, fontSize: "0.9rem", fontFamily: "Inter", resize: "vertical", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--outline-variant)"}
              onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="sbs-btn sbs-btn--primary">
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>send</span>
              Send Request
            </button>
          </div>
        </form>
      </div>

      <StateView loading={loading} error={error} onRetry={loadRequests}>

        {/* ── Status stats ── */}
        <div className="sbs-grid-stats">
          {Object.entries(grouped).map(([k, v]) => (
            <div key={k} className="sbs-stat">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span className="sbs-stat__label">{k}</span>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: STATUS_STYLES[k]?.color || "var(--outline)" }}>{STAT_ICONS[k] || "circle"}</span>
              </div>
              <span className="sbs-stat__value">{v}</span>
            </div>
          ))}
        </div>

        {/* ── Request cards ── */}
        <div className="sbs-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "var(--surface-container-low)", borderBottom: "1px solid var(--outline-variant)" }}>
            <h2 style={{ fontFamily: "Manrope", fontSize: "1rem", fontWeight: 700 }}>My Barter Requests</h2>
          </div>

          {requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--on-surface-variant)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>handshake</span>
              <p style={{ fontSize: "0.9rem" }}>No barter requests yet — send your first one above!</p>
            </div>
          ) : (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "var(--surface-container-low)" }}>
                    {["From", "To", "Exchange", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)", borderBottom: "1px solid var(--outline-variant)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => (
                    <tr key={r._id} style={{ borderTop: i > 0 ? "1px solid var(--surface-container)" : "none" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 600 }}>{r.fromUser?.name || "—"}</td>
                      <td style={{ padding: "14px 20px" }}>{r.toUser?.name || "—"}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className="sbs-chip">{r.offeredSkill}</span>
                        <span style={{ margin: "0 6px", color: "var(--outline)" }}>→</span>
                        <span className="sbs-chip sbs-chip--primary">{r.requestedSkill}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className="sbs-badge" style={{ ...(STATUS_STYLES[r.status] || STATUS_STYLES.canceled) }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {r.status === "pending" && String(r.toUser._id) === String(user._id) && (
                            <>
                              <button className="sbs-btn sbs-btn--secondary" style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => updateStatus(r._id, "accepted")}>Accept</button>
                              <button className="sbs-btn sbs-btn--ghost"  style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "var(--error)", color: "var(--error)" }} onClick={() => updateStatus(r._id, "rejected")}>Reject</button>
                              <button className="sbs-btn sbs-btn--ghost"  style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => cancel(r._id)}>Cancel</button>
                            </>
                          )}
                          {r.status === "pending" && String(r.fromUser._id) === String(user._id) && (
                            <button className="sbs-btn sbs-btn--ghost"  style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => cancel(r._id)}>Cancel</button>
                          )}
                          {r.status === "accepted" && (
                            <button className="sbs-btn sbs-btn--primary" style={{ padding: "6px 14px", fontSize: "0.78rem" }} onClick={() => updateStatus(r._id, "completed")}>
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </StateView>
    </div>
  );
};

export default RequestsPage;
