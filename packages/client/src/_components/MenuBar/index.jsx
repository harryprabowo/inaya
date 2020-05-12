import React, { useEffect, useState } from "react";

import { isNullOrUndefined } from "util"
import { Prototype, dateHelper as d } from "~/_helpers";

import notificationService from "~/_services/notification.service";

import {
  Navbar,
  Nav,
  Button,
  NavDropdown,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDharmachakra,
  faBell,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import { routes } from "~/_pages";
import { Profile, Loading, PrivateComponent } from "~/_components";

import "./style.scss";

const MenuBar = ({ currentUser, ...props }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLoading, setShowLoading] = useState(false)
  const [notifications, updateNotifications] = useState([])

  const handleShowProfile = (val = !showProfile) => {
    setShowProfile(val);
    localStorage.setItem("profile.show", val);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setShowProfile(
      currentUser ? localStorage.getItem("profile.show") === "true" : false
    );
  });

  const { setAlert } = props

  useEffect(() => {
    let interval;

    if (!isNullOrUndefined(currentUser)) {
      interval = setInterval(() => {
        try {
          notificationService.fetchNotification()
            .then(res => updateNotifications(res || []))
        } catch (err) {
          setAlert(err)
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [currentUser, setAlert]);

  return (
    <>
      {showLoading ? <Loading cover /> : null}
      <Navbar bg="light" variant="light" sticky="top">
        <Nav.Link className="nav-brand" href="/">
          <h3 className="text-info" style={{ margin: 0 }}>
            <FontAwesomeIcon icon={faDharmachakra} size="lg" />
          </h3>
        </Nav.Link>
        <Nav className="mx-auto order-0 text-center">
          {currentUser
            ? routes
              .filter(
                ({ isMenu, role }) => isMenu && currentUser ? (isNullOrUndefined(role) || role.includes(currentUser.RoleId)) : false
              )
              .map(({ name, path, icon }) => new Prototype.Menu(name, path, icon))
              .map((menu, i) => (
                <LinkContainer
                  key={i}
                  exact={menu.path === "/"}
                  to={{
                    pathname: menu.path,
                    state: {
                      name: menu.name
                    }
                  }}
                >
                  <Button className="menu-btn" variant="light">
                    <FontAwesomeIcon size="lg" icon={menu.icon} />
                    <br />
                    <span>{menu.name}</span>
                  </Button>
                </LinkContainer>
              ))
            : null}
        </Nav>

        <Nav>
          {currentUser ? (
            <NavDropdown
              id="notification-dropdown"
              title={<FontAwesomeIcon icon={faBell} size="lg" />}
              alignRight
            >
              <h6 style={{ textAlign: "center" }}>Notifications</h6>
              <hr style={{ margin: 0 }} />
              {notifications.length === 0 ? (
                <NavDropdown.Item as="button" disabled style={{ textAlign: "center" }}>
                  Nothing for now
                </NavDropdown.Item>
              ) : notifications.map((notif, i) => (
                <NavDropdown.Item key={i} as="button">
                  <Row>
                    <Col>
                      {notif.message}
                    </Col>
                    <Col>
                      {d.isSameDay(new Date(), notif.time) ? d.getTimeString(notif.time) : d.getShortDate(notif.time)}
                    </Col>
                  </Row>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ) : null}

          <Dropdown as={ButtonGroup} alignRight>
            {currentUser ? (
              <Button
                variant="outline-info"
                className="profile-btn"
                size="sm"
                onClick={() => handleShowProfile()}
              >
                <FontAwesomeIcon icon={faUserCircle} />{" "}
                <span>{currentUser.username}</span>
              </Button>
            ) : (
                <LinkContainer to={{ pathname: "/login", state: { from: props.location } }} style={{ margin: 0 }}>
                  <Button variant="outline-info">Login</Button>
                </LinkContainer>
              )}

            <Dropdown.Toggle split variant="info" className="menu-dropdown" />

            <Dropdown.Menu>
              {currentUser ? null : (
                <>
                  <LinkContainer to="/register" active={false}>
                    <Dropdown.Item as="button">Register</Dropdown.Item>
                  </LinkContainer>
                  <Dropdown.Divider />
                </>
              )}
              <LinkContainer to="/about" active={false}>
                <Dropdown.Item as="button">About</Dropdown.Item>
              </LinkContainer>
              <LinkContainer to="/help" active={false}>
                <Dropdown.Item as="button">Help</Dropdown.Item>
              </LinkContainer>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      {showProfile ? (
        <PrivateComponent
          component={Profile}
          show={showProfile}
          setShow={handleShowProfile}
          setShowLoading={setShowLoading}
          currentUser={currentUser}
          {...props}
        />
      ) : null}
    </>
  );

};

export default MenuBar;
