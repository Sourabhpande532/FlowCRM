import { useEffect, useRef, useState } from "react";
import { fetchJSON } from "../api";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FiPieChart, FiCheckCircle, FiTrendingUp, FiActivity, FiUsers } from "react-icons/fi";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [pipeline, setPipeline] = useState(null);
  const [closedLastWeek, setClosedLastWeek] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusBarRef = useRef(null);
  const pipelinePieRef = useRef(null);
  const agentBarRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pipelineRes = await fetchJSON("/report/pipeline");
        const closedRes = await fetchJSON("/report/last-week");

        if (!cancelled) {
          setPipeline(pipelineRes);
          setClosedLastWeek(closedRes || []);
        }
      } catch (e) {
        console.error("Failed to load reports data", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pipeline || !statusBarRef.current || !pipelinePieRef.current || !agentBarRef.current) return;

    // Chart styling defaults
    const gridColor = "rgba(255, 255, 255, 0.06)";
    const tickColor = "#94a3b8";
    const fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";

    const statusChart = new Chart(statusBarRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(pipeline.byStatus || {}),
        datasets: [
          {
            label: "Active Leads",
            data: Object.values(pipeline.byStatus || {}),
            backgroundColor: "#6366f1",
            borderRadius: 6,
            hoverBackgroundColor: "#4f46e5",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111726",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "#283548",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: fontFamily } },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: fontFamily }, stepSize: 1 },
          },
        },
      },
    });

    const pipelineChart = new Chart(pipelinePieRef.current, {
      type: "pie",
      data: {
        labels: ["Closed Last Week", "Active Pipeline"],
        datasets: [
          {
            data: [
              closedLastWeek.length,
              pipeline.totalLeadsInPipeline || 0,
            ],
            backgroundColor: ["#10b981", "#6366f1"],
            borderColor: "#111726",
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#94a3b8",
              font: { family: fontFamily, size: 12 },
              padding: 16,
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          tooltip: {
            backgroundColor: "#111726",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "#283548",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    });

    const agentMap = {};
    closedLastWeek.forEach((l) => {
      const a = l.salesAgent || "Unassigned";
      agentMap[a] = (agentMap[a] || 0) + 1;
    });

    const agentLabels = Object.keys(agentMap);
    const agentData = Object.values(agentMap);

    const agentChart = new Chart(agentBarRef.current, {
      type: "bar",
      data: {
        labels: agentLabels.length > 0 ? agentLabels : ["No Closed Leads Yet"],
        datasets: [
          {
            label: "Closed Leads",
            data: agentData.length > 0 ? agentData : [0],
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
            hoverBackgroundColor: "#0284c7",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111726",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "#283548",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: fontFamily } },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: fontFamily }, stepSize: 1 },
          },
        },
      },
    });

    return () => {
      statusChart.destroy();
      pipelineChart.destroy();
      agentChart.destroy();
    };
  }, [pipeline, closedLastWeek]);

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Executive Sales Intelligence</h1>
        <p className="page-subtitle">
          Conversion velocities, stage distributions, and agent performance analytics
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
          <span className="text-muted small">Synthesizing intelligence metrics...</span>
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="metric-card h-100" style={{ "--metric-accent": "var(--brand-primary)" }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small">Active in Pipeline</span>
                  <div className="p-2 rounded" style={{ backgroundColor: "var(--brand-primary-subtle)", color: "#a5b4fc" }}>
                    <FiPieChart size={18} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white mb-0">
                  {pipeline?.totalLeadsInPipeline ?? 0}
                </div>
                <div className="text-muted small mt-1">
                  Active opportunities progressing
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="metric-card h-100" style={{ "--metric-accent": "var(--accent-emerald)" }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small">Closed in Last 7 Days</span>
                  <div className="p-2 rounded" style={{ backgroundColor: "var(--accent-emerald-subtle)", color: "#34d399" }}>
                    <FiCheckCircle size={18} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white mb-0">
                  {closedLastWeek.length}
                </div>
                <div className="text-muted small mt-1">
                  Deals successfully won this week
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="metric-card h-100" style={{ "--metric-accent": "var(--accent-amber)" }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small">Pipeline Health</span>
                  <div className="p-2 rounded" style={{ backgroundColor: "var(--accent-amber-subtle)", color: "#fbbf24" }}>
                    <FiTrendingUp size={18} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white mb-0">
                  {pipeline?.totalLeadsInPipeline ? "Healthy" : "Idle"}
                </div>
                <div className="text-muted small mt-1">
                  Velocity tracking across 5 stages
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FiActivity className="text-primary" size={18} />
                    <h2 className="fs-6 fw-bold mb-0">Lead Distribution by Pipeline Stage</h2>
                  </div>
                  <canvas ref={statusBarRef} height={140} />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FiPieChart className="text-success" size={18} />
                    <h2 className="fs-6 fw-bold mb-0">Closed Ratio vs Active Pipeline</h2>
                  </div>
                  <div style={{ maxWidth: 280, margin: "0 auto" }}>
                    <canvas ref={pipelinePieRef} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FiUsers className="text-info" size={18} />
                    <h2 className="fs-6 fw-bold mb-0">Closed Deals Breakdown by Sales Agent (Last 7 Days)</h2>
                  </div>
                  <canvas ref={agentBarRef} height={80} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { Reports };
