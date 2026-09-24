import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiPlusCircle,
  FiBarChart2,
  FiSliders,
  FiMenu,
  FiX,
  FiZap,
} from "react-icons/fi";
import "../../src/style.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        type="button"
        className="btn btn-outline-secondary d-md-none sidebar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <FiMenu size={20} />
      </button>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close navigation overlay"
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setOpen(false);
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* BRAND HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <NavLink
            to="/"
            className="sidebar-brand mb-0 pb-0 border-0"
            onClick={() => setOpen(false)}
          >
            <div className="sidebar-logo-icon">
              <FiZap size={18} />
            </div>
            <div>
              <div className="sidebar-brand-name">Flow CRM</div>
              <div className="sidebar-brand-tag">Sales CRM</div>
            </div>
          </NavLink>

          {/* CLOSE BUTTON (mobile only) */}
          <button
            type="button"
            className="btn btn-icon-subtle d-md-none"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">Navigation</div>

        <nav className="nav flex-column gap-1">
          <NavLink className="nav-link" to="/" end onClick={() => setOpen(false)}>
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>
          <NavLink className="nav-link" to="/leads" onClick={() => setOpen(false)}>
            <FiUsers />
            <span>Leads</span>
          </NavLink>
          <NavLink className="nav-link" to="/add-lead" onClick={() => setOpen(false)}>
            <FiPlusCircle />
            <span>Add Lead</span>
          </NavLink>
          <NavLink className="nav-link" to="/agents" onClick={() => setOpen(false)}>
            <FiUserPlus />
            <span>Sales Agents</span>
          </NavLink>
          <NavLink className="nav-link" to="/reports" onClick={() => setOpen(false)}>
            <FiBarChart2 />
            <span>Reports</span>
          </NavLink>
          <NavLink className="nav-link" to="/settings" onClick={() => setOpen(false)}>
            <FiSliders />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* SIDEBAR FOOTER STATUS */}
        <div className="sidebar-footer">
          <div className="sidebar-status-dot" />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>System Online</div>
            <div className="text-muted" style={{ fontSize: "0.7rem" }}>
              v2.1 • Enterprise
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
