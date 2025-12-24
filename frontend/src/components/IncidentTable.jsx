import React, { useState } from 'react';

function IncidentTable({ incidents, showActions = false, onEdit, onViewLogs, rowsPerPage = 3 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const getSeverityClass = (severity) => ({
    high: "danger",
    medium: "warning",
    low: "success"
  }[severity?.toLowerCase()] || "secondary");

  const getStatusClass = (status) => ({
    Pending: "warning",
    Resolved: "success",
    "In Progress": "info"
  }[status] || "secondary");

 
  const totalPages = Math.ceil(incidents.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedIncidents = [...incidents].reverse().slice(startIndex, startIndex + rowsPerPage)

  


  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Reported By</th>
              <th>Updated At</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedIncidents.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 7 : 6} className="text-center py-5 text-muted">
                  No incidents found
                </td>
              </tr>
            ) : (
              paginatedIncidents.map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.title}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>{incident.description}</td>
                  <td><span className={`badge bg-${getStatusClass(incident.status)}`}>{incident.status}</span></td>
                  <td><span className={`badge bg-${getSeverityClass(incident.severity)}`}>{incident.severity}</span></td>
                  <td>User{incident.reported_by}</td>
                  <td>
                    {new Intl.DateTimeFormat('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            hour12: true 
                        }).format(new Date(incident.updated_at))}
                  </td>
                  {showActions && (
                    <td>
                      {onEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(incident)}>Edit</button>}
                      {onViewLogs && <button className="btn btn-sm btn-outline-info" onClick={() => onViewLogs(incident)}>Logs</button>}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center p-3">
              <span className="text-muted">
                Page {currentPage} of {totalPages}
                </span>

            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                </li>
              </ul>
            </nav>
            </div>
      )}
    </div>
  );
}

export default IncidentTable;
