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
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Skills from "views/examples/Skills.js";
import Projets from "views/examples/Projets.js";
import ConfirmEmail from "./views/examples/ConfirmEmail";
import EditProfile from "./views/examples/EditProfile";
import UsersTable from "./views/examples/UsersTable";
import ResetPassword from "./views/examples/ResetPassword";
import ConfirmPassword from "./views/examples/ConfirmPassword";
import ResetPasswordSuccess from "./views/examples/ResetPasswordSuccess";
import TeamCard from "views/examples/TeamCard.js"
import Evaluation from "views/examples/Evaluation";
import ProjectDetails from "views/examples/ProjectDetails";
import EvaluationFormCard from "views/examples/EvaluationFormCard";
import UserProfileDetail from "views/examples/UserProfileDetail";
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
    api: false
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    api: true
  },
 


// Define the route for the evaluation form
{
  path: "/evaluation/:id",
  name: "EvaluationForm",
  component: Evaluation,
  hidden: true
},
{
  path: "projectdetails/:projectId",
  name: "projectdetails",
  component: ProjectDetails,
  hidden: true
},
{
  path: "UserProfileDetail/:userId",
  name: "UserProfileDetail",
  component: UserProfileDetail,
  hidden: true
},
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
    api: false
  },
  {
    path: "/EvaluationFormCard",
    name: "EvaluationFormCard",
    icon: "ni ni-bullet-list-67 text-red",
    component: EvaluationFormCard,
    layout: "/admin",
    api: false
  },
  {
    path: "/skills",
    name: "Skills",
    icon: "ni ni-bullet-list-67 text-red",
    component: Skills,
    layout: "/admin",
    api: false
  },
  {
    path: "/projets",
    name: "Projets",
    icon: "ni ni-bullet-list-67 text-red",
    component: Projets,
    layout: "/admin",
    api: false
  },
  {
    path: "/TeamCard",
    name: "TeamCard",
    icon: "ni ni-bullet-list-67 text-red",
    component: TeamCard,
    layout: "/admin",
    api: false
  },
 
  
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    api: true
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    api: true
  },
  {
    path: "/confirm-email/:id",
    name: "Confirm Email",
    icon: "ni ni-check-bold text-green",
    component: ConfirmEmail,
    layout: "/auth",
    api: true
  },
  
  {
    path: "/edit-profile",
    name: "Edit Profile",
    icon: "ni ni-ruler-pencil text-info",
    component: EditProfile,
    layout: "/admin",
    api: true
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-folder-17 text-pink",
    component: UsersTable,
    layout: "/admin",
    api: true
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPassword,
    layout: "/auth",
    api: true
  },
  {
    path: "/confirm-password/:id",
    name: "Confirm Password",
    icon: "ni ni-folder-17 text-pink",
    component: ConfirmPassword,
    layout: "/auth",
    api: true
  },
  {
    path: "/reset-success",
    name: "Password Reset Confirmed",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPasswordSuccess,
    layout: "/auth",
    api: false
  }
];
export default routes;
