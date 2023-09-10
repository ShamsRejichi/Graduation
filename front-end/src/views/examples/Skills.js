/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useState, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";
import { addSkill } from "network/ApiAxios";
import { getSkills } from "network/ApiAxios";
import { deleteSkill } from "network/ApiAxios";
const skillIcons = {
  JavaScript: "fab fa-js",
  React: "fab fa-react",
  "Node.js": "fab fa-node-js",
  CSS: "fab fa-css3",
  Angular: "fab fa-angular",
  Python : "fab fa-python",
  // and so on...
};

const Skills = () => {
  const [data, setData] = useState([]);
  const [columnName, setColumnName] = useState("Skill");

  const handleAddRow = async () => {
    const newSkill = prompt("Enter skill:");
    const response = await addSkill(newSkill, "Débutant");
    setData([...data, response.data]);
  };

  function getSkillColor(skillName) {
    switch (skillName) {
      case "JavaScript":
        return "yellow";
      case "React":
        return "lightblue";
      case "Node.js":
        return "green";
      case "CSS":
        return "blue";
      case "Angular":
        return "Red";
        case "Python":
        return "Dark blue";
      default:
        return "black";
        

    }
  }

  const handleDelete = async (id) => {
    try {
      const deletedSkill = await deleteSkill(id);
      setData(data.filter((skill) => skill._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getSkills();
      setData(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Card Skills</h3>
                <div className="col text-right">
                  <a
                    href="#pablo"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddRow}
                  >
                    Add Skill
                  </a>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>{columnName}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((skill) => (
                    <tr key={skill._id}>
                      <td>
                        <i
                          className={skillIcons[skill.label]}
                          style={{ color: getSkillColor(skill.label) }}
                        ></i>{" "}
                        {skill.label}
                      </td>
                      <td>
                        <div className="col text-right">
                          {" "}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(skill._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="..."></nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        
      </Container>
    </>
  );
};

export default Skills;
