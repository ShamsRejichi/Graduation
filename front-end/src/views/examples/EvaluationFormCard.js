import React, { useState, useEffect } from "react";
import { Container, Button, Modal, Nav } from "react-bootstrap";
import { Card, CardHeader, Row, Table } from "reactstrap";
import Header from "components/Headers/Header.js";
import "./EvaluationFormCard.css";
import {
  getAll,
  getEvaluations,
  updateEvaluation,
  addScoreAndSendEmail,
} from "network/ApiAxios";
import { sendEvaluationEmail } from "network/ApiAxios";
const EvaluationFormCard = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [answer, setAnswer] = useState("");

  const [activeTab, setActiveTab] = useState([]);
  const [evaluationPopupData, setEvaluationPopupData] = useState(null);
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);
  const [Evalutions, setEvaluations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTablePopup, setShowTablePopup] = useState(false); // Track whether the table popup should be displayed
  const [scoreValues, setScoreValues] = useState({
    savoirFaire: 0,
    codeQuality: 0,
    discipline: 0,
    investissement: 0,
    autonomie: 0,
  });

  const handleScoreChange = (field, value) => {
    setScoreValues((prevState) => ({
      ...prevState,
      [field]: parseInt(value),
    }));
  };

  const handleShowResults = () => {
    setShowEvaluationPopup(false); // Close the evaluation popup
    setShowTablePopup(true); // Show the table popup
  };

  const handleCloseTablePopup = () => {
    setShowTablePopup(false); // Hide the table popup
    setShowEvaluationPopup(true); // Show the evaluation data popup
  };

  const handleEvaluationPopup = (userId) => {
    console.log("handleEvaluationPopup called with userId:", userId);
    const selectedUser = users.find((user) => user._id === userId);
    if (selectedUser) {
      const evaluationData = Evalutions.find(
        (evaluation) => evaluation.user === userId
      );
      console.log("evaluationData:", evaluationData);
      if (evaluationData) {
        setEvaluationPopupData({
          ...evaluationData,
          user: userId,
        });
        setShowEvaluationPopup(true);
        console.log(setShowEvaluationPopup);
      }
    }
  };

  const handleCloseEvaluationPopup = () => {
    setShowEvaluationPopup(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Perform search logic here (e.g., filter users based on search term)
    // Update the pendingUsers or submittedUsers state accordingly
  };
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const sendEvaluationEmails = async (userIds) => {
    try {
      // Iterate over the selected user IDs and send evaluation emails
      for (const userId of userIds) {
        await sendEvaluationEmail(userId);
        console.log(
          `Evaluation email sent successfully to user with ID: ${userId}`
        );
      }

      // Perform any additional actions on success
    } catch (error) {
      console.error("Failed to send evaluation emails", error);
      // Perform any additional actions on error
    }
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await getEvaluations(userId);
        const evaluationsData = response.data;
        setEvaluations(evaluationsData);
      } catch (error) {
        console.error(error);
        // Handle the error
      }
    };

    fetchEvaluations();
  }, [userId]);

  useEffect(() => {
    const runAsync = async () => {
      const response = await getAll();
      const { data } = response;
      console.log(data.users);
      if (data.success) {
        const currentDate = new Date();
        const ninetyDaysAgo = new Date().setDate(currentDate.getDate() - 90);
        const filteredUsers = data.users.filter(
          (user) =>
             new Date(user.date) < ninetyDaysAgo
        );
        setUsers(filteredUsers);
      }
    };
    runAsync();
  }, []);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSendMail = () => {
    sendEvaluationEmails(selectedUsers);
    handleClosePopup();
  };

  const handleCancel = () => {
    // Logic to cancel and go back
    handleClosePopup();
  };
  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  // Define the function to calculate the total score
  const calculateTotalScore = () => {
    const total = Object.values(scoreValues).reduce(
      (sum, value) => sum + value,
      0
    );
    return total;
  };

  const handleAnswerChange = (e, index) => {
    const { value } = e.target;
    setAnswerIndex(index);
    setAnswer(value);
  };
  const handleSubmitEvaluationForm = async (e) => {
    e.preventDefault();

    try {
      if (answerIndex !== null && answer !== "") {
        await updateEvaluation(evaluationPopupData._id, answerIndex, answer);
      }
      handleCloseEvaluationPopup();
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };
  const handleSave = () => {
    // Calculate the total score
    const totalScore = calculateTotalScore();

    // Update the score in the evaluation popup data
    setEvaluationPopupData((prevData) => ({
      ...prevData,
      score: totalScore,
    }));

    // Send the score to the backend and send the email
    addScoreAndSendEmail(
      evaluationPopupData.user,
      totalScore,
      evaluationPopupData._id
    )
      .then((response) => {
        console.log("Score added and email sent:", response);
        // Display success message or perform any desired actions
      })
      .catch((error) => {
        console.error("Error adding score and sending email:", error);
        // Display error message or handle the error accordingly
      });
  };

  return (
    <>
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Users</h3>
              </CardHeader>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link
                    eventKey="pending"
                    onSelect={() => setActiveTab("pending")}
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>Pending
                    Users
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="submitted"
                    onSelect={() => setActiveTab("submitted")}
                  >
                    <i className="fa fa-user" aria-hidden="true"></i> Submitted
                    Users
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div className="search-bar">
                <div className="search-bar-inner">
                  <i className="search-icon ni ni-zoom-split-in"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="search-input"
                  />
                </div>
                <Button
                  variant="primary"
                  className="search-button"
                  onClick={handleOpenPopup}
                >
                  Send Evaluation
                </Button>
              </div>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className="font-size-lg">
                      Email
                    </th>
                    {activeTab === "submitted" && (
                      <th scope="col" className="font-size-lg">
                        Date
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "pending" &&
                    users.map((user) => {
                      if (user.evaluations.length === 0) {
                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="mr-3">
                                  <img
                                    className="rounded-circle"
                                    src={`http://localhost:5100/uploads/${user.profilePicture}`}
                                    alt={user.name}
                                    style={{ width: "75px", height: "75px" }}
                                  />
                                </div>
                                <div className="font-size-lg">{user.email}</div>
                              </div>
                            </td>
                            {activeTab === "submitted" && <td></td>}
                          </tr>
                        );
                      }
                      return null;
                    })}

                  {activeTab === "submitted" &&
                    users.map((user) => {
                      if (user.evaluations.length > 0) {
                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="mr-3">
                                  <img
                                    className="rounded-circle"
                                    src={`http://localhost:5100/uploads/${user.profilePicture}`}
                                    alt={user.name}
                                    style={{ width: "75px", height: "75px" }}
                                  />
                                </div>
                                <div className="font-size-lg">{user.email}</div>
                              </div>
                            </td>
                            <td className="font-size-lg">
                              {user.evaluations[0].date}
                            </td>
                            <td>
                              <button
                                onClick={() => handleEvaluationPopup(user._id)}
                              >
                                <i
                                  className="fa fa-file"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Popup */}
      <Modal
        show={showPopup}
        className="custom-modal"
        onHide={handleClosePopup}
      >
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {users.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Email</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        className="d-flex mr-3 rounded-circle"
                        src={`http://localhost:5100/uploads/${user.profilePicture}`}
                        alt={user.name}
                        style={{ width: "75px", height: "75px" }}
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        id={`user-${user._id}`}
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>No users found.</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSendMail(selectedUsers)}
          >
            Send Mail
          </Button>
        </Modal.Footer>
      </Modal>
      {showEvaluationPopup && evaluationPopupData && (
        <div className="evaluation-overlay">
          <div className="evaluation-popup">
            <h2>Evaluation Details</h2>

            <a href="#" onClick={handleShowResults}>
              Resultat
            </a>
            <div className="question-wrapper">
              <p>
                Question: How satisfied are you with the quality of your work?
              </p>
              <p className="answer-line">
                <input
                  type="text"
                  placeholder={evaluationPopupData.answers[0]}
                  value={
                    answerIndex === 0 ? answer : evaluationPopupData.answers[0]
                  }
                  onChange={(e) => handleAnswerChange(e, 0)}
                />
              </p>
            </div>
            <div className="question-wrapper">
              <p>
                Question: How productive were you during this evaluation period?
              </p>
              <p className="answer-line">
                <input
                  type="text"
                  placeholder={evaluationPopupData.answers[1]}
                  value={
                    answerIndex === 1 ? answer : evaluationPopupData.answers[1]
                  }
                  onChange={(e) => handleAnswerChange(e, 1)}
                />
              </p>
            </div>
            {/* Add more questions and answers as needed */}

            <div className="button-container">
              <button
                className="evaluation-button"
                onClick={handleCloseEvaluationPopup}
              >
                Close
              </button>
              <button
                className="evaluation-button"
                type="button"
                onClick={handleSubmitEvaluationForm}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showTablePopup && (
        <div className="evaluation-overlay">
          <div className="table-popup">
            <div className="result-table">
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Score</th>
                  </tr>
                  <tr>
                    <th>Savoir faire</th>
                    <td>
                      <input
                        className="score-input"
                        type="range"
                        min="0"
                        max="5"
                        value={scoreValues.savoirFaire}
                        onChange={(e) =>
                          handleScoreChange("savoirFaire", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Code quality</th>
                    <td>
                      <input
                        className="score-input"
                        type="range"
                        min="0"
                        max="5"
                        value={scoreValues.codeQuality}
                        onChange={(e) =>
                          handleScoreChange("codeQuality", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Discipline</th>
                    <td>
                      <input
                        className="score-input"
                        type="range"
                        min="0"
                        max="5"
                        value={scoreValues.discipline}
                        onChange={(e) =>
                          handleScoreChange("discipline", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Investissement dans l'entreprise</th>
                    <td>
                      <input
                        className="score-input"
                        type="range"
                        min="0"
                        max="5"
                        value={scoreValues.investissement}
                        onChange={(e) =>
                          handleScoreChange("investissement", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Autonomie</th>
                    <td>
                      <input
                        className="score-input"
                        type="range"
                        min="0"
                        max="5"
                        value={scoreValues.autonomie}
                        onChange={(e) =>
                          handleScoreChange("autonomie", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Final Score</th>
                    <td>{calculateTotalScore()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="button-container">
                <button
                  className="close-button"
                  onClick={handleCloseTablePopup}
                >
                  Close
                </button>
                <button
                  onClick={() => handleSave(evaluationPopupData.user._id)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationFormCard;
