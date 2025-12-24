import React from "react";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const role=localStorage.getItem('username')
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark  mb-4" style={{backgroundColor:"#19A1B7"}} >
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">
          Kiora Care
        </a>
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link text-white">
                <i className="bi bi-person-circle me-1"></i>
                {role} <span/>
              </span>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm ms-2 p-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header