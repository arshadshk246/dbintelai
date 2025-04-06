import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("preferred-theme", newTheme);
  };

  const handleCardClick = (dbType) => {
    setSelectedForm(dbType);
  };

  const handleCancel = () => {
    setSelectedForm(null);
  };

  const handleFormSubmit = async (event, dbType) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/set-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = "/chat";
      } else {
        alert(`Connection error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to establish connection. Please check your details and try again."
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      {/* Theme Toggle */}
      <div className="theme-toggle p-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleTheme}
        >
          <i
            className={`bi ${
              theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"
            }`}
          />
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            Power System Database Assistant
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/chat">
                  Chat
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4">
            Welcome to Power System Database Assistant
          </h1>
          <p className="lead">
            An advanced LLM-powered chatbot for querying various database
            systems with natural language. This assistant can help you explore
            and analyze power system equipment data across different database
            platforms.
          </p>
          <a href="/chat" className="btn btn-primary btn-lg">
            Try Demo with Default GraphDB Data
          </a>
        </div>

        <h2 className="text-center mb-4">Connect to Your Database</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {["graphdb", "postgres", "aws-rds", "aws-neptune"].map((dbType) => (
            <div className="col" key={dbType}>
              <div
                className="card db-card h-100"
                onClick={() => handleCardClick(dbType)}
              >
                <div className="card-body text-center">
                  <i
                    className={`bi ${
                      dbType === "graphdb"
                        ? "bi-diagram-3 text-primary"
                        : dbType === "postgres"
                        ? "bi-database text-info"
                        : dbType === "aws-rds"
                        ? "bi-cloud text-warning"
                        : "bi-tsunami text-success"
                    } fs-1`}
                  />
                  <h5 className="card-title mt-3">
                    {dbType.replace("-", " ").toUpperCase()}
                  </h5>
                  <p className="card-text">
                    {dbType === "graphdb" &&
                      "Connect to a SPARQL endpoint for semantic queries on your graph database."}
                    {dbType === "postgres" &&
                      "Connect to your PostgreSQL database for SQL-based queries."}
                    {dbType === "aws-rds" &&
                      "Connect to an Amazon RDS instance for managed database access."}
                    {dbType === "aws-neptune" &&
                      "Connect to Amazon Neptune for graph database queries."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedForm === "aws-rds" && (
          <div className="mt-5 p-4 rounded shadow">
            <div className="row align-items-center mb-4">
              <div className="col-md-3 text-center">
                <i className="bi bi-cloud text-warning fs-1"></i>
              </div>
              <div className="col-md-9">
                <h3>AWS RDS Connection</h3>
                <p>Enter the details to connect to your Amazon RDS instance.</p>
              </div>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, selectedForm)}>
              <input type="hidden" name="db_type" value="aws-rds" />
              <div className="mb-3">
                <label className="form-label">RDS Endpoint</label>
                <input
                  type="text"
                  className="form-control"
                  name="endpoint"
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Port</label>
                  <input
                    type="number"
                    className="form-control"
                    name="port"
                    defaultValue="5432"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Database Engine</label>
                  <select className="form-select" name="engine" required>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mariadb">MariaDB</option>
                    <option value="sqlserver">SQL Server</option>
                    <option value="oracle">Oracle</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Database Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="database"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Master Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Master Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedForm === "aws-neptune" && (
          <div className="mt-5 p-4 rounded shadow">
            <div className="row align-items-center mb-4">
              <div className="col-md-3 text-center">
                <i class="bi bi-tsunami text-success fs-1"></i>
              </div>
              <div className="col-md-9">
                <h3>AWS Neptune Connection</h3>
                <p>
                  Enter the details to connect to your Amazon Neptune graph
                  database.
                </p>
              </div>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, selectedForm)}>
              <input type="hidden" name="db_type" value="aws-neptune" />
              <div className="mb-3">
                <label className="form-label">Neptune Endpoint</label>
                <input
                  type="text"
                  className="form-control"
                  name="endpoint"
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Port</label>
                  <input
                    type="number"
                    className="form-control"
                    name="port"
                    defaultValue="8182"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Query Language</label>
                  <select
                    className="form-select"
                    name="query_language"
                    required
                  >
                    <option value="sparql">SPARQL</option>
                    <option value="gremlin">Gremlin</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  IAM Role ARN (if using IAM auth)
                </label>
                <input type="text" className="form-control" name="iam_role" />
              </div>
              <div className="mb-3">
                <label className="form-label">AWS Region</label>
                <input
                  type="text"
                  className="form-control"
                  name="region"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        )}
        {selectedForm === "postgres" && (
          <div className="mt-5 p-4 rounded shadow">
            <div className="row align-items-center mb-4">
              <div className="col-md-3 text-center">
                <i class="bi bi-database text-info fs-1"></i>
              </div>
              <div className="col-md-9">
                <h3>PostgreSQL Connection</h3>
                <p>Enter the details to connect to your PostgreSQL database.</p>
              </div>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, selectedForm)}>
              <input type="hidden" name="db_type" value="postgres" />
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Host</label>
                  <input
                    type="text"
                    className="form-control"
                    name="host"
                    placeholder="localhost or IP address"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Port</label>
                  <input
                    type="number"
                    className="form-control"
                    name="port"
                    defaultValue="5432"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Database Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="database"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        )}
        {selectedForm === "graphdb" && (
          <div className="mt-5 p-4 rounded shadow">
            <div className="row align-items-center mb-4">
              <div className="col-md-3 text-center">
                <i className="bi bi-diagram-3 text-primary fs-1"></i>
              </div>
              <div className="col-md-9">
                <h3>GraphDB Connection</h3>
                <p>
                  Enter the details to connect to your GraphDB SPARQL endpoint.
                </p>
              </div>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, selectedForm)}>
              <input type="hidden" name="db_type" value="graphdb" />
              <div className="mb-3">
                <label className="form-label">SPARQL Endpoint URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="endpoint"
                  placeholder="https://example.com/sparql"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username if required"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password (Optional)</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password if required"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Default Graph (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="default_graph"
                  placeholder="Default graph name"
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p>
            © 2025 Power System Database Assistant. Built with LangGraph and
            Language Model technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
