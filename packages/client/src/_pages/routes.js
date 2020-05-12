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
  new Route("Register", "/register", Register, undefined, 0),
  new Route("Login", "/login", Login, undefined, 0),

  // Public pages
  new Route(undefined, "/404", PageNotFound, undefined, 0),
  new Route(undefined, "/", Home, undefined, 0),
  new Route("About", "/about", About, undefined, 0),
  new Route("Help", "/help", Help, undefined, 0),

  // Private pages
  new Route("Droppoints", "/droppoint", Droppoint, faMapMarkedAlt, 1, [1, 3]),
  new Route("Requests", "/request", Request, faBullhorn, 1, [1, 3]),
  new Route("Facilities", "/facility", Facility, faMapMarkedAlt, 1, [1, 2]),
  new Route("Request Lines", "/requestlines", RequestLines, faBullhorn, 1, [1, 2]),
  new Route("Shipment", "/shipment", Shipment, faTruck, 1, [1, 2, 3], 0),
];

export default routes;
