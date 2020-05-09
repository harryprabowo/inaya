import { Prototype } from "~/_helpers";
import {
  About,
  Droppoint,
  Facility,
  Help,
  Home,
  Login,
  Register,
  Request,
  RequestLines,
  PageNotFound,
  Shipment,
} from ".";

import {
  faBullhorn,
  faTruck,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";

const Route = Prototype.PageRoute;

// Prototype.Route(name, path, component, icon, isPrivate, role, isMenu)
const routes = [
  // Portal pages
  new Route("Register", "/register", Register, null, 0),
  new Route("Login", "/login", Login, null, 0),

  // Public pages
  new Route(undefined, "/404", PageNotFound, null, 0),
  new Route("Home", "/", Home, null, 0),
  new Route("About", "/about", About, null, 0),
  new Route("Help", "/help", Help, null, 0),

  // Private pages
  new Route("Droppoints", "/droppoint", Droppoint, faMapMarkedAlt, 1, [1, 3]),
  new Route("Requests", "/request", Request, faBullhorn, 1, [1, 3]),
  new Route("Facilities", "/facility", Facility, faMapMarkedAlt, 1, [1, 2]),
  new Route("Lines", "/requestlines", RequestLines, faBullhorn, 1, [1, 2]),
  new Route("Shipments", "/shipment", Shipment, faTruck, 1, [1, 2, 3], 0),
];

export default routes;
