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
import React, { useEffect, useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components

import EditHeader from "../../components/Headers/EditHeader";
import { edit, getSkills } from "../../network/ApiAxios";

const EditProfile = (props) => {
  let user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(user.country);
  const [postalcode, setPostalcode] = useState(user.postalcode);
  const [isTestUser, setIsTestUser] = useState(false);
  const [skills, setSelectedSkills] = useState(user.skills);
  const [dbSkills, setSkills] = useState([]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).email === "test@test.com") {
      setIsTestUser(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await getSkills();
      setSkills(response.data);
    }
    fetchData();
  }, []);

  const editUser = async () => {
    const response = await edit(
      user._id,
      name,
      email,
      address,
      city,
      country,
      postalcode,
      skills
    );
    const { data } = response;
    if (data.success) {
      user = {
        ...user,
        name,
        email,
        address,
        city,
        country,
        postalcode,
        skills,
      };
      localStorage.setItem("user", JSON.stringify(user));
      props.history.push("/admin/user-profile");
    }
  };

  const handleSkillChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(
          dbSkills.find((skill) => skill._id === options[i].value)
        );
        options[i].selected = false;
        options[i].disabled = true;
      }
    }
    setSelectedSkills([...skills, ...selectedValues]);
  };

  return (
    <>
      <EditHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                    {isTestUser ? (
                      <h5>
                        You are not allowed to edit the test user. Create
                        another user to test this functionality
                      </h5>
                    ) : null}
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={editUser}
                      size="sm"
                      disabled={isTestUser}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={name}
                            id="input-username"
                            placeholder="Username"
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-address"
                            value={address}
                            placeholder="Home Address"
                            onChange={(e) => setAddress(e.target.value)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-city"
                            value={city}
                            placeholder="City"
                            onChange={(e) => setCity(e.target.value)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-country"
                            value={country}
                            placeholder="Country"
                            onChange={(e) => setCountry(e.target.value)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-postal-code"
                            value={postalcode}
                            placeholder="Postal code"
                            onChange={(e) => setPostalcode(e.target.value)}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Skills
                          </label>
                          <div className="dropdown">
                            <select
                              id="input-skills-select"
                              className="form-control-alternative dropdown-toggle"
                              value={skills}
                              onChange={handleSkillChange}
                            >
                              <option value="">Select a skill</option>
                              {dbSkills.map((skill) => (
                                <option key={skill._id} value={skill._id}>
                                  {skill.label}
                                </option>
                              ))}
                              <option value="" disabled hidden></option>
                            </select>
                          </div>

                          {skills.map((selectedSkill, index) => (
                            <div key={index} className="d-flex">
                              <Input
                                className="form-control-alternative flex-grow-1"
                                id={`input-skills-${index}`}
                                value={selectedSkill.label}
                                placeholder={index === 0 ? "Select skills" : ""}
                                readOnly
                                multiple
                              />
                            </div>
                          ))}
                        </FormGroup>
                      </Col>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default EditProfile;
