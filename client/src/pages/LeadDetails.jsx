import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";
import {
  FiArrowLeft,
  FiUser,
  FiClock,
  FiTag,
  FiCalendar,
  FiMessageSquare,
  FiSend,
  FiEdit2,
  FiCheck,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

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

const getPriorityClass = (priority) => {
  switch (priority) {
    case "High": return "priority-high";
    case "Medium": return "priority-medium";
    case "Low": return "priority-low";
    default: return "priority-medium";
  }
};

const getInitials = (name) => {
  if (!name) return "L";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

function LeadDetails() {
  const { showToast } = useContext(LeadContext);
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit comment states
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const load = async () => {
    try {
      const l = await fetchJSON("/leads/" + id);
      setLead(l?.data?.lead);
      setStatus(l?.data?.lead?.status || "");
    } catch (e) {
      console.error("Failed to load lead", e);
    }

    // Gracefully fetch comments (404 means 0 comments exist yet)
    try {
      const commentRes = await fetchJSON("/leads/" + id + "/comments");
      setComments(commentRes?.data?.comments || []);
    } catch (e) {
      setComments([]);
    }

    // Always load agents independently
    try {
      const agentRes = await fetchJSON("/agents");
      setAgents(agentRes?.data?.agents || []);
    } catch (e) {
      console.error("Failed to load agents", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  /* ================= ADD COMMENT ================= */
  const addComment = async (ev) => {
    ev.preventDefault();
    if (!author || !text.trim()) return;

    setSubmittingComment(true);
    try {
      const body = {
        commentText: text.trim(),
        author,
      };

      await fetchJSON("/leads/" + id + "/comments", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setText("");
      setAuthor("");
      load();
      if (showToast) showToast("Comment logged to timeline", "success");
    } catch (e) {
      if (showToast) showToast("Failed to add comment", "danger");
    } finally {
      setSubmittingComment(false);
    }
  };

  /* ================= EDIT COMMENT ================= */
  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await fetchJSON("/leads/comments/" + commentId, {
        method: "PUT",
        body: JSON.stringify({ commentText: editText.trim() }),
      });

      setEditId(null);
      setEditText("");
      load();
      if (showToast) showToast("Comment updated successfully", "success");
    } catch (e) {
      if (showToast) showToast("Failed to update comment", "danger");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async () => {
    setSavingStatus(true);
    try {
      await fetchJSON("/leads/" + id, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      load();
      if (showToast) showToast(`Status updated to ${status}`, "success");
    } catch (e) {
      if (showToast) showToast("Failed to update lead status", "danger");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
        <span className="text-muted small">Loading lead dossier...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="card p-5 text-center">
        <h2 className="fs-6 fw-bold text-white mb-2">Lead Record Not Found</h2>
        <p className="text-muted small mb-3">
          The requested lead could not be located or may have been deleted.
        </p>
        <Link to="/leads" className="btn btn-sm btn-outline-primary mx-auto">
          Back to Leads Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* BREADCRUMB */}
      <div className="mb-3">
        <Link
          to="/leads"
          className="btn-icon-subtle text-decoration-none d-inline-flex align-items-center gap-1 small text-muted"
        >
          <FiArrowLeft size={14} />
          <span>Back to Leads</span>
        </Link>
      </div>

      {/* LEAD HEADER CARD */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-badge" style={{ width: 44, height: 44, fontSize: "1rem" }}>
                {getInitials(lead.name)}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h1 className="fs-5 fw-bold mb-0 text-white">{lead.name}</h1>
                  <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                    <span className="status-badge-dot" />
                    {lead.status}
                  </span>
                </div>
                <div className="small text-muted mt-1 d-flex align-items-center gap-2">
                  <FiCalendar size={13} />
                  <span>Created {new Date(lead.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>•</span>
                  <span>ID: {lead._id}</span>
                </div>
              </div>
            </div>

            {/* STATUS UPDATE CONTROL */}
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "160px" }}
                aria-label="Change lead status"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal Sent</option>
                <option>Closed</option>
              </select>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={updateStatus}
                disabled={savingStatus || status === lead.status}
              >
                <FiCheckCircle size={15} />
                <span>{savingStatus ? "Saving..." : "Update"}</span>
              </button>
            </div>
          </div>

          <hr className="my-3" />

          {/* KEY INFORMATION GRID */}
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="text-muted small">Assigned Sales Agent</div>
              <div className="fw-semibold text-white d-flex align-items-center gap-1 mt-1">
                <FiUser size={14} className="text-primary" />
                <span>{lead.salesAgent?.name || "Unassigned"}</span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="text-muted small">Acquisition Source</div>
              <div className="fw-semibold text-white mt-1">
                {lead.source || "Website"}
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="text-muted small">Lead Priority</div>
              <div className="mt-1">
                <span className={`priority-pill ${getPriorityClass(lead.priority)}`}>
                  {lead.priority || "Medium"}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="text-muted small">Target Time to Close</div>
              <div className="fw-semibold text-white d-flex align-items-center gap-1 mt-1">
                <FiClock size={14} className="text-muted" />
                <span>{lead.timeToClose} days</span>
              </div>
            </div>
          </div>

          {/* TAGS */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="mt-3 pt-2 border-top border-secondary border-opacity-10 d-flex align-items-center gap-2 flex-wrap">
              <span className="text-muted small d-flex align-items-center gap-1">
                <FiTag size={12} />
                <span>Tags:</span>
              </span>
              {lead.tags.map((t) => (
                <span key={t} className="tag-badge">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COMMENTS / TIMELINE */}
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FiMessageSquare className="text-primary" size={18} />
            <h2 className="fs-6 fw-bold mb-0">Activity & Note History</h2>
            <span className="badge bg-dark text-secondary border border-secondary ms-auto">
              {comments.length} {comments.length === 1 ? "Note" : "Notes"}
            </span>
          </div>

          {/* ADD COMMENT FORM */}
          <form onSubmit={addComment} className="mb-4 p-3 rounded" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
            <div className="row g-2 mb-2">
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={agents.length === 0}
                  aria-label="Select comment author"
                >
                  <option value="">
                    {agents.length === 0 ? "Loading agents..." : "Select Comment Author"}
                  </option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <textarea
                className="form-control"
                rows={3}
                required
                placeholder="Log a client interaction, call note, or next step..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={!author || !text.trim() || submittingComment}
              >
                <FiSend size={14} />
                <span>{submittingComment ? "Posting..." : "Post Note"}</span>
              </button>
            </div>
          </form>

          {/* COMMENTS LIST */}
          {comments.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No notes or interaction logs on this lead yet. Use the form above to add the first log.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-badge" style={{ width: 26, height: 26, fontSize: "0.68rem" }}>
                        {getInitials(comment.author?.name)}
                      </div>
                      <span className="fw-semibold text-white small">
                        {comment.author?.name || "Team Member"}
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small">
                        {new Date(comment.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {editId !== comment._id && (
                      <button
                        type="button"
                        className="btn-icon-subtle small d-flex align-items-center gap-1"
                        onClick={() => {
                          setEditId(comment._id);
                          setEditText(comment.commentText);
                        }}
                        aria-label="Edit comment"
                      >
                        <FiEdit2 size={13} />
                        <span className="d-none d-sm-inline">Edit</span>
                      </button>
                    )}
                  </div>

                  {editId === comment._id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => saveEdit(comment._id)}
                        >
                          <FiCheck size={14} />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setEditId(null)}
                        >
                          <FiX size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>
                      {comment.commentText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { LeadDetails };
