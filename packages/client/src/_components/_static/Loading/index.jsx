import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDharmachakra } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

const Loading = ({ cover = false }) => (
  <div className={`overlay-bg${cover ? " cover" : ''}`}>
    <FontAwesomeIcon className="loading-icon" icon={faDharmachakra} />
  </div>
);

export default Loading;
