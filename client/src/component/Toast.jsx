import { useContext } from "react";
import { LeadContext } from "../context/LeadContext";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from "react-icons/fi";

const Toast = () => {
  const { toast, setToast } = useContext(LeadContext);

  if (!toast?.show) return null;

  const isSuccess = toast.type === "success" || toast.type === "Success";
  const isDanger = toast.type === "danger" || toast.type === "error";
  const isWarning = toast.type === "warning";

  const getIcon = () => {
    if (isSuccess) return <FiCheckCircle size={18} className="text-success flex-shrink-0" />;
    if (isDanger) return <FiAlertCircle size={18} className="text-danger flex-shrink-0" />;
    if (isWarning) return <FiAlertTriangle size={18} className="text-warning flex-shrink-0" />;
    return <FiInfo size={18} className="text-info flex-shrink-0" />;
  };

  const getBorderClass = () => {
    if (isSuccess) return "anvaya-toast-success";
    if (isDanger) return "anvaya-toast-danger";
    if (isWarning) return "anvaya-toast-warning";
    return "anvaya-toast-info";
  };

  return (
    <div className="anvaya-toast-container" role="status" aria-live="polite">
      <div className={`anvaya-toast ${getBorderClass()}`}>
        {getIcon()}
        <div style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500 }}>
          {toast.message}
        </div>
        <button
          type="button"
          className="btn-icon-subtle"
          onClick={() => setToast((prev) => ({ ...prev, show: false }))}
          aria-label="Close notification"
          style={{ padding: "0.2rem", lineHeight: 1 }}
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
