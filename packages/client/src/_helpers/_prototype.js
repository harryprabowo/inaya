import argsValidator from "~/_helpers/args-validator.helper"

const { throwIfMissing, throwIfNotType, throwIfNotInstance } = argsValidator

export class PageRoute {
  constructor(
    name,
    path = throwIfMissing(),
    component = throwIfMissing(),
    icon,
    isPrivate = false,
    role,
    isMenu = isPrivate
  ) {
    this.name = name;
    this.path = path;
    this.component = component;
    this.icon = icon;
    this.isPrivate = isPrivate;
    this.role = role;
    this.isMenu = isMenu;
  }
}

export class Menu {
  constructor(name, path = throwIfMissing(), icon) {
    this.name = name;
    this.path = path;
    this.icon = icon;
  }
}

export class Position {
  constructor(long = throwIfMissing(), lat = throwIfMissing()) {
    this.long = throwIfNotType(long, "number");
    this.lat = throwIfNotType(lat, "number");
  }

  getPosition() {
    return [this.long, this.lat];
  }

  getUrlParams() {
    return `?long=${this.long}&lat=${this.lat}`;
  }
}

export class Point {
  constructor(name, position = throwIfMissing(), message) {
    this.name = name;
    this.position = throwIfNotInstance(position, Position);
    this.message = message || name;
  }
}

export class Route {
  constructor(name, path = throwIfMissing(), color) {
    this.name = name;
    this.path = path;
    this.color = color;
  }
}

export class Marker {
  constructor(id = throwIfMissing(), position = throwIfMissing(), tooltip, message) {
    this.id = id
    this.position = [throwIfNotType(position.lat, "number"), throwIfNotType(position.long, "number")];
    this.tooltip = tooltip;
    this.message = message;
  }
}

export class Request {
  constructor(id = throwIfMissing(), droppoint, date, lastUpdated) {
    this.id = id;
    this.droppoint = throwIfNotInstance(droppoint, Droppoint);
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
  }
}

export class RequestLine {
  constructor(id = throwIfMissing(), request, item, quantity, shipment, facility, status, date, lastUpdated) {
    this.id = id;
    this.request = throwIfNotInstance(request, Request);
    this.item = throwIfNotInstance(item, Item);
    this.quantity = throwIfNotType(quantity, "number");
    this.shipment = throwIfNotInstance(shipment, Shipment);
    this.facility = throwIfNotInstance(facility, Facility);
    this.status = status;
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
  }
}

export class Shipment {
  constructor(
    id = throwIfMissing(),
    requestline,
    droppoint,
    facility,
    status,
    route,
    ETA,
    date,
    lastUpdated
  ) {
    this.id = id;
    this.requestline = throwIfNotInstance(requestline, RequestLine);
    this.droppoint = throwIfNotInstance(droppoint, Droppoint);
    this.facility = throwIfNotInstance(facility, Facility);
    this.status = status;
    this.route = route;
    this.ETA = throwIfNotInstance(ETA, Date);
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
  }
}

export class Droppoint {
  constructor(id = throwIfMissing(), name, position, date, lastUpdated, image) {
    this.id = id;
    this.name = name;
    this.position = throwIfNotInstance(position, Position);
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
    this.image = image;
  }
}

export class Facility {
  constructor(id = throwIfMissing(), name, position, date, lastUpdated, image) {
    this.id = id;
    this.name = name;
    this.position = throwIfNotInstance(position, Position);
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
    this.image = image;
  }
}

export class Item {
  constructor(id = throwIfMissing(), name, date, lastUpdated, description, image) {
    this.id = id;
    this.name = name;
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
    this.description = description;
    this.image = image;
  }
}

export class Schedule {
  constructor(id = throwIfMissing(), facility, hour, date, lastUpdated) {
    this.id = id;
    this.facility = throwIfNotInstance(facility, Facility);
    this.hour = throwIfNotType(hour, "number");
    this.date = throwIfNotInstance(date, Date);
    this.lastUpdated = throwIfNotInstance(lastUpdated, Date);
  }
}

export default {
  PageRoute,
  Menu,

  Position,
  Point,
  Route,
  Marker,

  Request,
  RequestLine,
  Shipment,
  Droppoint,
  Facility,
  Item,
  Schedule
};
