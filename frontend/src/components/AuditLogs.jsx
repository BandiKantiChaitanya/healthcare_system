import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../api/api";

function AuditLogs({ token, incidentId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, [incidentId]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs(token, incidentId);
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  }).format(new Date(timestamp))
  }

  const getActionBadgeClass = (action) => {
    if (action.includes("Created")) return "bg-success";
    if (action.includes("Status")) return "bg-warning";
    if (action.includes("Notes")) return "bg-info";
    if (action.includes("Resolved")) return "bg-success";
    return "bg-secondary";
  }


  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className="bi bi-clock-history me-2"></i>
              Audit Logs - Incident {incidentId}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No audit logs found for this incident.
              </div>
            ) : (
              <div className="timeline">
                {logs.map((log) => (
                  <div key={log.id} className="card mb-3 border-start border-1 border-primary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-subtitle mb-0">
                          <span className={`badge ${getActionBadgeClass(log.action)} me-2`}>
                            {log.action.split(',')[0]}
                          </span>
                        </h6>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {formatDate(log.created_at)}
                        </small>
                      </div>

                      <p className="mb-2 fw-semibold">
                        Notes:{log.action.split('notes:')[1]}
                      </p>
                      <p className="card-text mb-1">{log.details}</p>
                      <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        By: Admin{log.user_id}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;