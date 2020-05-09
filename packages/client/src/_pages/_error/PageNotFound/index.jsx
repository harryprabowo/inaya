import React from "react";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faMeh,
  faHandPaper,
  faSurprise,
  faBan,
  faExclamationCircle,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";

const PageNotFound = (props) => {
  const handleGoBack = (e) => {
    props.history.goBack();
  };

  return (
    <div style={{ margin: "auto", textAlign: "center", minHeight: "75vh", writingMode: "vertical-rl" }}>
      <h4 style={{ fontWeight: 400, fontSize: "92pt", opacity: 0.35, margin: 0, marginRight: "1em" }}>
        <b>4</b><FontAwesomeIcon icon={faCompass} size="sm" /><b>4</b>
      </h4>
      <p style={{ fontSize: "24pt", opacity: 0.75 }}>
        <FontAwesomeIcon icon={faMeh} /> <FontAwesomeIcon icon={faHandPaper} />{" "}
        <FontAwesomeIcon icon={faSurprise} /> <FontAwesomeIcon icon={faBan} />{" "}
        <FontAwesomeIcon icon={faExclamationCircle} />{" "}
      </p>
      <br />
      <Button variant="link" size="lg" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faArrowCircleLeft} size="5x" />
      </Button>
    </div>
  );
};

export default PageNotFound;
