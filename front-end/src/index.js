
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter,Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AuthRoutes from "./components/PrivateRoute/AuthRoutes";
import Evaluation from "views/examples/Evaluation";
import ProjectDetails from "views/examples/ProjectDetails";
import UserProfileDetail from "views/examples/UserProfileDetail";
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/admin" component={AdminLayout} />
      <AuthRoutes path="/auth" component={AuthLayout} />
      <Route path="/admin/evaluation" component={Evaluation} />
      <Route path="/admin/projectdetails/:projectId" component={ProjectDetails} />
      <Route path="/admin/UserProfileDetail/:userId" component={UserProfileDetail} />

      <Redirect from="/" to="/admin/index" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
