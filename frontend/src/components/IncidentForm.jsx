import React, { useState } from "react";

function IncidentForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, severity });
    setTitle("");
    setDescription("");
    setSeverity("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        className="form-select mb-2"
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        required
      >
        <option value="">Select</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button className="btn btn-primary">Create Incident</button>
    </form>
  );
}

export default IncidentForm
