import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import StateView from "../components/StateView";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ toUser: "", offeredSkill: "", requestedSkill: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/barter");
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const grouped = useMemo(() => {
    const stats = { pending: 0, accepted: 0, rejected: 0, completed: 0, canceled: 0 };
    requests.forEach((r) => {
      stats[r.status] = (stats[r.status] || 0) + 1;
    });
    return stats;
  }, [requests]);

  const submitRequest = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/barter", form);
      setForm({ toUser: "", offeredSkill: "", requestedSkill: "", message: "" });
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/barter/${id}/status`, { status });
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const cancel = async (id) => {
    try {
      await api.patch(`/barter/${id}/cancel`);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel request");
    }
  };

  return (
    <div className="d-grid gap-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4>Send Barter Request</h4>
          <form onSubmit={submitRequest} className="row g-2">
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Target User ID"
                value={form.toUser}
                onChange={(e) => setForm({ ...form, toUser: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Skill you offer"
                value={form.offeredSkill}
                onChange={(e) => setForm({ ...form, offeredSkill: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Skill you need"
                value={form.requestedSkill}
                onChange={(e) => setForm({ ...form, requestedSkill: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="submit">
                Send
              </button>
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                rows="2"
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </form>
        </div>
      </div>

      <StateView loading={loading} error={error} onRetry={loadRequests}>
      <div className="row g-2">
        {Object.entries(grouped).map(([k, v]) => (
          <div className="col-6 col-md-2" key={k}>
            <div className="card border-0 shadow-sm">
              <div className="card-body py-2">
                <small className="text-muted text-capitalize">{k}</small>
                <h5 className="mb-0">{v}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4>My Barter Requests</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Exchange</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.fromUser?.name}</td>
                    <td>{r.toUser?.name}</td>
                    <td>
                      {r.offeredSkill}{" -> "}{r.requestedSkill}
                    </td>
                    <td>
                      <span className="badge text-bg-secondary text-capitalize">{r.status}</span>
                    </td>
                    <td className="d-flex gap-2 flex-wrap">
                      {r.status === "pending" && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => updateStatus(r._id, "accepted")}>
                            Accept
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(r._id, "rejected")}>
                            Reject
                          </button>
                          <button className="btn btn-sm btn-outline-dark" onClick={() => cancel(r._id)}>
                            Cancel
                          </button>
                        </>
                      )}
                      {r.status === "accepted" && (
                        <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r._id, "completed")}>
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </StateView>
    </div>
  );
};

export default RequestsPage;
