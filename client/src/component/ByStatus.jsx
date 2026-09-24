import { useEffect, useState, useMemo } from "react";
import { fetchJSON } from "../api";

const STATUS_CONFIG = {
  New: {
    accent: "var(--accent-sky)",
    badgeClass: "status-new",
    label: "New Leads",
  },
  Contacted: {
    accent: "var(--brand-primary)",
    badgeClass: "status-contacted",
    label: "Contacted",
  },
  Qualified: {
    accent: "var(--accent-amber)",
    badgeClass: "status-qualified",
    label: "Qualified",
  },
  "Proposal Sent": {
    accent: "var(--accent-violet)",
    badgeClass: "status-proposal",
    label: "Proposal Sent",
  },
  Closed: {
    accent: "var(--accent-emerald)",
    badgeClass: "status-closed",
    label: "Closed / Won",
  },
};

const StatusAnalysis = ({ leads: propLeads }) => {
  const [fetchedLeads, setFetchedLeads] = useState(null);

  useEffect(() => {
    // Only fetch if parent did not pass down leads
    if (propLeads !== undefined && propLeads !== null) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchJSON("/leads");
        if (!cancelled) {
          setFetchedLeads(res?.data?.leads || []);
        }
      } catch (e) {
        console.error("Failed to load status analysis", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propLeads]);

  const counts = useMemo(() => {
    const activeLeads = propLeads !== undefined && propLeads !== null ? propLeads : (fetchedLeads || []);
    return activeLeads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});
  }, [propLeads, fetchedLeads]);

  return (
    <div className="row g-3">
      {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map((status) => {
        const cfg = STATUS_CONFIG[status] || {
          accent: "var(--brand-primary)",
          badgeClass: "status-contacted",
          label: status,
        };

        return (
          <div className="col-6 col-md-4 col-lg" key={status}>
            <div
              className="metric-card h-100"
              style={{ "--metric-accent": cfg.accent }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className={`status-badge ${cfg.badgeClass}`} style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                  <span className="status-badge-dot" />
                  {status}
                </span>
              </div>

              <div className="fs-3 fw-bold text-white mb-0" style={{ letterSpacing: "-0.03em" }}>
                {counts[status] || 0}
              </div>
              <div className="text-muted small" style={{ fontSize: "0.72rem" }}>
                {cfg.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { StatusAnalysis };
