/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";
import { FiUser, FiMail, FiUserPlus, FiUsers } from "react-icons/fi";

const Agents = () => {
  const { showToast } = useContext(LeadContext);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const res = await fetchJSON("/agents");
      setAgents(res?.data?.agents || []);
    } catch (e) {
      showToast("Failed to load sales agents", "danger");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchJSON("/agents", {
        method: "POST",
        body: JSON.stringify(form),
      });

      showToast("Agent registered successfully", "success");
      setForm({ name: "", email: "" });
      loadAgents();
    } catch (err) {
      showToast("Failed to add agent. Verify email uniqueness.", "danger");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Sales Agents</h1>
        <p className="page-subtitle">
          Manage, onboard, and assign team members to leads
        </p>
      </div>

      <div className="row g-4">
        {/* Add Agent Form */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiUserPlus className="text-primary" size={20} />
                <h2 className="fs-6 fw-bold mb-0">Add New Agent</h2>
              </div>

              <form onSubmit={submit}>
                <div className="mb-3">
                  <label htmlFor="agent-name" className="form-label">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-muted">
                      <FiUser size={15} />
                    </span>
                    <input
                      id="agent-name"
                      required
                      className="form-control"
                      placeholder="e.g. Maya Reynolds"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="agent-email" className="form-label">
                    Work Email
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-muted">
                      <FiMail size={15} />
                    </span>
                    <input
                      id="agent-email"
                      required
                      type="email"
                      className="form-control"
                      placeholder="e.g. maya@company.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  <FiUserPlus size={16} />
                  <span>{loading ? "Adding Agent..." : "Register Sales Agent"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FiUsers className="text-primary" size={20} />
                  <h2 className="fs-6 fw-bold mb-0">Active Team Directory</h2>
                </div>
                <span className="badge bg-dark text-secondary border border-secondary">
                  {agents.length} {agents.length === 1 ? "Agent" : "Agents"}
                </span>
              </div>

              {agents.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted small mb-0">
                    No agents registered yet. Use the form to add your first sales agent.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {agents.map((a) => (
                    <div
                      key={a._id}
                      className="d-flex align-items-center justify-content-between p-3 rounded"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-badge">
                          {getInitials(a.name)}
                        </div>
                        <div>
                          <div className="fw-semibold text-white">
                            {a.name}
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <FiMail size={12} />
                            <span>{a.email}</span>
                          </div>
                        </div>
                      </div>
                      <span className="status-badge status-closed">
                        <span className="status-badge-dot" />
                        Active
                      </span>
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

export { Agents };
