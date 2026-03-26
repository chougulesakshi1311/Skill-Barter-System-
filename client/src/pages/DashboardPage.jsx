import { useEffect, useState } from "react";
import api from "../api/client";
import StateView from "../components/StateView";

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    activeRequests: 0,
    matchesFound: 0,
    completedBarters: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/dashboard/user");
      setMetrics(data.metrics);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    ["Active Requests", metrics.activeRequests, "bg-primary"],
    ["Matches Found", metrics.matchesFound, "bg-success"],
    ["Completed Barters", metrics.completedBarters, "bg-info"],
    ["Unread Notifications", metrics.unreadNotifications, "bg-warning"],
  ];

  return (
    <div>
      <h2 className="mb-3">Dashboard</h2>
      <StateView loading={loading} error={error} onRetry={load}>
        <div className="row g-3">
          {cards.map(([title, value, color]) => (
            <div className="col-12 col-md-6 col-lg-3" key={title}>
              <div className={`card text-white border-0 shadow-sm ${color}`}>
                <div className="card-body">
                  <p className="mb-1">{title}</p>
                  <h3 className="mb-0">{value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StateView>
    </div>
  );
};

export default DashboardPage;
