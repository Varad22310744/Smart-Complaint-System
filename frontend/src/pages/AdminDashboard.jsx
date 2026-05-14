import { useEffect, useState } from "react";
// API instance lives in src/api/axios.js
import API from "../api/axios";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [showLogsFor, setShowLogsFor] = useState(null);

  // escalation UI state
  const [escalationTarget, setEscalationTarget] = useState(null);
  const [escalationAgent, setEscalationAgent] = useState("");
  const [escalationRemarks, setEscalationRemarks] = useState("");

  useEffect(() => {
    fetchComplaints();
    fetchAgents();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      toast.error("Failed to fetch complaints");
    }
  };

  const fetchAgents = async () => {
    try {
      // adminRoutes and complaintRoutes both expose agents, but since
      // we're already hitting /complaints for complaints we can use
      // the same base path here.
      const res = await API.get("/complaints/agents");
      setAgents(res.data);
    } catch (err) {
      toast.error("Failed to fetch agents");
    }
  };

  const assignComplaint = async (complaintId, agentId) => {
    try {
      await API.put(`/complaints/${complaintId}/assign`, { agentId });
      toast.success("Complaint assigned");
      // refetch to update UI with populated assignedTo
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
    }
  };

  const startEscalation = (complaintId) => {
    setEscalationTarget(complaintId);
    setEscalationAgent("");
    setEscalationRemarks("");
  };

  const cancelEscalation = () => {
    setEscalationTarget(null);
  };

  const escalateComplaint = async () => {
    if (!escalationAgent || !escalationRemarks) {
      toast.error("Please choose an agent and provide remarks");
      return;
    }

    try {
      await API.put(`/complaints/${escalationTarget}/escalate`, {
        newAgentId: escalationAgent,
        remarks: escalationRemarks,
      });
      toast.success("Complaint escalated");
      // refetch to update UI with populated assignedTo
      fetchComplaints();
      cancelEscalation();
    } catch (err) {
      toast.error(err.response?.data?.message || "Escalation failed");
    }
  };

  const fetchLogs = async (complaintId) => {
    try {
      const res = await API.get(`/complaints/${complaintId}/logs`);
      // backend returns an array directly, not wrapped in { logs: [...] }
      const logs = Array.isArray(res.data) ? res.data : res.data.logs || [];
      setSelectedLogs(logs);
      setShowLogsFor(complaintId);
    } catch (err) {
      toast.error("Failed to fetch logs");
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "OPEN").length;
  const inProgress = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const resolved = complaints.filter(c => c.status === "RESOLVED").length;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-box">Total: {total}</div>
        <div className="stat-box">Open: {pending}</div>
        <div className="stat-box">In Progress: {inProgress}</div>
        <div className="stat-box">Resolved: {resolved}</div>
      </div>

      {complaints.map((c) => (
        <div key={c._id} className="card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>

          <p>
            <strong>Status:</strong> {c.status}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            <span
              className={
                c.priority === "HIGH"
                  ? "badge badge-high"
                  : c.priority === "MEDIUM"
                  ? "badge badge-medium"
                  : "badge badge-low"
              }
            >
              {c.priority}
            </span>
          </p>

          {/* Show assigned info only if assigned */}
          {c.assignedTo && (
            <p>
              <strong>Assigned To:</strong>{" "}
              {c.assignedTo.username || c.assignedTo}
            </p>
          )}

          {/* Assign Dropdown - show only if not already assigned */}
          {!c.assignedTo ? (
            <select
              disabled={agents.length === 0}
              onChange={(e) => assignComplaint(c._id, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                {agents.length === 0 ? "No agents available" : "Assign Agent"}
              </option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.username}
                </option>
              ))}
            </select>
          ) : null}

          <button
            onClick={() => startEscalation(c._id)}
            disabled={c.status === "RESOLVED"}
            style={{ backgroundColor: "#f97316", marginLeft: "8px" }}
          >
            Escalate
          </button>

          {/* Escalation form shown when this complaint is targeted */}
          {escalationTarget === c._id && (
            <div className="escalation-form" style={{ marginTop: '8px' }}>
              <select
                value={escalationAgent}
                onChange={(e) => setEscalationAgent(e.target.value)}
                disabled={agents.length === 0}
              >
                <option value="" disabled>
                  {agents.length === 0 ? "No agents available" : "Select agent"}
                </option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.username}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Remarks"
                value={escalationRemarks}
                onChange={(e) => setEscalationRemarks(e.target.value)}
                style={{ marginLeft: '8px' }}
              />
              <button
                onClick={escalateComplaint}
                style={{ marginLeft: '8px' }}
              >
                Submit
              </button>
              <button
                onClick={cancelEscalation}
                style={{ marginLeft: '4px', backgroundColor: '#ccc' }}
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={() => fetchLogs(c._id)}
            style={{ backgroundColor: "#6b7280", marginLeft: "8px" }}
          >
            View History
          </button>

          {/* Activity Logs */}
          {showLogsFor === c._id && (
            <div className="log-box">
              <h4>Activity History</h4>

              {(selectedLogs?.length ?? 0) === 0 && <p>No activity yet</p>}

              {(selectedLogs ?? []).map((log) => (
                <div key={log._id} className="log-item">
                  <strong>{log.actionType}</strong>
                  <p>
                    By: {log.performedBy?.username} (
                    {log.performedBy?.role})
                  </p>
                  {log.previousValue && (
                    <p>
                      {log.previousValue} → {log.newValue}
                    </p>
                  )}
                  <p>Remarks: {log.remarks}</p>
                  <small>
                    {new Date(log.createdAt).toLocaleString()}
                  </small>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}