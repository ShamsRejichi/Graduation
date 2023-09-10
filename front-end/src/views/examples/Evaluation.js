import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { submitEvaluation,getAll } from "network/ApiAxios";
import Header from "components/Headers/Header.js";

import "./EvaluationForm.css";
const Evaluation = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    satisfaction: "",
    productivity: "",
    deadlines: "",
    technicalSkills: "",
    collaboration: "",
    problemSolving: "",
    support: "",
    adaptability: "",
    documentation: "",
    jobSatisfaction: "",
  });
  const { id } = useParams();
  const history = useHistory();
  const user = users.find((user) => user._id === id);
  const [submitted, setSubmitted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "satisfaction" || name === "productivity") {
      const selectedOption = e.target.options[e.target.selectedIndex].text;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedOption,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Check if the user is logged in (you can use your authentication logic here)
    const userLoggedIn = true; // Replace this with your actual authentication check

    setLoggedIn(userLoggedIn);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create the form data with the user ID
      const formDataWithId = {
        answers: [
          String(formData.satisfaction),
          String(formData.productivity),
          formData.deadlines,
          formData.technicalSkills,
          formData.collaboration,
          formData.problemSolving,
          formData.support,
          formData.adaptability,
          formData.documentation,
          formData.jobSatisfaction,
        ],
        userId: id,
      };

      // Submit the evaluation form
      const evaluation = await submitEvaluation(id, formDataWithId);

      // Update the user with the evaluation details
      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            evaluations: [
              ...user.evaluations,
              { id: evaluation._id, date: new Date() },
            ],
          };
        }
        return user;
      });

      // Set the submitted flag and update the users list
      setSubmitted(true);
      setUsers(updatedUsers);

      // Store the submitted status in local storage
      localStorage.setItem(`formSubmitted_${id}`, "true");
    } catch (error) {
      console.log(
        "Error occurred while submitting the evaluation form:",
        error
      );
    }
  };

  useEffect(() => {
    const isFormSubmitted = localStorage.getItem(`formSubmitted_${id}`);
    if (isFormSubmitted) {
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    // Remove the submitted status from local storage when the component unmounts
    return () => {
      localStorage.removeItem(`formSubmitted_${id}`);
    };
  }, []);

  const handleLogin = () => {
    // Redirect the user to the login page
    history.push("/http://localhost:3000/auth/login");
  };

  if (!loggedIn) {
    return (
      <div>
        <p>Please log in to access the evaluation form.</p>
        <button onClick={handleLogin}>Log In</button>
      </div>
    );
  }
  return (
    <>
      <Header />

      <div>
      {user && user.evaluations && user.evaluations.length !== 0 ? (
          <div className="thank-you">
            <h2>Thank You</h2>
            <p>Your information has been saved.</p>
            <p>The Evaluation form is no longer available .</p>
          </div>
        ) : (
          <div className="evaluation-form">
            <h1>Employee Evaluation Form</h1>
            <form onSubmit={handleSubmit}>
              <label>
                How satisfied are you with the quality of your work?
                <select
                  name="satisfaction"
                  value={formData.satisfaction}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Very Satisfied">Very Satisfied</option>
                  <option value="Satisfied">Satisfied</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Dissatisfied">Dissatisfied</option>
                  <option value="Very Dissatisfied">Very Dissatisfied</option>
                </select>
              </label>

              <label>
                How productive were you during this evaluation period?
                <select
                  name="productivity"
                  value={formData.productivity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Very Productive">Very Productive</option>
                  <option value="Productive">Productive</option>
                  <option value="Moderately Productive">
                    Moderately Productive
                  </option>
                  <option value="Less Productive">Less Productive</option>
                  <option value="Not Productive">Not Productive</option>
                </select>
              </label>

              <label>
                How well do you meet project deadlines?
                <input
                  type="number"
                  name="deadlines"
                  min="1"
                  max="5"
                  value={formData.deadlines}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Rate your technical skills and proficiency in programming
                languages:
                <input
                  type="number"
                  name="technicalSkills"
                  min="1"
                  max="5"
                  value={formData.technicalSkills}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                How well do you collaborate and communicate with team members?
                <input
                  type="number"
                  name="collaboration"
                  min="1"
                  max="5"
                  value={formData.collaboration}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Rate your problem-solving and troubleshooting abilities:
                <input
                  type="number"
                  name="problemSolving"
                  min="1"
                  max="5"
                  value={formData.problemSolving}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                How satisfied are you with the level of support and resources
                provided to you?
                <input
                  type="number"
                  name="support"
                  min="1"
                  max="5"
                  value={formData.support}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Rate your ability to adapt to new technologies and learn new
                concepts:
                <input
                  type="number"
                  name="adaptability"
                  min="1"
                  max="5"
                  value={formData.adaptability}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                How well do you document your code and processes?
                <input
                  type="number"
                  name="documentation"
                  min="1"
                  max="5"
                  value={formData.documentation}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Rate your overall job satisfaction and happiness in the company:
                <input
                  type="number"
                  name="jobSatisfaction"
                  min="1"
                  max="5"
                  value={formData.jobSatisfaction}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
export default Evaluation;
