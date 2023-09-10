

import React, { useState } from 'react';
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
    Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import {useHistory} from "react-router-dom";
import RoundImageInput from "./RoundImageInput";

const Profile = () => {
    const [userProfilePicture, setUserProfilePicture] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const history = useHistory();
    
    return (
        <>
            <UserHeader/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                  <RoundImageInput userProfilePicture={userProfilePicture} setUserProfilePicture={setUserProfilePicture} />
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                <div className="d-flex justify-content-between">
                                    <Button
                                        className="mr-4"
                                        color="info"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                        size="sm"
                                    >
                                        Connect
                                    </Button>
                                    <Button
                                        className="float-right"
                                        color="default"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                        size="sm"
                                    >
                                        Message
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading">22</span>
                                                <span className="description">Friends</span>
                                            </div>
                                            <div>
                                                <span className="heading">10</span>
                                                <span className="description">Photos</span>
                                            </div>
                                            <div>
                                                <span className="heading">89</span>
                                                <span className="description">Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>
                                        {user.name}
                                        <span className="font-weight-light">, </span>
                                    </h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                         {user.address}
                                         
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="ni business_briefcase-24 mr-2"/>
                                      
                                    </div>
                                    <div>
                                        <i className="ni education_hat mr-2"/>
                                       {user.role}
                                    </div>
                                    <hr className="my-4"/>
                                    <p>
                                        
                                    </p>
                                    <a href="#pablo" onClick={e => e.preventDefault()}>
                                        Show more
                                    </a>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">My account</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={() => history.push('/admin/edit-profile')}
                                            size="sm"
                                        >
                                            Settings
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
                                                        defaultValue={user.name}
                                                        id="input-username"
                                                        placeholder="Username"
                                                        type="text"
                                                        disabled
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
                                                        defaultValue={user.email}
                                                        type="email"
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {/*<Row>*/}
                                        {/*    <Col lg="6">*/}
                                        {/*        <FormGroup>*/}
                                        {/*            <label*/}
                                        {/*                className="form-control-label"*/}
                                        {/*                htmlFor="input-first-name"*/}
                                        {/*            >*/}
                                        {/*                First name*/}
                                        {/*            </label>*/}
                                        {/*            <Input*/}
                                        {/*                className="form-control-alternative"*/}
                                        {/*                defaultValue="Lucky"*/}
                                        {/*                id="input-first-name"*/}
                                        {/*                placeholder="First name"*/}
                                        {/*                type="text"*/}
                                        {/*            />*/}
                                        {/*        </FormGroup>*/}
                                        {/*    </Col>*/}
                                        {/*    <Col lg="6">*/}
                                        {/*        <FormGroup>*/}
                                        {/*            <label*/}
                                        {/*                className="form-control-label"*/}
                                        {/*                htmlFor="input-last-name"*/}
                                        {/*            >*/}
                                        {/*                Last name*/}
                                        {/*            </label>*/}
                                        {/*            <Input*/}
                                        {/*                className="form-control-alternative"*/}
                                        {/*                defaultValue="Jesse"*/}
                                        {/*                id="input-last-name"*/}
                                        {/*                placeholder="Last name"*/}
                                        {/*                type="text"*/}
                                        {/*            />*/}
                                        {/*        </FormGroup>*/}
                                        {/*    </Col>*/}
                                        {/*</Row>*/}
                                    </div>
                                    <hr className="my-4"/>
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
                                                        defaultValue={user.address}
                                                        id="input-address"
                                                        placeholder="Home Address"
                                                        type="text"
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                    <Row>
                                        <Col md="12">
                                                <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-skills">
                                                            Skills
                                                        </label>
                                                        {user.skills.map(skill => (
                                                             <Input
                                                             className="form-control-alternative"
                                                             defaultValue={skill.label}
                                                             id="input-skills"
                                                             placeholder="Skills"
                                                             type="text"
                                                             disabled
                                                             />
                                                        ))}
                                                       
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
                                                        defaultValue={user.city}
                                                        id="input-city"
                                                        placeholder="City"
                                                        type="text"
                                                        disabled
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
                                                        defaultValue={user.country}
                                                        id="input-country"
                                                        placeholder="Country"
                                                        type="text"
                                                        disabled
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
                                                        placeholder="Postal code"
                                                        defaultValue={user.postalcode}
                                                        type="number"
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                    <hr className="my-4"/>
                                    {/* Description */}
                                    <h6 className="heading-small text-muted mb-4">About me (placeholder)</h6>
                                    <div className="pl-lg-4">
                                        <FormGroup>
                                            <label>About Me</label>
                                            <Input
                                                className="form-control-alternative"
                                                placeholder="A few words about you ..."
                                                rows="4"
                                                defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source."
                                                type="textarea"
                                                disabled
                                            />
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Profile;
