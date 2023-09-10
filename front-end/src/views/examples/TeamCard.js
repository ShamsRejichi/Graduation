// reactstrap components

import React, { useEffect, useState } from "react";
import "./TeamCard.css";
import Header from "components/Headers/Header.js";

import { getManagers } from "network/ApiAxios";
import { createOrg } from "network/ApiAxios";
import { getTeams } from "network/ApiAxios";
import { getAll, deleteTeam, updateOrg } from "network/ApiAxios";
import Select from "react-select";

import {  Container } from "react-bootstrap";
const TeamCard = () => {
  const [teamName, setTeamName] = useState("");
  const [showCreateTeam, setShowCreateTeam] = useState(false);


  const [selectedOptions, setSelectedOptions] = useState();
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  const [teamDate, setTeamDate] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
 

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

  useEffect(() => {
    async function fetchTeams() {
      const response = await getTeams();
      setTeams(response.data);
    }
    fetchTeams();
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

    // Update the state with the selected manager ID
    setSelectedManager(selectedManagerId);

    // Find the manager object that matches the selected manager ID
    const selectedManager = managers.find(
      (manager) => manager._id === selectedManagerId
    );

    if (selectedManager) {
      const selectedManagerId = selectedManager._id; // Access the ID property of the selected manager object
      // Do something with the selected manager ID
      console.log("Selected Manager ID: ", selectedManagerId);
      // Send the selectedManagerId to the database or perform other operations
    }
  };

  const handleCreateTeam = async () => {
    const response = await createOrg(
      teamName,
      selectedManager,
      teamDate,
      teamDescription,
      selectedOptions
    );
    // Additional logic for creating the team

    window.location.reload();
  };

  const options = users.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  function handleSelect(data) {
    console.log(data); // Check the selected values in the console
    setSelectedOptions(data);
  }

  const handleUpdate = async (id) => {
    try {
      const orgData = {
        name: name,
        manager: selectedManager,
        description: description,
        users: selectedOptions.map((user) => user.value),
      };

      await updateOrg(id, orgData);
      // Update the state or perform any other necessary actions
      console.log("Organization updated successfully");
      window.location.reload();

    } catch (error) {
      console.error("Failed to update organization:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      setTeams(teams.filter((team) => team._id !== id));
      console.log(`Team with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting team with ID ${id}:`, error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <div className="container p-0">
          <a
            href="#"
            className="btn btn-primary float-right mt-n1"
            onClick={() => setShowCreateTeam(true)}
          >
            <i className="fas fa-plus"></i> New Team
          </a>
          {showCreateTeam && (
            <div className="modal">
              <div className="modal-content">
                <h3>Create New Team</h3>
                <label htmlFor="teamName">Team Name:</label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />

                <label htmlFor="teamDate">Date:</label>
                <input
                  type="date"
                  id="teamDate"
                  value={teamDate}
                  onChange={(e) => setTeamDate(e.target.value)}
                />

                <label htmlFor="teamDescription">Description:</label>
                <textarea
                  id="teamDescription"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                ></textarea>

                <label htmlFor="teamManager">Select Manager:</label>
                <select
                  id="teamManager"
                  value={selectedManager}
                  onChange={handleManagerChange}
                >
                  <option value="">Select a Manager</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="teamMembers">Select Team Members:</label>
                <Select
                  isMulti
                  name="teamMembers"
                  options={options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleSelect}
                  value={selectedOptions}
                />

                <button onClick={handleCreateTeam}>Create</button>
                <button onClick={() => setShowCreateTeam(false)}>Cancel</button>
              </div>
            </div>
          )}
          <div className="d-flex flex-wrap">
            {teams.map((team) => (
              <div
                key={team.id}
                className="container bootstrap snippets bootdey"
                style={{ marginLeft: "20px" }}
              >
                <div className="card">
                  <div className="card-header custom-bg">
                    <div className="panel-heading">
                      <h3>
                        <img
                          className="img-circle img-thumbnail"
                          src={`http://localhost:5100/uploads/${
                            managers.find(
                              (manager) => manager._id === team?.manager
                            )?.profilePicture
                          }`}
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          alt="Profile Picture"
                        />
                        <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                          {
                            managers.find(
                              (manager) => manager._id === team?.manager
                            )?.name
                          }
                        </span>
                        <div className="dropdown">
                          <button className="dropbtn">&#8942;</button>
                          <div className="dropdown-content">
                            <a
                              href="#"
                              onClick={(event) => {
                                togglePopup(team._id);
                              }}
                            >
                              Edit
                            </a>
                            {isOpen && (
                              <div className="team-popup-container">
                                <div className="team-popup-content">
                                  <h3>Update Team</h3>
                                  <label htmlFor="name">Name:</label>
                                  <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                  />
                                  <label htmlFor="description">
                                    Description:
                                  </label>
                                  <textarea
                                    id="description"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                  ></textarea>
                                  <label htmlFor="manager">Manager:</label>
                                  <select
                                    id="manager"
                                    value={selectedManager}
                                    onChange={handleManagerChange}
                                  >
                                    <option value="">Select a Manager</option>
                                    {managers.map((manager) => (
                                      <option
                                        key={manager._id}
                                        value={manager._id}
                                      >
                                        {manager.name}
                                      </option>
                                    ))}
                                  </select>
                                  <label htmlFor="users">Users:</label>
                                  <Select
                                    isMulti
                                    name="teamMembers"
                                    options={options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleSelect}
                                    value={selectedOptions}
                                  />

                                  <div className="team-popup-actions">
                                    <button
                                      onClick={() => handleUpdate(team._id)}
                                    >
                                      Submit
                                    </button>

                                    <button
                                      className="team-popup-close"
                                      onClick={togglePopup}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <a
                              href="#"
                              onClick={(event) => {
                                handleDelete(team._id);
                              }}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </h3>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="team padd">
                      <div className="container bootstrap snippets bootdey">
                        <div className="heading">
                          <h2>{team.name}</h2>
                          <h6>
                            {" "}
                            <span
                              style={{ fontSize: "24px", fontWeight: "bold" }}
                            >
                              {team.description}
                            </span>
                          </h6>
                          <div className="divider" />

                          <div className="divider" />
                        </div>
                        <br></br>
                        <div className="row">
                          {team.users.map((user) => (
                            <div className="col-md-3 col-sm-6" key={user._id}>
                              <div className="team-member">
                                <a href="#">
                                  <img
                                    src={`http://localhost:5100/uploads/${user.profilePicture}`}
                                    className="img-responsive"
                                    alt="Team-member"
                                  />
                                </a>
                                <div className="member-details">
                                  <h4>
                                    <a href="#">{user.name}</a>
                                  </h4>
                                  <span>{user.role}</span>
                                </div>
                                <div className="clearfix" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default TeamCard;
