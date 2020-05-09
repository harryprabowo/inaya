import React, { useEffect, useState } from "react";
import {
  useRouteMatch,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import {
  dateHelper as d,
  Prototype,
  urlParamHelper as url
} from "~/_helpers";
import { facilityService } from "~/_services";
import { isNullOrUndefined } from "util"
import { v1 as uuid } from "uuid"

import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCog } from "@fortawesome/free-solid-svg-icons";

import ReactTooltip from "react-tooltip";
import { Table } from "~/_components";
import Map, { MapTooltip } from "~/_components/Map"

import Manager from "./Manager";
import Register from "./Register"

import "./style.scss";

const FacilityTable = ({ facilityData, updateFacilityData, ...props }) => {
  let location = useLocation()

  const fetchFacilityData = async () => {
    updateFacilityData()

    facilityService.fetchMyFacilities()
      .then((data) => {
        updateFacilityData(data)
      })
      .catch((err) => {
        updateFacilityData(null)
        props.setAlert(err)
      });
  };


  useEffect(() => {
    fetchFacilityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "image",
      text: "Facility",
      sort: true,
      classes: "facility-img",
      formatter: (e) => <Image src={e} fluid rounded />,
      hidden: true
    },
    {
      dataField: "id",
      text: "#",
      sort: true,
      hidden: true,
    },
    {
      dataField: "name",
      text: "Facility",
      headerStyle: {
        width: "40%"
      },
      sort: true,
    },
    {
      dataField: "date",
      text: "Created",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
    {
      dataField: "lastUpdated",
      text: "Updated",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "",
      headerStyle: {
        width: "15%"
      },
      formatter: (cell, row) => {
        const handleClick = (_e) => {
          _e.stopPropagation();
          props.history.push(`/facility/manage?id=${row.id}`);
        };

        return (
          <div className="table-action">
            <Button data-tip data-for="table-action" variant="light" onClick={handleClick}>
              <FontAwesomeIcon icon={faCog} />
            </Button>
            <ReactTooltip id="table-action" effect="solid">
              Manage facility
            </ReactTooltip>
          </div>
        )
      }
    },
  ]

  return (
    <Table
      data={facilityData}
      columns={columns}
      rowClasses="facility-row"
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
      headerBtn={
        [
          {
            value: (
              <FontAwesomeIcon icon={faPlus} data-tip />
            ),
            path: `/facility/create?id=${uuid()}`,
            tooltip: "Register a facility",
            history: props.history,
            state: {
              background: location
            }
          }
        ]
      }
      withAction={{
        path: "facility",
        propToPass: ["id"],
        history: props.history,
      }}
    />
  );
};

const FacilityPage = (props) => {
  let location = useLocation();
  let query = url.useQuery();

  const id = parseInt(query.get("id"));

  const [facilityData, updateFacilityData] = useState();
  const [selectedData, setSelectedData] = useState()
  const [point, setPoint] = useState([])


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSelectedData(location.state && location.state.data)
  })

  useEffect(() => {
    if (!isNullOrUndefined(facilityData) && !isNullOrUndefined(id) && isNullOrUndefined(selectedData)) {
      setSelectedData(facilityData.find(data => data.id === id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityData])

  useEffect(() => {
    setPoint(isNullOrUndefined(selectedData)
      ? []
      : [
        new Prototype.Marker(
          selectedData.position,
          selectedData.name,
          <MapTooltip data={selectedData} />
        )
      ])
  }, [selectedData])

  return (
    <div id="facility">
      <h3>Dashboard</h3>
      <hr style={{ marginBottom: 0 }} />
      <br />
      <Row>
        <Col>
          <h5>List of facilities</h5>
          <br />
          <FacilityTable facilityData={facilityData} updateFacilityData={updateFacilityData} {...props} />
        </Col>
        <Col xs={0} md={6}>
          <h5>Detail</h5>
          <br />
          <Card className="map-container">
            <Map points={point} {...props} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Facility = (props) => {
  let location = useLocation();

  const { path } = useRouteMatch();
  const background = location.state && location.state.background;

  const back = (e) => {
    if (!isNullOrUndefined(e)) e.stopPropagation();
    props.history.goBack();
  };

  return (
    <>
      <Switch location={background || location}>
        <Route path={`${path}/create`} children={<Register full={true} {...props} />} />
        <Route path={`${path}/manage`} children={<Manager {...props} />} />
        <Route exact path={path} children={<FacilityPage {...props} />} />
      </Switch>
      {
        background && (
          <Route
            path={`${path}/create`}
            children={
              <Modal show={true} backdrop="static" size="lg" onHide={(e) => back(e)} centered>
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    New Facility
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body
                  className="wrapper"
                  style={{ padding: 0, height: "60vh" }}
                >
                  <div className="scrollable-children">
                    <Register {...props} />
                  </div>
                </Modal.Body>
              </Modal>
            }
          />
        )
      }
    </>
  );
};

export default Facility;
