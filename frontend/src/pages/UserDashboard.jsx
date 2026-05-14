import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });

  const fetchData = async () => {
    const res = await API.get("/complaints/my");
    setComplaints(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const createComplaint = async (e) => {
  e.preventDefault();
  try {
    await API.post("/complaints", form);
    toast.success("Complaint created successfully!");
    fetchData();
  } catch (err) {
    toast.error("Failed to create complaint");
  }
};


  return (
    <div className="container">
      <h2>Create Complaint</h2>

      <div className="card">
        <form onSubmit={createComplaint}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <button>Create Complaint</button>
        </form>
      </div>

      <h2>My Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <span className={
            c.status === "OPEN"
              ? "badge badge-open"
              : c.status === "IN_PROGRESS"
              ? "badge badge-progress"
              : "badge badge-resolved"
          }>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  );
}
