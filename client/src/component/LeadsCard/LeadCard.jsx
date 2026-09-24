import { Link } from "react-router-dom";
import { FiTrash2, FiClock, FiCalendar, FiUser, FiTag } from "react-icons/fi";

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

const LeadCard = ({ lead, onDelete }) => {
  return (
    <div className="card mb-3 shadow-sm card-interactive">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-badge">
              {getInitials(lead.name)}
            </div>
            <div>
              <h3 className="fs-6 fw-bold mb-1">
                <Link
                  className="text-white text-decoration-none"
                  to={"/leads/" + lead._id}
                >
                  {lead.name}
                </Link>
              </h3>
              <div className="d-flex align-items-center gap-2 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <FiCalendar size={12} />
                  {new Date(lead.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>Source: {lead.source || "Website"}</span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
              <span className="status-badge-dot" />
              {lead.status}
            </span>
            <button
              type="button"
              className="btn-icon-subtle btn-icon-danger"
              title="Delete lead"
              aria-label={`Delete lead ${lead.name}`}
              onClick={() => onDelete(lead._id)}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* METADATA STRIP */}
        <div className="d-flex flex-wrap align-items-center gap-3 my-2 pt-2 border-top border-secondary border-opacity-10 small text-secondary">
          <div className="d-flex align-items-center gap-1">
            <FiUser size={13} className="text-muted" />
            <span>Agent:</span>
            <strong className="text-white">
              {lead.salesAgent?.name || "Unassigned"}
            </strong>
          </div>

          <div className="d-flex align-items-center gap-1">
            <span>Priority:</span>
            <span className={`priority-pill ${getPriorityClass(lead.priority)}`}>
              {lead.priority || "Medium"}
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <FiClock size={13} className="text-muted" />
            <span>Time to Close:</span>
            <span className="text-white fw-semibold">{lead.timeToClose} days</span>
          </div>
        </div>

        {/* TAGS */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-2">
            {lead.tags.map((t) => (
              <span key={t} className="tag-badge">
                <FiTag size={10} className="text-muted" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { LeadCard };
