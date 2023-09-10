import React, { useEffect, useState } from "react";

import Chart from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import { chartOptions, parseOptions, } from "variables/charts.js";
import Header from "components/Headers/Header.js";
import { getAll } from "network/ApiAxios"; // Replace with the correct import path
import { getProjets } from "network/ApiAxios";

const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [projets, setProjets] = useState([]);
  const storeDataInLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  useEffect(() => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }

    const cachedUserData = getDataFromLocalStorage("userData");
    const cachedChartData = getDataFromLocalStorage("chartData");

    if (cachedUserData && cachedChartData) {
      setUserData(cachedUserData);
      setChartData(cachedChartData);
    } else {
      fetchAllUsers();
    }
  }, []);
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data(chartExample1Data === "data1" ? "data2" : "data1");
  };

  const fetchAllUsers = async () => {
    try {
      const response = await getAll();
      const { data } = response;
      console.log("data", data);
      if (data.success) {
        console.log("Users:", data.users);
        setUserData(data.users);
        generateSkillDistribution(data.users);
        storeDataInLocalStorage("userData", data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const generateSkillDistribution = (users) => {
    console.log("Users:", users); // Check if userData is populated

    const allSkills = users.flatMap((user) =>
      user.skills.map((skill) => skill.label)
    );
    console.log("AllSkills:", allSkills); // Check if allSkills array is populated

    const skillCountMap = allSkills.reduce((countMap, skill) => {
      countMap[skill] = (countMap[skill] || 0) + 1;
      return countMap;
    }, {});
    console.log("SkillCountMap:", skillCountMap); // Check if skillCountMap is generated correctly

    const sortedSkills = Object.keys(skillCountMap).sort(
      (a, b) => skillCountMap[b] - skillCountMap[a]
    );

    const labels = sortedSkills; // Use the skill labels as labels
    const data = sortedSkills.map((skill) => skillCountMap[skill]); // Use the skill counts as data
    const datasets = sortedSkills.map((skill) => ({
      label: skill,
      data: [skillCountMap[skill]],
      backgroundColor: generateRandomColor(),
    }));

    const chartData = {
      labels: ["Number of Users"],
      datasets: datasets,
    };

    setChartData(chartData);
  
  };

  const generateRandomColor = () => {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Return the color in RGB format
    return `rgb(${r}, ${g}, ${b})`;
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProjets();
        setProjets(response.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    }
    fetchData();
  }, []);

  const getStatusCounts = () => {
    const counts = {
      'In Progress': 0,
      'On Hold': 0,
      Finished: 0,
    };

    projets.forEach((projet) => {
      counts[projet.selectedstatus]++;
    });

    return Object.values(counts);
  };

  const statusLabels = ['In Progress', 'On Hold', 'Finished'];
  const statusCounts = getStatusCounts();

  const data = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Customize the colors here
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="4">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Skill Distribution
                    </h6>
                    <h2 className="mb-0">Skills</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  {console.log("ChartData:", chartData)}{" "}
                  {/* Add this line for debugging */}
                  {chartData.labels && chartData.datasets ? (
                    <Bar
                      data={chartData}
                      options={{
                        indexAxis: "x",
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                        plugins: {
                          title: {
                            display: true,
                            text: "Number of Users",
                            font: {
                              size: 16,
                              weight: "bold",
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Project Status</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Render the chart only if projectData is available */}
                {projets &&  (
                  <div className="chart">
                    <Pie data={data  } options={{ responsive: true }} />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Page visits</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Page name</th>
                    <th scope="col">Visitors</th>
                    <th scope="col">Unique users</th>
                    <th scope="col">Bounce rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">/argon/</th>
                    <td>4,569</td>
                    <td>340</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/index.html</th>
                    <td>3,985</td>
                    <td>319</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/charts.html</th>
                    <td>3,513</td>
                    <td>294</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      36,49%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/tables.html</th>
                    <td>2,050</td>
                    <td>147</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/profile.html</th>
                    <td>1,795</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
