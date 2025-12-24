import React, { useEffect, useState } from "react";
import { getAllIncidents, updateIncident } from "../api/api";
import AuditLogs from "../components/AuditLogs";
import Header from "../components/header";




function AdminDashboard() {
  const token = localStorage.getItem("token")
  const [incidents, setIncidents] = useState([])
  const [filter, setFilter] = useState({ status: "", severity: "", reported_by: "" })
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [editForm, setEditForm] = useState({ status: "", admin_notes: "" })
  const [err,setErr]=useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4


  // Fetch incidents from backend
  const fetchIncidents = async () => {
    try {
      const data = await getAllIncidents(token)
      setIncidents(data)
    } catch (e) {
      console.error("Failed to fetch incidents:", e)
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Handle edit modal open
  const handleUpdateClick = (incident) => {
    setEditingIncident(incident);
    setEditForm({
      status: incident.status || "",
      admin_notes: incident.admin_notes || ""
    });
    setShowEditModal(true);
  };

  // Handle edit submit
  const handleUpdateSubmit = async () => {
    if (!editForm.status || !editForm.admin_notes) {
      setErr('Both fields are mandatory')
      return
    }
    try {
      setErr('')
      const data=await updateIncident(token, editingIncident.id, editForm)
      setShowEditModal(false)
      setEditingIncident(null)
      fetchIncidents()
      setErr(data.message)
    } catch (error) {
      setErr(error.message || 'Something went wrong')
    }
  }

  // Filter incidents
  const filteredIncidents = incidents.filter((inc) => {
    return (
      (!filter.status || inc.status.toLowerCase().includes(filter.status.toLowerCase())) &&
      (!filter.severity || inc.severity.toLowerCase().includes(filter.severity.toLowerCase())) &&
      (!filter.reported_by || inc.reported_by === Number(filter.reported_by))
    );
  });

  // Status and severity badge classes
  const getSeverityClass = (severity) => {
    const classes = { high: "danger", medium: "warning", low: "success" };
    return classes[severity?.toLowerCase()] || "secondary";
  };

  const getStatusClass = (status) => {
    const classes = { Pending: "warning", Resolved: "success", "In Progress": "info" }
    return classes[status] || "secondary";
  };

  const uniqueStatuses = [...new Set(incidents.map(i => i.status))]

  const uniqueSeverity=[...new Set(incidents.map(i=>i.severity))]

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, incidents])


  return (
    <div>
      <Header />

      <div className="container-fluid px-4">
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card border-primary">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Total Incidents</h6>
                  <h2 className="card-title mb-0">{incidents.length}</h2>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-3">
                  <i className="bi bi-list-ul text-primary fs-2"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-warning">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Pending</h6>
                  <h2 className="card-title mb-0 text-warning">
                    {incidents.filter(i => i.status === "Pending").length}
                  </h2>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-3">
                  <i className="bi bi-clock text-warning fs-2"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-success">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Resolved</h6>
                  <h2 className="card-title mb-0 text-success">
                    {incidents.filter(i => i.status === "Resolved").length}
                  </h2>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-3">
                  <i className="bi bi-check-circle text-success fs-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Table */}
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Manage Incidents</h5>
            <button className="btn btn-primary btn-sm" onClick={fetchIncidents}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="card-body bg-light border-bottom">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Status</label>
                <select className="form-select" onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                  <option value="">Select</option>
                  {uniqueStatuses.map((s,i)=>(
                    <option value={s} key={i} >{s}</option>
                  ))}
                </select>
                
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Severity</label>
                <select className="form-select" onChange={(e) => setFilter({ ...filter, severity: e.target.value })}>
                  <option value="">Select</option>
                  {uniqueSeverity.map((s,i)=>(
                    <option value={s} key={i} >{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Reported By (ID)</label>
                <input type="text"
                  className="form-control"
                  placeholder="User ID"
                  value={filter.reported_by}
                  onChange={(e) => setFilter({ ...filter, reported_by: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">&nbsp;</label>
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => setFilter({ status: "", severity: "", reported_by: "" })}
                >
                 Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Reported By (Id)</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i> No incidents found
                      </td>
                    </tr>
                  ) : (
                    paginatedIncidents.map((inc) => (
                      <tr key={inc.id}>
                        <td className="fw-bold">{inc.id}</td>
                        <td>{inc.title}</td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }}>{inc.description}</td>
                        <td><span className={`badge bg-${getStatusClass(inc.status)}`}>{inc.status}</span></td>
                        <td><span className={`badge bg-${getSeverityClass(inc.severity)}`}>{inc.severity}</span></td>
                        <td>Staff{inc.reported_by}</td>
                        <td>
                        {new Intl.DateTimeFormat('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            hour12: true 
                        }).format(new Date(inc.updated_at))}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleUpdateClick(inc)} title="Update Incident">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-info" onClick={() => setSelectedIncident(inc.id)} title="View Audit Logs">
                              <i className="bi bi-clock-history"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
      </div>

      {/* Edit Modal */}
      {showEditModal && editingIncident && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Incident #{editingIncident.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Admin Notes</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                    placeholder="Enter notes about this incident..."
                  ></textarea>
                </div>
                {err && <p className="text-danger">{err}</p>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateSubmit}><i className="bi bi-check-circle me-1"></i> Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {selectedIncident && (
        <AuditLogs
          token={token}
          incidentId={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
