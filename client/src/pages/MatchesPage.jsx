import { useEffect, useState } from "react";
import api from "../api/client";
import StateView from "../components/StateView";

const MatchesPage = () => {
  const [pairMatches, setPairMatches] = useState([]);
  const [chainMatches, setChainMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/match");
      setPairMatches(data.pairMatches || []);
      setChainMatches(data.chainMatches || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="d-grid gap-4">
      <StateView loading={loading} error={error} onRetry={load}>
      <div>
        <h2>1-to-1 Matches</h2>
        <div className="row g-3 mt-1">
          {pairMatches.map((match) => (
            <div className="col-md-6 col-lg-4" key={match.user._id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5>{match.user.name}</h5>
                  <p className="text-muted small">{match.user.location || "Location not set"}</p>
                  <div className="progress mb-2" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{ width: `${match.matchPercentage}%` }}>
                      {match.matchPercentage}%
                    </div>
                  </div>
                  <small>Offer: {(match.user.skillsOffered || []).map((s) => s.name).join(", ") || "-"}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Chain Barter Matches</h2>
        <div className="d-grid gap-3">
          {chainMatches.map((chain, index) => (
            <div className="card border-0 shadow-sm" key={`chain-${index}`}>
              <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <p className="mb-1 fw-semibold">{chain.users.map((u) => u?.name).filter(Boolean).join(" -> ")}</p>
                  <small className="text-muted">Loop-based multi-user chain exchange</small>
                </div>
                <span className="badge text-bg-success fs-6">{chain.matchPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </StateView>
    </div>
  );
};

export default MatchesPage;
