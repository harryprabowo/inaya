import React from "react";

import { Row, Col } from "react-bootstrap";

import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDharmachakra } from "@fortawesome/free-solid-svg-icons";

const Home = (props) => {
  return (
    <div className="main">
      <Row>
        <Col className="banner">
          <h6>
            <FontAwesomeIcon icon={faDharmachakra} /> INAYA
          </h6>
          <h1>
            Help shall reach <br />
            those who needs. {process.env.REACT_APP_API_URL}
          </h1>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
};

export default Home;
