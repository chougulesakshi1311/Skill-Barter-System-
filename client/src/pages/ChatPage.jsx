import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import useSocket from "../hooks/useSocket";

const ChatPage = () => {
  const socket = useSocket();
  const [requests, setRequests] = useState([]);
  const [requestId, setRequestId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const accepted = useMemo(() => requests.filter((r) => r.status === "accepted"), [requests]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/barter");
      setRequests(data.requests || []);
    };

    load();
  }, []);

  useEffect(() => {
    if (!requestId) return;

    const loadMessages = async () => {
      const { data } = await api.get(`/messages/${requestId}`);
      setMessages(data.messages || []);
    };

    loadMessages();
    socket?.emit("chat:join", { requestId });

    return () => socket?.emit("chat:leave", { requestId });
  }, [requestId, socket]);

  useEffect(() => {
    if (!socket) return;

    const onMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("chat:message", onMessage);
    return () => socket.off("chat:message", onMessage);
  }, [socket]);

  const send = async (e) => {
    e.preventDefault();
    if (!requestId || !text.trim()) return;

    await api.post(`/messages/${requestId}`, { text });
    setText("");
  };

  return (
    <div className="row g-3">
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h5>Accepted Requests</h5>
            <div className="list-group mt-3">
              {accepted.map((r) => (
                <button
                  key={r._id}
                  className={`list-group-item list-group-item-action ${requestId === r._id ? "active" : ""}`}
                  onClick={() => setRequestId(r._id)}
                >
                  {r.offeredSkill}{" -> "}{r.requestedSkill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <h5>Chat</h5>
            <div className="chat-box my-3">
              {messages.map((m) => (
                <div key={m._id} className="chat-bubble mb-2">
                  <strong>{m.sender?.name || "User"}:</strong> {m.text}
                </div>
              ))}
            </div>
            <form className="d-flex gap-2 mt-auto" onSubmit={send}>
              <input
                className="form-control"
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
