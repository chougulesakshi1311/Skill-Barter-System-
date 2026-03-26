import { useEffect, useState } from "react";
import api from "../api/client";
import useSocket from "../hooks/useSocket";

const NotificationsPage = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification:new", onNewNotification);
    return () => socket.off("notification:new", onNewNotification);
  }, [socket]);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h4>Notifications</h4>
        <div className="list-group mt-3">
          {notifications.map((n) => (
            <div key={n._id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
              <div>
                <h6 className="mb-1">{n.title}</h6>
                <small className="text-muted">{n.body}</small>
              </div>
              {!n.isRead && (
                <button className="btn btn-sm btn-outline-primary" onClick={() => markRead(n._id)}>
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
