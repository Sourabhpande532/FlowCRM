import { useContext, useEffect, useState } from "react";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";
import {
  FiTrash2,
  FiAlertTriangle,
  FiUser,
  FiLayers,
  FiX,
} from "react-icons/fi";

const getInitials = (name) => {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "New": return "status-new";
    case "Contacted": return "status-contacted";
    case "Qualified": return "status-qualified";
    case "Proposal Sent": return "status-proposal";
    case "Closed": return "status-closed";
    default: return "status-contacted";
  }
};

const Settings = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(LeadContext);
  const [confirmAction, setConfirmAction] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const leadsRes = await fetchJSON("/leads");
      const agentsRes = await fetchJSON("/agents");

      setLeads(leadsRes?.data?.leads || []);
      setAgents(agentsRes?.data?.agents || []);
    } catch (e) {
      console.error("Failed to load settings data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteLead = (id, name) => {
    setConfirmAction({
      type: "lead",
      id,
      title: "Delete Lead Record",
      message: `Are you sure you want to permanently delete lead "${name || id}"? This action cannot be reversed.`,
    });
  };

  const deleteAgent = (id, name) => {
    setConfirmAction({
      type: "agent",
      id,
      title: "Remove Sales Agent",
      message: `Are you sure you want to remove agent "${name || id}"? Leads assigned to this agent will need to be reassigned.`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmAction) return;

    setDeleting(true);
    try {
      if (confirmAction.type === "lead") {
        await fetchJSON(`/leads/${confirmAction.id}`, { method: "DELETE" });
        setLeads((prev) => prev.filter((l) => l._id !== confirmAction.id));
        if (showToast) showToast("Lead deleted successfully", "success");
      }

      if (confirmAction.type === "agent") {
        await fetchJSON(`/agents/${confirmAction.id}`, { method: "DELETE" });
        setAgents((prev) => prev.filter((a) => a._id !== confirmAction.id));
        if (showToast) showToast("Sales agent removed successfully", "success");
      }
    } catch (e) {
      if (showToast) showToast("Delete failed. Please try again.", "danger");
    } finally {
      setDeleting(false);
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
        <span className="text-muted small">Loading administration data...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Platform Administration</h1>
        <p className="page-subtitle">
          Manage system entities, prune outdated leads, and audit active sales agents
        </p>
      </div>

      {/* CONFIRMATION MODAL / DIALOG */}
      {confirmAction && (
        <div
          className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(4, 7, 14, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
          }}
        >
          <div
            className="card shadow-lg"
            style={{
              maxWidth: 460,
              width: "100%",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-circle"
                  style={{
                    backgroundColor: "var(--accent-rose-subtle)",
                    color: "var(--accent-rose)",
                  }}
                >
                  <FiAlertTriangle size={22} />
                </div>
                <div>
                  <h2 className="fs-6 fw-bold mb-0 text-white">
                    {confirmAction.title}
                  </h2>
                  <span className="text-muted small">Destructive Action</span>
                </div>
              </div>

              <p className="text-secondary small mb-4">
                {confirmAction.message}
              </p>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setConfirmAction(null)}
                  disabled={deleting}
                >
                  <FiX size={14} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  <FiTrash2 size={14} />
                  <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* LEADS REPOSITORY */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FiLayers className="text-primary" size={18} />
                  <h2 className="fs-6 fw-bold mb-0">Active Leads Database</h2>
                </div>
                <span className="badge bg-dark text-secondary border border-secondary">
                  {leads.length} Records
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-5 text-muted small">
                  No leads recorded in the system.
                </div>
              ) : (
                <div
                  className="d-flex flex-column gap-2"
                  style={{ maxHeight: 520, overflowY: "auto" }}
                >
                  {leads.map((lead) => (
                    <div
                      key={lead._id}
                      className="d-flex justify-content-between align-items-center p-3 rounded"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div>
                        <div className="fw-semibold text-white">
                          {lead.name}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-2 mt-1">
                          <span className={`status-badge ${getStatusBadgeClass(lead.status)}`} style={{ fontSize: "0.68rem", padding: "0.15rem 0.5rem" }}>
                            <span className="status-badge-dot" />
                            {lead.status}
                          </span>
                          <span>•</span>
                          <span>{lead.salesAgent?.name || "Unassigned"}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-icon-subtle btn-icon-danger"
                        title="Delete lead"
                        aria-label={`Delete lead ${lead.name}`}
                        onClick={() => deleteLead(lead._id, lead.name)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SALES AGENTS ROSTER */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FiUser className="text-success" size={18} />
                  <h2 className="fs-6 fw-bold mb-0">Sales Agents Roster</h2>
                </div>
                <span className="badge bg-dark text-secondary border border-secondary">
                  {agents.length} Members
                </span>
              </div>

              {agents.length === 0 ? (
                <div className="text-center py-5 text-muted small">
                  No sales agents currently registered.
                </div>
              ) : (
                <div
                  className="d-flex flex-column gap-2"
                  style={{ maxHeight: 520, overflowY: "auto" }}
                >
                  {agents.map((agent) => (
                    <div
                      key={agent._id}
                      className="d-flex justify-content-between align-items-center p-3 rounded"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-badge">
                          {getInitials(agent.name)}
                        </div>
                        <div>
                          <div className="fw-semibold text-white">
                            {agent.name}
                          </div>
                          <div className="small text-muted">{agent.email}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-icon-subtle btn-icon-danger"
                        title="Remove agent"
                        aria-label={`Delete agent ${agent.name}`}
                        onClick={() => deleteAgent(agent._id, agent.name)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Settings };
