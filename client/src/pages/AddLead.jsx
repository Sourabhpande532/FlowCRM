import { useContext, useState } from "react";
import { LeadContext } from "../context/LeadContext";
import { useNavigate, Link } from "react-router-dom";
import { fetchJSON } from "../api";
import {
  FiArrowLeft,
  FiPlus,
  FiX,
  FiUser,
  FiBriefcase,
  FiClock,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";
import "../App.css";

const AddLeads = () => {
  const { agents = [], showToast } = useContext(LeadContext);
  const [form, setForm] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: 30,
    priority: "Medium",
  });

  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      tags: Array.from(new Set([...prev.tags, tagInput.trim()])),
    }));
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((x) => x !== tag),
    }));

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setSubmitting(true);
    try {
      await fetchJSON("/leads", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (showToast) showToast("Lead created and assigned successfully", "success");
      navigate("/leads");
    } catch (e) {
      if (showToast) showToast("Failed to create lead. Please verify all inputs.", "danger");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Back button */}
      <div className="mb-3">
        <Link
          to="/leads"
          className="btn-icon-subtle text-decoration-none d-inline-flex align-items-center gap-1 small text-muted"
        >
          <FiArrowLeft size={14} />
          <span>Back to Leads</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Create New Lead</h1>
        <p className="page-subtitle">
          Onboard a prospective client and assign them to an active sales agent
        </p>
      </div>

      {/* Form Card */}
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">
          <div className="card shadow-sm">
            <div className="card-body p-3 p-md-4">
              <form onSubmit={submit}>
                {/* Lead Name */}
                <div className="mb-4">
                  <label htmlFor="lead-name" className="form-label">
                    Client / Company Name *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-muted">
                      <FiUser size={15} />
                    </span>
                    <input
                      id="lead-name"
                      required
                      name="name"
                      className="form-control"
                      placeholder="e.g. Acme Innovations Corp"
                      value={form.name}
                      onChange={handle}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  {/* Source */}
                  <div className="col-12 col-md-4">
                    <label htmlFor="lead-source" className="form-label">
                      Acquisition Channel *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <FiBriefcase size={15} />
                      </span>
                      <select
                        id="lead-source"
                        name="source"
                        className="form-select"
                        value={form.source}
                        onChange={handle}
                      >
                        <option>Website</option>
                        <option>Referral</option>
                        <option>Cold Call</option>
                        <option>Advertisement</option>
                        <option>Email</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Sales Agent */}
                  <div className="col-12 col-md-4">
                    <label htmlFor="lead-agent" className="form-label">
                      Assigned Agent *
                    </label>
                    <select
                      id="lead-agent"
                      name="salesAgent"
                      className="form-select"
                      value={form.salesAgent}
                      onChange={handle}
                      required
                    >
                      <option value="">-- Choose Agent --</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="col-12 col-md-4">
                    <label htmlFor="lead-priority" className="form-label">
                      Deal Priority
                    </label>
                    <select
                      id="lead-priority"
                      name="priority"
                      className="form-select"
                      value={form.priority}
                      onChange={handle}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  {/* Status */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="lead-status" className="form-label">
                      Initial Status Stage
                    </label>
                    <select
                      id="lead-status"
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handle}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Proposal Sent</option>
                      <option>Closed</option>
                    </select>
                  </div>

                  {/* Time to Close */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="lead-time" className="form-label">
                      Estimated Days to Close *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <FiClock size={15} />
                      </span>
                      <input
                        id="lead-time"
                        type="number"
                        min="1"
                        name="timeToClose"
                        className="form-control"
                        placeholder="30"
                        value={form.timeToClose}
                        onChange={handle}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                  <label htmlFor="tag-input" className="form-label mb-2 d-flex align-items-center gap-1">
                    <FiTag size={14} className="text-primary" />
                    <span>Lead Classification Tags</span>
                  </label>

                  <div className="input-group mb-2">
                    <input
                      id="tag-input"
                      className="form-control"
                      placeholder="Type a tag name and hit Enter or Add"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addTag}
                    >
                      <FiPlus size={15} />
                      <span>Add Tag</span>
                    </button>
                  </div>

                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {form.tags.length === 0 ? (
                      <span className="text-muted small">No tags attached yet.</span>
                    ) : (
                      form.tags.map((tag) => (
                        <span key={tag} className="tag-badge" style={{ padding: "0.25rem 0.6rem" }}>
                          <span>{tag}</span>
                          <button
                            type="button"
                            className="btn-icon-subtle p-0 ms-1 text-muted"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove tag ${tag}`}
                            style={{ lineHeight: 1 }}
                          >
                            <FiX size={13} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-10">
                  <Link to="/leads" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={submitting}
                  >
                    <FiCheckCircle size={16} />
                    <span>{submitting ? "Creating Lead..." : "Create & Assign Lead"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddLeads };
