import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  getProjectDirectors,
  getAll,
  updateProject,
  getManagers,
  getProjets,
} from "network/ApiAxios";
import { useParams, Link } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { Container } from "react-bootstrap";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const [showDetails, setShowDetails] = useState(false); // Initialize showDetails state

  const history = useHistory();
  const [ProjectDirector, setProjectDirector] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [managers, setManagers] = useState([]);

  const { projectId } = useParams();
  

  const [currentProject, setCurrentProject] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Inside the useEffect hook, filter the users to get the available users
  useEffect(() => {
    const filteredUsers = users.filter(
      (user) =>
        !selectedUsers.some((selectedUser) => selectedUser.userId === user._id)
    );
    setAvailableUsers(filteredUsers);
  }, [users, selectedUsers]);


  useEffect(() => {
    async function fetchAllProjects() {
      try {
        const response = await getProjets();
        const { data } = response;

        const project = data.find((proj) => proj._id === String(projectId));
        if (project) {
          setCurrentProject(project);
          console.log("Current Project:", project);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllProjects();
  }, [projectId]);

  const handleCardClick = (userId) => {
    window.location.hash = `#${userId}`;
    const user = users.find((user) => user._id === userId);
    setSelectedUsers(userId);
    setShowDetails(true);

    history.push(`/admin/UserProfileDetail/${userId}`);
  };

  useEffect(() => {
    async function fetchProjectDirectors() {
      const response = await getProjectDirectors();
      setProjectDirector(response.data.users);
    }
    fetchProjectDirectors();
  }, []);

  useEffect(() => {
    async function fetchManagers() {
      const response = await getManagers();
      setManagers(response.data.users);
    }
    fetchManagers();
  }, []);

  useEffect(() => {
    async function fetchAllUsers() {
      const response = await getAll();
      const { data } = response;
      if (data.success) {
        setUsers(data.users);
      }
    }
    fetchAllUsers();
  }, []);

  const handleUserSelect = (userId, percentage) => {
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers.filter(
        (selectedUser) => selectedUser.userId !== userId
      ),
      {
        userId,
        percentage,
      },
    ]);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((selectedUser) => selectedUser.userId !== userId)
    );
  };

  

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleSave = async () => {
    try {
      const updatedProject = await updateProject(currentProject._id, {
        users: selectedUsers,
      });
      setCurrentProject(updatedProject);
      setShowPopup(false);
      window.location.reload(); // Reload the page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <div className="breadcrumb">
          <Link to="/admin/projets">Projets</Link> / Project Details
        </div>
        <div className="content">
          <div className="container">
            <div className="row">
              {currentProject && (
                <div className="col-lg-8">
                  <div className="card-box task-detail">
                    <div className="media mt-0 m-b-30">
                      <img
                        className="d-flex mr-3 rounded-circle"
                        alt="64x64"
                        src={`http://localhost:5100/uploads/${
                          ProjectDirector.find(
                            (projectDirector) =>
                              projectDirector._id ===
                              currentProject?.projectDirector
                          )?.profilePicture
                        }`}
                        style={{ width: "48px", height: "48px" }}
                      />
                      <div className="media-body">
                        <span
                          value={currentProject.projectDirector}
                          onChange={(e) => {
                            const selectedDirectorId = e.target.value;
                            setCurrentProject((prevProject) => ({
                              ...prevProject,
                              projectDirector: selectedDirectorId,
                            }));
                          }}
                        >
                          {ProjectDirector.map((projectDirector) => (
                            <option
                              key={projectDirector._id}
                              value={projectDirector._id.toString()}
                            >
                              {projectDirector.name}
                            </option>
                          ))}
                        </span>
                        <span>
                          {ProjectDirector.map((projectDirector) => (
                            <option
                              key={projectDirector._id}
                              value={projectDirector._id.toString()}
                            >
                              {projectDirector.role}
                            </option>
                          ))}
                        </span>

                        <span className="badge badge-danger">
                          {currentProject.selectedstatus}
                        </span>
                      </div>
                    </div>
                    <h4 className="m-b-20">{currentProject.label}</h4>
                    <p className="text-muted">{currentProject.description}</p>
                    <p className="text-muted"></p>
                    <ul className="list-inline task-dates m-b-0 mt-5">
                      <li>
                        <h5 className="m-b-5">Start Date</h5>
                        <p>{currentProject.Date}</p>
                      </li>
                    </ul>
                    <div className="clearfix"></div>
                    <div className="task-tags mt-4">
                      <h5 className="">Tags</h5>
                      <div className="bootstrap-tagsinput">
                        <span className="tag label label-info">
                          Amsterdam<span data-role="remove"></span>
                        </span>{" "}
                        <span className="tag label label-info">
                          Washington<span data-role="remove"></span>
                        </span>{" "}
                        <span className="tag label label-info">
                          Sydney<span data-role="remove"></span>
                        </span>
                      </div>
                    </div>

                    <div className="assign-team mt-4">
                      <h5 className="m-b-5">Assign to:</h5>
                      <div className="row">
                        {currentProject.users.map((user) => (
                          <div key={user._id} className="user-avatar">
                            <div
                              className="avatar-container"
                              onClick={() => handleCardClick(user._id)}
                            >
                              <img
                                className="d-flex mr-3 rounded-circle"
                                src={`http://localhost:5100/uploads/${user.profilePicture}`}
                                alt={user.name}
                                style={{ width: "75px", height: "75px" }}
                              />
                              <div className="name-overlay">
                                <span className="name">{user.name}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <a href="#" onClick={() => setShowPopup(true)}>
                            <span className="add-new-plus">
                              <i className="fa fa-plus"></i>
                            </span>
                          </a>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                    </div>

                    {showPopup && (
                      <div className="user-select-popup">
                        <div className="user-select-popup-inner">
                          <h3>Select Users</h3>
                          <ul>
                            {users
                              .filter(
                                (user) =>
                                  !currentProject.users.some(
                                    (u) => u._id === user._id
                                  )
                              )
                              .map((user) => (
                                <li key={user._id}>
                                  <div className="user-select-popup-avatar">
                                    <img
                                      src={`http://localhost:5100/uploads/${user.profilePicture}`}
                                      alt={user.name}
                                    />
                                  </div>
                                  <div className="user-select-popup-details">
                                    <input
                                      type="checkbox"
                                      id={`user-${user._id}`}
                                      checked={selectedUsers.some(
                                        (selectedUser) =>
                                          selectedUser.userId === user._id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          handleUserSelect(user._id, 0);
                                        } else {
                                          handleUserRemove(user._id);
                                        }
                                      }}
                                    />
                                    <label htmlFor={`user-${user._id}`}>
                                      {user.name}
                                    </label>
                                    {selectedUsers.some(
                                      (selectedUser) =>
                                        selectedUser.userId === user._id
                                    ) && (
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                          selectedUsers.find(
                                            (selectedUser) =>
                                              selectedUser.userId === user._id
                                          ).percentage
                                        }
                                        onChange={(e) =>
                                          handleUserSelect(
                                            user._id,
                                            parseInt(e.target.value)
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <div className="user-select-popup-buttons">
                            <button onClick={handlePopupClose}>Close</button>
                            <button onClick={handleSave}>Save</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProjectDetails;
