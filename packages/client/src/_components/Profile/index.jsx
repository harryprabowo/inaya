import React, { useState, useEffect } from "react";
import { isNullOrUndefined } from "util";
import { Enum, dateHelper as d } from "~/_helpers";

import { Table, Modal, Row, Col, Image } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

const Profile = ({ show, setShow, currentUser, ...props }) => {
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    if (!isNullOrUndefined(currentUser)) {
      setUserDetail({
        Username: currentUser.username,
        Email: currentUser.email,
        Role: Enum.role[currentUser.RoleId],
        "Joined Since": d.getDateString(new Date(currentUser.createdAt)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      id="profile-modal"
      show={show}
      onHide={() => setShow(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="wrapper">
            <div className="scrollable-children" style={{ padding: "2em" }}>
              <div style={{ textAlign: "center" }}>
                <Image
                  src="https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg"
                  roundedCircle
                  style={{ width: "5em" }}
                />
              </div>
              <br />
              <Table responsive>
                <tbody>
                  {isNullOrUndefined(userDetail)
                    ? null
                    : Object.entries(userDetail).map(([k, v], i) => (
                      <tr key={i}>
                        <td
                          style={{
                            fontSize: "8pt",
                            fontWeight: "bold",
                            verticalAlign: "middle",
                          }}
                        >
                          {k.toUpperCase()}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {isNullOrUndefined(v) ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              style={{ opacity: 0.75 }}
                            />
                          ) : (
                              v
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
