import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import { StatusAnalysis } from "../component/ByStatus";
import {
  FiPlus,
  FiArrowRight,
  FiUsers,
  FiUserCheck,
  FiPieChart,
  FiClock,
  FiFilter,
} from "react-icons/fi";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "New":
      return "status-new";
    case "Contacted":
      return "status-contacted";
    case "Qualified":
      return "status-qualified";
    case "Proposal Sent":
      return "status-proposal";
    case "Closed":
      return "status-closed";
    default:
      return "status-contacted";
  }
};

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchJSON("/leads");
        if (!cancelled) {
          setLeads(res?.data?.leads || []);
        }
      } catch (e) {
        console.error("Failed to load leads", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return "L";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="container-fluid px-0">
      {/* HEADER */}
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h1 className="page-title">Executive Pipeline Overview</h1>
          <p className="page-subtitle">
            Real-time sales velocity, lead distribution, and quick conversion actions
          </p>
        </div>
        <Link to="/add-lead" className="btn btn-primary shadow-sm">
          <FiPlus size={16} />
          <span>Add New Lead</span>
        </Link>
      </div>

      {/* METRIC STRIP (STATUS ANALYSIS) */}
      <div className="mb-4">
        <StatusAnalysis leads={leads} />
      </div>

      <div className="row g-4">
        {/* RECENT LEADS PIPELINE */}
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FiUsers className="text-primary" size={18} />
                  <h2 className="fs-6 fw-bold mb-0">Recent Pipeline Opportunities</h2>
                </div>
                <Link
                  to="/leads"
                  className="btn-icon-subtle text-decoration-none d-flex align-items-center gap-1 small text-primary"
                >
                  <span>View all ({leads.length})</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                  <span className="text-muted small">Loading pipeline data...</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted small mb-2">No active leads in pipeline.</p>
                  <Link to="/add-lead" className="btn btn-sm btn-outline-primary">
                    Create your first lead
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {leads.slice(0, 6).map((lead) => (
                    <div className="col-12 col-md-6" key={lead._id}>
                      <Link
                        to={`/leads/${lead._id}`}
                        className="text-decoration-none text-reset d-block"
                      >
                        <div
                          className="p-3 rounded card-interactive h-100"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar-badge" style={{ width: 28, height: 28, fontSize: "0.7rem" }}>
                                {getInitials(lead.name)}
                              </div>
                              <h3 className="fw-semibold text-white mb-0 fs-6 text-truncate" style={{ maxWidth: 170 }}>
                                {lead.name}
                              </h3>
                            </div>
                            <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                              <span className="status-badge-dot" />
                              {lead.status}
                            </span>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-10 small text-muted">
                            <span className="text-truncate" style={{ maxWidth: 140 }}>
                              Agent: {lead.salesAgent?.name || "Unassigned"}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <FiClock size={12} />
                              {lead.timeToClose}d to close
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS: QUICK FILTERS & ACTIONS */}
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-4">
            {/* QUICK ACTIONS */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="fs-6 fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiPieChart className="text-primary" size={18} />
                  <span>Workspace Actions</span>
                </h2>
                <div className="d-grid gap-2">
                  <Link
                    to="/leads"
                    className="btn btn-outline-secondary justify-content-start text-start"
                  >
                    <FiUsers size={16} className="text-primary" />
                    <span>Browse All Leads</span>
                  </Link>
                  <Link
                    to="/agents"
                    className="btn btn-outline-secondary justify-content-start text-start"
                  >
                    <FiUserCheck size={16} className="text-success" />
                    <span>Manage Sales Agents</span>
                  </Link>
                  <Link
                    to="/reports"
                    className="btn btn-outline-secondary justify-content-start text-start"
                  >
                    <FiPieChart size={16} className="text-warning" />
                    <span>Sales Analytics & Reports</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* QUICK FILTERS */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="fs-6 fw-bold mb-2 d-flex align-items-center gap-2">
                  <FiFilter className="text-primary" size={18} />
                  <span>Direct Status Filters</span>
                </h2>
                <p className="text-muted small mb-3">Jump directly to filtered stage views</p>
                <div className="d-flex gap-2 flex-wrap">
                  {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map((status) => (
                    <Link
                      key={status}
                      to={`/leads?status=${encodeURIComponent(status)}`}
                      className={`status-badge ${getStatusBadgeClass(status)} text-decoration-none`}
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                    >
                      <span className="status-badge-dot" />
                      {status}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
