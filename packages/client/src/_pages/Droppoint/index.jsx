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
import shortid from "shortid"
import { isNullOrUndefined } from "util"
import { droppointService } from "~/_services";

import { Row, Col, Card, Image, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components";
import Map, { MapTooltip } from "~/_components/Map"

import Register from "./Register"

import "./style.scss";

const DroppointTable = ({ droppointData, updateDroppointData, ...props }) => {
  let location = useLocation()

  const fetchDroppointData = async () => {
    updateDroppointData()

    droppointService.fetchMyDroppoints()
      .then((data) => {
        updateDroppointData(data)
      })
      .catch((err) => {
        updateDroppointData(null)
        props.setAlert(err)
      });
  };

  useEffect(() => {
    fetchDroppointData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "image",
      text: "Drop Point",
      sort: true,
      classes: "droppoint-img",
      formatter: (e) => <Image src={e} fluid rounded />,
      hidden: true
    },
    {
      dataField: "id",
      text: "#",
      sort: true,
      headerStyle: {
        width: "10%"
      },
      hidden: true,
    },
    {
      dataField: "name",
      text: "Drop Point",
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
  ]

  return (
    <Table
      data={droppointData}
      columns={columns}
      rowClasses="droppoint-row"
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
            value: <FontAwesomeIcon icon={faPlus} />,
            path: `/droppoint/create?f=${shortid.generate()}`,
            tooltip: "Create new drop point",
            history: props.history,
            state: {
              background: location
            }
          }
        ]
      }
      withAction={{
        path: "droppoint",
        propToPass: ["id"],
        history: props.history
      }}
    />
  );
};

const DroppointPage = (props) => {
  let location = useLocation();
  let query = url.useQuery();

  const id = parseInt(query.get("id"));

  const [droppointData, updateDroppointData] = useState();
  const [selectedData, setSelectedData] = useState()
  const [point, setPoint] = useState([])


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSelectedData(location.state && location.state.data)
  })

  useEffect(() => {
    if (!isNullOrUndefined(droppointData) && !isNullOrUndefined(id) && isNullOrUndefined(selectedData)) {
      setSelectedData(droppointData.find(data => data.id === id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droppointData])

  useEffect(() => {
    setPoint(isNullOrUndefined(selectedData)
      ? []
      : [
        new Prototype.Marker(
          selectedData.id,
          selectedData.position,
          selectedData.name,
          <MapTooltip data={selectedData} />
        )
      ])
  }, [selectedData])

  return (
    <div id="droppoint">
      <h3>Dashboard</h3>
      <hr style={{ marginBottom: 0 }} />
      <br />
      <Row>
        <Col>
          <h5>List of drop points</h5>
          <br />
          <DroppointTable droppointData={droppointData} updateDroppointData={updateDroppointData} {...props} />
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

const Droppoint = (props) => {
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
        <Route exact path={path} children={<DroppointPage {...props} />} />
      </Switch>
      {
        background && (
          <Route
            path={`${path}/create`}
            children={
              <Modal show={true} size="lg" backdrop="static" onHide={(e) => back(e)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Register New Droppoint
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                  <Register {...props} />
                </Modal.Body>
              </Modal>
            }
          />
        )
      }
    </>
  );
};

export default Droppoint;
