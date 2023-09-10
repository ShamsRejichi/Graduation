import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import "./projets.css";

import {

  useHistory,

} from "react-router-dom";

import Header from "components/Headers/Header.js";
import { getProjets } from "network/ApiAxios";
import { getManagers } from "network/ApiAxios";
import { getProjectDirectors } from "network/ApiAxios";
import { addProjet } from "network/ApiAxios";
import { deleteProjet } from "network/ApiAxios";
import { updateProjet } from "network/ApiAxios";

const Projets = () => {
  const [showCreateProjet, setShowCreateProjet] = useState(false);
  const [ProjectName, setProjectName] = useState("");
  const [Description, setDescription] = useState("");
  const [ClientName, setClientName] = useState("");
  const [Date, setDate] = useState("");
  const [ProjectDirector, setProjectDirector] = useState([]);
  const [selectedProjectDirector, setSelectedProjectDirector] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedstatus, setSelectedstatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [projets, setProjets] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [data, setData] = useState([]);

  const history = useHistory();
  useEffect(() => {
    async function fetchProjectDirectors() {
      const response = await getProjectDirectors();
      setProjectDirector(response.data.users);
    }
    fetchProjectDirectors();
  }, []);

  const handleProjectDirectorChange = (e) => {
    const projectDirectorId = e.target.value;
    setSelectedProjectDirector(projectDirectorId);

    const selectedProjectDirector = ProjectDirector.find(
      (projectDirector) => projectDirector._id === projectDirectorId
    );

    if (selectedProjectDirector) {
      const selectedProjectDirectorLabel = selectedProjectDirector.name;
      console.log(
        "Selected Project Director Label: ",
        selectedProjectDirectorLabel
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getProjets();
      setProjets(response.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchManagers() {
      const response = await getManagers();
      setManagers(response.data.users);
    }
    fetchManagers();
  }, []);

  const handleManagerChange = (e) => {
    const selectedManagerId = e.target.value; // Get the selected manager ID from event target
    setSelectedManager(selectedManagerId); // Update the state with the selected manager ID

    // Find the manager object that matches the selected manager ID
    const selectedManager = managers.find(
      (manager) => manager._id === selectedManagerId
    );

    if (selectedManager) {
      const selectedManagerLabel = selectedManager.name; // Access the name property of the selected manager object
      // Do something with the selected manager label
      console.log("Selected Manager Label: ", selectedManagerLabel);
    }
  };

  const handleCreateProjet = async () => {
    const response = await addProjet(
      ProjectName,
      Description,
      ClientName,
      Date,
      selectedProjectDirector,
      selectedManager,
      selectedstatus,
      progress
    );
    window.location.reload();
  };

  const handleStatusChange = (event) => {
    setSelectedstatus(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteProjet(id);
      setData(data.filter((project) => project._id !== id));
      window.location.reload(); // reload the page
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (projectId) => {
    const project = projets.find((proj) => proj._id === projectId);
    setSelectedstatus(project.selectedstatus);
    setProgress(project.progress);
    setCurrentProject(project);
    setShowEditProject(true);
  };

  const handleCloseModal = () => {
    setShowEditProject(false);
  };
  const handleSave = async () => {
    try {
      await updateProjet(currentProject._id, { selectedstatus, progress });
      const updatedProject = { ...currentProject, selectedstatus, progress };
      console.log("After update:", updatedProject);
      setProjets(
        projets.map((proj) =>
          proj._id === currentProject._id ? updatedProject : proj
        )
      );
      setCurrentProject(updatedProject);

      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };
  const handleCardClick = (projectId) => {
    window.location.hash = `#${projectId}`;
    const project = projets.find((proj) => proj._id === projectId);
    setSelectedProject(projectId);
    setShowDetails(true);

    history.push(`/admin/projectdetails/${projectId}`);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    window.history.pushState(null, null, "#");
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <div className="teams-container">{/* Display list of teams */}</div>
        {showCreateProjet && (
          <div className="modal">
            <div className="modal-content">
              <label className="modal-label" htmlFor="ProjectName">
                Project Name:
              </label>
              <input
                className="modal-input"
                type="text"
                id="ProjectName"
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <label className="modal-label" htmlFor="Description">
                Description:
              </label>
              <input
                className="modal-input"
                type="text"
                id="Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label className="modal-label" htmlFor="ClientName">
                Client Name:
              </label>
              <input
                className="modal-input"
                type="text"
                id="ClientName"
                value={ClientName}
                onChange={(e) => setClientName(e.target.value)}
              />

              <input
                className="modal-input"
                type="date"
                id="Date"
                value={Date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="modal-select"
                id="ProjectDirector"
                value={selectedProjectDirector}
                onChange={handleProjectDirectorChange}
              >
                <option value="">Select Project Director</option>
                {ProjectDirector.map((projectDirector) => (
                  <option
                    key={projectDirector._id}
                    value={projectDirector._id.toString()}
                  >
                    {projectDirector.name}
                  </option>
                ))}
                <option value="" disabled hidden></option>
              </select>

              <select
                className="modal-select"
                id="Manager"
                value={selectedManager}
                onChange={handleManagerChange}
              >
                <option value="">Select a Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id.toString()}>
                    {manager.name}
                  </option>
                ))}
                <option value="" disabled hidden></option>
              </select>

              <select
                className="modal-select"
                id="Status"
                value={selectedstatus}
                onChange={(e) => setSelectedstatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="On Hold">On Hold</option>
                <option value="In Progress">In Progress</option>
                <option value="Finished">Finished</option>
              </select>
              <label className="modal-label" htmlFor="Progress">
                Progress:
              </label>
              <input
                className="modal-input"
                type="range"
                id="Progress"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
              <button className="modal-btn" onClick={handleCreateProjet}>
                Create
              </button>
              <button onClick={() => setShowCreateProjet(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="container p-0">
          <a
            href="#"
            className="btn btn-primary float-right mt-n1"
            onClick={() => setShowCreateProjet(true)}
          >
            <i className="fas fa-plus"></i> New project
          </a>
          <h1 className="h3 mb-3">Projects</h1>

          <div className="row">
            {projets.map((project) => (
              <div className="col-12 col-md-6 col-lg-3" key={project._id}>
                <div className="card">
                  <div className="card-header px-4 pt-4">
                    <div className="card-actions float-right">
                      <div className="dropdown">
                        <button className="dropbtn">&#8942;</button>
                        <div className="dropdown-content">
                          <a
                            href="#"
                            onClick={(event) => {
                              handleEdit(project._id);
                            }}
                          >
                            Edit
                          </a>
                          {showEditProject && (
                            <div className="modal">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Edit Project
                                    </h5>
                                    <button
                                      type="button"
                                      className="close"
                                      onClick={handleCloseModal}
                                    >
                                      <span>&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    {/* form for editing project */}
                                    <Form>
                                      <Form.Group controlId="status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                          as="select"
                                          value={selectedstatus}
                                          onChange={handleStatusChange}
                                        >
                                          <option value="">
                                            Select status
                                          </option>
                                          <option value="On Hold">
                                            On Hold
                                          </option>
                                          <option value="In Progress">
                                            In Progress
                                          </option>
                                          <option value="Finished">
                                            Finished
                                          </option>
                                        </Form.Control>
                                      </Form.Group>
                                      <Form.Group controlId="progress">
                                        <Form.Label>Progress</Form.Label>
                                        <Form.Control
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={progress}
                                          onChange={handleProgressChange}
                                        />
                                        <Form.Label>{progress}%</Form.Label>
                                      </Form.Group>
                                    </Form>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={handleCloseModal}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleSave}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <a href="#" onClick={() => handleDelete(project._id)}>
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className="card-title mb-0">
                      <a href="#" onClick={() => handleCardClick(project._id)}>
                        {project.label}
                      </a>
                    </h5>
                    <div
                      className={`badge ${
                        project.selectedstatus === "Finished"
                          ? "bg-success"
                          : project.selectedstatus === "In Progress"
                          ? "bg-warning"
                          : "bg-danger"
                      } my-2`}
                    >
                      {project.selectedstatus}
                    </div>
                  </div>
                  <div className="card-body px-4 pt-2">
                    <p>{project.description}</p>

                    <img
                      src={`http://localhost:5100/uploads/${
                        managers.find(
                          (manager) => manager._id === project?.manager
                        )?.profilePicture
                      }`}
                      className="rounded-circle mr-1"
                      alt="Director Avatar"
                      width="50"
                      height="50"
                      title={
                        managers.find((pd) => pd._id === project?.manager)?.name
                      }
                    />

                    <img
                      src={`http://localhost:5100/uploads/${
                        ProjectDirector.find(
                          (projectDirector) =>
                            projectDirector._id === project?.projectDirector
                        )?.profilePicture
                      }`}
                      className="rounded-circle mr-1"
                      alt="Director Avatar"
                      width="50"
                      height="50"
                      title={
                        ProjectDirector.find(
                          (pd) => pd._id === project?.projectDirector
                        )?.name
                      }
                    />
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-4 pb-4">
                      <p className="mb-2 font-weight-bold">
                        Progress{" "}
                        <span className="float-right">{project.progress}%</span>
                      </p>
                      <div className="progress progress-sm">
                        <div
                          className={`progress-bar ${
                            project.status === "Finished"
                              ? "bg-success"
                              : project.status === "In Progress"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                          role="progressbar"
                          aria-valuenow={project.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                        
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Projets;
