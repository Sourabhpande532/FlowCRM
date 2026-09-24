import "./App.css";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Toast from "./component/Toast";
import {
  Dashboard,
  LeadDetails,
  LeadList,
  AddLeads,
  Agents,
  Reports,
  Settings,
} from "./pages/index";

function App() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-3 p-md-4 ms-md-2" style={{ maxWidth: "100%", overflowX: "hidden" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadList />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/add-lead" element={<AddLeads />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default App;
