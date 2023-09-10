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
import { Route, Switch, Redirect, Link } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import Evaluation from "views/examples/Evaluation";
import ProjectDetails from "views/examples/ProjectDetails";
import UserProfileDetail from "views/examples/UserProfileDetail";
import "./Admin.css";
import Projets from "views/examples/Projets";


class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = () => {
  const currentPath = this.props.location.pathname;
  const breadcrumbClass = "breadcrumb-text"; // CSS class for the breadcrumb
  for (let i = 0; i < routes.length; i++) {
    if (
      currentPath.indexOf(routes[i].layout + routes[i].path) !== -1 &&
      routes[i].name
    ) {
      return <span className={breadcrumbClass}>{routes[i].name}</span>;
    }
  }
  const breadcrumbRoutes = [
    {
      path: "/admin/projets",
      name: "Projets"
    },
    {
      path: "/admin/projectdetails",
      name: "Project Details",
      dynamic: true
    },
    {
      path: "/admin/UserProfileDetail",
      name: "User Profile Detail",
      dynamic: true
    }
  ];

  const linkElements = [];

  // Render the "Projets" link
  linkElements.push(
    <div className={breadcrumbClass} key={`projets-${Projets.id}`}>
      <Link to="/admin/projets">Projets</Link>
    </div>
  );
  


  // Find the matching breadcrumb routes for the current path
  const matchingRoutes = breadcrumbRoutes.filter(route =>
    currentPath.startsWith(route.path)
  );

  // Render the remaining breadcrumb links
  matchingRoutes.forEach((route, index) => {
    const dynamicPath = currentPath.substring(route.path.length + 1);
    const linkKey = index === matchingRoutes.length - 1 ? dynamicPath : route.path;

    if (route.dynamic && route.path === "/admin/UserProfileDetail") {
      // Add the "Project Details" link
      linkElements.push(
        <Link
          to={`/admin/projectdetails/${dynamicPath}`}
          className={breadcrumbClass}
          key={`projectdetails-${dynamicPath}`}
        >
          Project Details
        </Link>
      );
    }

    // Add the current route link
    linkElements.push(
      <span className={breadcrumbClass} key={linkKey}>
        {route.name}
      </span>
    );

    // Render the separator between breadcrumb links
    if (index !== matchingRoutes.length - 1) {
      linkElements.push(
        <span className={breadcrumbClass} key={`separator-${index}`}>
          &gt;
        </span>
      );
    }
  });

  return linkElements;
};


  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/mobelite.png").default,
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            <Route path="/admin/evaluation/:id" component={Evaluation} />
            <Route
              path="/admin/projectdetails/:projectId"
              component={ProjectDetails}
            />
            <Route
              path="/admin/UserProfileDetail/:userId"
              component={UserProfileDetail}
            />

            {this.getRoutes(routes)}
            <Redirect from="*" to="/admin/index" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
