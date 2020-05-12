import React from "react";
import { Redirect } from "react-router";

import { isNullOrUndefined } from "util";

import { Row, Col } from "react-bootstrap";

import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDharmachakra } from "@fortawesome/free-solid-svg-icons";

const Home = (props) => {
  if (!isNullOrUndefined(props.currentUser)) {
    const redirecRoleToPage = [undefined, "/", "/facility", "/droppoint"]

    return <Redirect to={redirecRoleToPage[props.currentUser.RoleId]} />
  }
  return (
    <div className="main">
      <Row>
        <Col className="banner">
          <h6>
            <FontAwesomeIcon icon={faDharmachakra} /> INAYA
          </h6>
          <h1>
            Help shall reach <br />
            those who needs.
          </h1>
        </Col>
        <Col></Col>
      </Row>
    </div>
  )
};

export default Home;
