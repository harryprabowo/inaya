import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";

import {
  dateHelper as d,
} from "~/_helpers";
import shortid from "shortid"
import { isNullOrUndefined } from "util";
import { requestService } from "~/_services";

import { Row, Col, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components"
import Detail from "./Detail";
import Create from "./Create";

import "./style.scss";

const RequestTable = ({ requestData, updateRequestData, ...props }) => {
  let location = useLocation();
  let history = useHistory()

  const fetchRequestData = async () => {
    updateRequestData()

    requestService.fetchMyRequests()
      .then((data) => {
        updateRequestData(data)
      })
      .catch((err) => {
        updateRequestData(null)
      });
  };

  useEffect(() => {
    fetchRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "Request ID",
      sort: true,
      formatter: (e) => <span style={{ opacity: 0.5 }}>#{e}</span>
    },
    {
      dataField: "droppoint",
      text: "Drop Point",
      sort: true,
      classes: "droppoint-link",
      formatter: (e) => {
        const handleClick = (_e) => {
          _e.stopPropagation();
          history.push(`/droppoint?id=${e.id}`);
        };

        return (
          <Button variant="link" onClick={handleClick}>
            <span style={{ opacity: 0.75 }}>#</span><strong>{e.id}</strong>
          </Button>
        );
      },
    },
    {
      dataField: "date",
      text: "Created",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
    {
      dataField: "lastUpdated",
      text: "Last Modified",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
  ]

  return (
    <div id="request">
      <Row>
        <Col md={1} lg={2} />
        <Col>
          <br />
          <h3>Your Requests</h3>
          <br />
          <Table
            data={requestData}
            columns={columns}
            defaultSorted={[
              {
                dataField: "lastUpdated",
                order: "desc",
              },
              {
                dataField: "date",
                order: "desc",
              },
            ]}
            rowClasses="request-row"
            headerBtn={
              [
                {
                  value: <FontAwesomeIcon icon={faPlus} size="sm" />,
                  path: `/request/create?f=${shortid.generate()}`,
                  tooltip: "Create new request",
                  history,
                  state: {
                    background: location
                  }
                }
              ]
            }
            withAction={{
              path: "request",
              propToPass: "id",
              history,
              state: {
                background: location
              }
            }}
          />
        </Col>
        <Col md={1} lg={2} />
      </Row>
    </div>
  );
};

const Request = (props) => {
  let location = useLocation();

  const { path } = useRouteMatch();
  const background = location.state && location.state.background;

  const [requestData, updateRequestData] = useState();

  const back = (e) => {
    if (!isNullOrUndefined(e)) e.stopPropagation();
    props.history.goBack();
  };

  return (
    <>
      <Switch location={background || location}>
        <Route path={`${path}/create`} children={<Create full={true} {...props} />} />
        <Route path={`${path}/:id`} children={<Detail full={true} {...props} />} />
        <Route
          exact
          path={path}
          children={
            <RequestTable
              requestData={requestData}
              updateRequestData={updateRequestData}
            />
          }
        />
      </Switch>
      {
        background && (
          <Switch>
            <Route
              path={`${path}/create`}
              children={
                <Modal show={true} backdrop="static" onHide={(e) => back(e)} size="lg" centered>
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Create New Request
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    className="wrapper"
                    style={{ padding: 0, height: "60vh" }}
                  >
                    <div className="scrollable-children">
                      <Create {...props} />
                    </div>
                  </Modal.Body>
                </Modal>
              }
            />
            <Route
              path={`${path}/:id`}
              children={
                <Modal show={true} onHide={(e) => back(e)} size="xl" centered>
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Request Detail
                </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    className="wrapper"
                    style={{ padding: 0, height: "60vh" }}
                  >
                    <div className="scrollable-children">
                      <Detail {...props} />
                    </div>
                  </Modal.Body>
                </Modal>
              }
            />
          </Switch>
        )
      }
    </>
  );
};

export default Request;
