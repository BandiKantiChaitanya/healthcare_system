const BASE_URL = import.meta.env.VITE_BASE_URL

async function handleFetch(url, options) {
  const res = await fetch(url, options);
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || "Something Went Wrong")
    // console.log(resData.message)
  return resData
}

// APIs
export const loginUser = (formData) =>
  handleFetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

export const getMe = (token) =>
  handleFetch(`${BASE_URL}/me`, {
    headers: { Authorization: token },
  });

export const createIncident = (token, incidentData) =>
  handleFetch(`${BASE_URL}/staff/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(incidentData),
  });

export const getMyIncidents = (token) =>
  handleFetch(`${BASE_URL}/staff/incidents/me`, {
    headers: { Authorization: token },
  });

export const getAllIncidents = (token, query = "") =>
  handleFetch(`${BASE_URL}/admin/incidents${query}`, {
    headers: { Authorization: token },
  });

export const updateIncident = (token, id, updateData) =>
  handleFetch(`${BASE_URL}/admin/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(updateData),
  })

export const getAuditLogs = (token, id) =>
  handleFetch(`${BASE_URL}/admin/incidents/${id}/logs`, {
    headers: { Authorization: token },
  });
