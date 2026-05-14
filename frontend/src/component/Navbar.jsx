import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <h3>Smart Complaint System</h3>
      {user && (
        <div>
          <span style={{ marginRight: "15px" }}>
            {user.username} ({user.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
