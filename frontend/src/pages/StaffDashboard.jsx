import React, { useEffect, useState } from "react";
import { createIncident, getMyIncidents } from "../api/api";
import IncidentTable from "../components/IncidentTable";
import IncidentForm from "../components/IncidentForm";
import Header from "../components/header";

function StaffDashboard() {
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem("token");

  const fetchIncidents = async () => {
    try {
      const data = await getMyIncidents(token);
      setIncidents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (incidentData) => {
    try {
      await createIncident(token, incidentData);
      fetchIncidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-fluid px-4">
      <h2>Staff Dashboard</h2>
      <IncidentForm onSubmit={handleCreateIncident} />
      <IncidentTable incidents={incidents} />
    </div>
    </div>
    
  )
}

export default StaffDashboard
