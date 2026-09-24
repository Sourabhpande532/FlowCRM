import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";
import { LeadCard } from "../component/LeadCard";
import {
  FiFilter,
  FiPlus,
  FiRotateCcw,
  FiUsers,
  FiTag,
  FiCheck,
} from "react-icons/fi";

function LeadList() {
  const { agents = [], tags = [], showToast } = useContext(LeadContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: parse current URL search into an object of filter values
  const parseSearch = (search) => {
    const sp = new URLSearchParams(search);
    return {
      salesAgent: sp.get("salesAgent") || "",
      status: sp.get("status") || "",
      source: sp.get("source") || "",
      tags: sp.get("tags") || "",
      sortBy: sp.get("sortBy") || "",
      sortDir: sp.get("sortDir") || "asc",
    };
  };

  // filters state mirrors the URL params
  const [filters, setFilters] = useState(() => parseSearch(location.search));

  // Keep filters in sync with URL: whenever location.search changes, update filters
  useEffect(() => {
    setFilters(parseSearch(location.search));
  }, [location.search]);

  // Build URL search string from filters and navigate to it
  const applyFilters = () => {
    const sp = new URLSearchParams();
    if (filters.salesAgent) sp.set("salesAgent", filters.salesAgent);
    if (filters.status) sp.set("status", filters.status);
    if (filters.source) sp.set("source", filters.source);
    if (filters.tags) sp.set("tags", filters.tags);
    if (filters.sortBy) sp.set("sortBy", filters.sortBy);
    if (filters.sortDir) sp.set("sortDir", filters.sortDir);
    navigate(`/leads?${sp.toString()}`);
  };

  const resetFilters = () => {
    navigate("/leads");
  };

  // Fetch leads whenever URL search changes
  useEffect(() => {
    let cancelled = false;
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const path = "/leads" + (location.search ? location.search : "");
        const data = await fetchJSON(path);
        if (!cancelled) {
          setLeads((data && data.data && data.data.leads) || []);
        }
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        if (!cancelled) setLeads([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLeads();
    return () => {
      cancelled = true;
    };
  }, [location.search]);

  const updateFilterField = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const deleteLead = async (id) => {
    try {
      await fetchJSON(`/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      if (showToast) showToast("Lead removed from pipeline", "success");
    } catch (error) {
      if (showToast) showToast("Failed to delete lead", "danger");
    }
  };

  const hasActiveFilters = Boolean(
    filters.salesAgent ||
    filters.status ||
    filters.source ||
    filters.tags ||
    filters.sortBy
  );

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">
            Filter, prioritize, and track customer conversions across stages
          </p>
        </div>
        <Link to="/add-lead" className="btn btn-primary shadow-sm">
          <FiPlus size={16} />
          <span>New Lead</span>
        </Link>
      </div>

      {/* FILTERS CONTROL PANEL */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <FiFilter className="text-primary" size={17} />
              <h2 className="fs-6 fw-bold mb-0">Pipeline Filters & Sort</h2>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-icon-subtle small d-flex align-items-center gap-1 text-muted"
                onClick={resetFilters}
              >
                <FiRotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="row g-3 align-items-end">
            {/* Sales Agent */}
            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="filter-agent" className="form-label">
                Sales Agent
              </label>
              <select
                id="filter-agent"
                className="form-select"
                value={filters.salesAgent}
                onChange={(e) => updateFilterField("salesAgent", e.target.value)}
              >
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="col-12 col-sm-6 col-md-2">
              <label htmlFor="filter-status" className="form-label">
                Status
              </label>
              <select
                id="filter-status"
                className="form-select"
                value={filters.status}
                onChange={(e) => updateFilterField("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal Sent</option>
                <option>Closed</option>
              </select>
            </div>

            {/* Source */}
            <div className="col-12 col-sm-6 col-md-2">
              <label htmlFor="filter-source" className="form-label">
                Source
              </label>
              <select
                id="filter-source"
                className="form-select"
                value={filters.source}
                onChange={(e) => updateFilterField("source", e.target.value)}
              >
                <option value="">All Sources</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Cold Call</option>
                <option>Advertisement</option>
                <option>Email</option>
                <option>Other</option>
              </select>
            </div>

            {/* Tags */}
            <div className="col-12 col-sm-6 col-md-2">
              <label htmlFor="filter-tags" className="form-label">
                Tags
              </label>
              <select
                id="filter-tags"
                className="form-select"
                value={filters.tags}
                onChange={(e) => updateFilterField("tags", e.target.value)}
              >
                <option value="">All Tags</option>
                {tags.map((t) => (
                  <option key={t._id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort & Dir */}
            <div className="col-6 col-md-1">
              <label htmlFor="filter-sort" className="form-label">
                Sort
              </label>
              <select
                id="filter-sort"
                className="form-select px-2"
                value={filters.sortBy}
                onChange={(e) => updateFilterField("sortBy", e.target.value)}
              >
                <option value="">Default</option>
                <option value="priority">Priority</option>
                <option value="timeToClose">Close Time</option>
                <option value="createdAt">Created</option>
              </select>
            </div>

            <div className="col-6 col-md-1">
              <label htmlFor="filter-dir" className="form-label">
                Order
              </label>
              <select
                id="filter-dir"
                className="form-select px-2"
                value={filters.sortDir}
                onChange={(e) => updateFilterField("sortDir", e.target.value)}
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="col-12 col-md-1">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={applyFilters}
              >
                <FiCheck size={16} />
                <span className="d-md-none">Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEW: LEADS + QUICK FILTERS SIDEBAR */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
          <span className="text-muted small">Loading matching leads...</span>
        </div>
      ) : (
        <div className="row g-4">
          {/* LEADS LIST */}
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fs-6 fw-bold mb-0 text-secondary">
                Showing {leads.length} {leads.length === 1 ? "lead" : "leads"}
              </h2>
            </div>

            {leads.length === 0 ? (
              <div className="card p-5 text-center">
                <FiUsers size={32} className="text-muted mx-auto mb-3" />
                <h3 className="fs-6 fw-bold text-white mb-1">No Leads Found</h3>
                <p className="text-muted small mb-3">
                  No records match your selected criteria. Try adjusting or clearing your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mx-auto"
                    onClick={resetFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              leads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} onDelete={deleteLead} />
              ))
            )}
          </div>

          {/* QUICK SIDEBAR */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "1.5rem" }}>
              <div className="card-body">
                <h2 className="fs-6 fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiFilter className="text-primary" size={16} />
                  <span>Preset Filters</span>
                </h2>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate("/leads?status=New")}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate("/leads?status=Contacted")}
                  >
                    Contacted
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate("/leads?status=Qualified")}
                  >
                    Qualified
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate("/leads?status=Closed")}
                  >
                    Closed
                  </button>
                </div>

                {/* TAGS */}
                {tags && tags.length > 0 && (
                  <>
                    <hr />
                    <h2 className="fs-6 fw-bold mb-2 d-flex align-items-center gap-2">
                      <FiTag className="text-primary" size={15} />
                      <span>Filter by Tag</span>
                    </h2>
                    <div className="d-flex flex-wrap gap-1">
                      {tags.map((t) => (
                        <button
                          key={t._id}
                          type="button"
                          className="btn-icon-subtle tag-badge"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/leads?tags=${encodeURIComponent(t.name)}`)}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { LeadList };
