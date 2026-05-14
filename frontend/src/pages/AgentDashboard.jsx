import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
export default function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/complaints/assigned");
    setComplaints(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
  try {
    await API.put(`/complaints/${id}/status`, { status });
    toast.success("Status updated!");
    fetchData();
  } catch (err) {
    toast.error("Update failed");
  }
};


  return (
    <div className="container">
      <h2>Assigned Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>
            <strong>Priority:</strong>{" "}
            <span className={
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

          <p>Status: {c.status}</p>

          {c.status === "OPEN" && (
            <button
              onClick={() =>
                updateStatus(c._id, "IN_PROGRESS")
              }
            >
              Start Work
            </button>
          )}

          {c.status === "IN_PROGRESS" && (
            <button
              onClick={() =>
                updateStatus(c._id, "RESOLVED")
              }
            >
              Mark Resolved
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
