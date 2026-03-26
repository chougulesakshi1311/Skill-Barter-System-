import { useEffect, useState } from "react";
import api from "../api/client";

const AdminPage = () => {
  const [metrics, setMetrics] = useState({ totalUsers: 0, activeBarters: 0, completedBarters: 0, blockedUsers: 0 });
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [dashboardRes, usersRes] = await Promise.all([api.get("/dashboard/admin"), api.get("/admin/users")]);
    setMetrics(dashboardRes.data.metrics);
    setUsers(usersRes.data.users || []);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (id, isBlocked) => {
    await api.patch(`/admin/users/${id}/block`, { isBlocked: !isBlocked });
    load();
  };

  return (
    <div className="d-grid gap-3">
      <h2>Admin Panel</h2>
      <div className="row g-3">
        {Object.entries(metrics).map(([k, v]) => (
          <div key={k} className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <small className="text-muted text-capitalize">{k}</small>
                <h4>{v}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5>Manage Users</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.isBlocked ? "Blocked" : "Active"}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => toggleBlock(u._id, u.isBlocked)}>
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
