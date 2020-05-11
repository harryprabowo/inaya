import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import {
  dateHelper as d, Enum,
} from "~/_helpers";
import { isNull, isUndefined, isNullOrUndefined } from "util";
import { requestService } from "~/_services";

import { Row, Col, Badge, Button, Modal, Table as BootstrapTable, Image, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faRoute } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components"

const Detail = ({ full = false, ...props }) => {
  let location = useLocation();
  const { id } = useParams();

  const [requestDetail, updateRequestDetail] = useState();
  const [requestLines, updateRequestLines] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [showItemDetail, setShowItemDetail] = useState(false);

  const fetchRequestDetail = async (requestId) => {
    updateRequestDetail();

    if (!full) {
      updateRequestDetail(location.state.data)

      requestService.fetchRequestDetail(requestId)
        .then(({ requestLines }) => {
          updateRequestLines(requestLines)
        })
        .catch((err) => {
          updateRequestLines(null)
          props.setAlert(err)
        });
    } else {
      requestService.fetchRequestDetail(requestId)
        .then(({ request, requestLines }) => {
          updateRequestDetail(request)
          updateRequestLines(requestLines)
        })
        .catch((err) => {
          updateRequestDetail(null)
          updateRequestLines(null)
          props.setAlert(err)
        });
    }
  };

  useEffect(() => {
    fetchRequestDetail(id);

    if (!isNullOrUndefined(location.state) && !isNullOrUndefined(location.state.unavailable_items) && location.state.unavailable_items.length > 0) {
      props.setAlert(new Error("Some items are unavailable"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "Request Line",
      formatter: (e) => <span style={{ opacity: 0.5 }}>#{e}</span>
    },
    {
      dataField: "item.name",
      text: "Item",
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
      text: "Last Updated",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: (e) => (
        <Badge pill variant={Enum.getRequestLineVariant(e)}>
          {/* {Enum.requestStatus[e]} */}
          {e}
        </Badge >
      ),
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "",
      formatter: (cell, row) => {
        const handleClick = (_e) => {
          _e.stopPropagation();

          if (isNullOrUndefined(row.shipment.id)) {
            const err = new Error("Shipment not found")
            err.variant = "danger"
            props.setAlert(err)
          } else if (row.shipment.id === -1) {
            props.setAlert(new Error("Request line is being processed by the system"))
          } else {
            props.history.push(`/shipment?id=${row.shipment.id}&facility=${row.facility.id}`);
          }
        };

        if (Enum.getRequestLineStatus(row.status) === 1) {
          return (
            <div className="table-action">
              <Button variant="info" onClick={handleClick}>
                <FontAwesomeIcon icon={faRoute} size="lg" />
              </Button>
            </div>
          )
        } else return null
      }
    }
  ]

  const handleShowItemDetail = ({ item, quantity }) => {
    setShowItemDetail(true)

    setSelectedItem({
      "ID": item.id,
      "Name": item.name,
      "Description": item.description,
      "Quantity": quantity,
      image: item.image
    })
  }

  return (
    <div className="pages">
      <Row>
        {full ? <Col lg={1} /> : null}
        <Col>
          {full ? (
            <>
              <h3>Request Details</h3>
              <hr style={{ marginBottom: 0 }} />
              <br />

            </>
          ) : null}
          <h5>Overview</h5>
          <br />
          <Card id="detail-container">
            <Card.Body>
              {isUndefined(requestDetail) ? (
                <div style={{ textAlign: "center" }}>
                  <FontAwesomeIcon icon={faSpinner} size="lg" spin />
                </div>
              ) : isNull(requestDetail) ? null : (
                <Row style={{ alignItems: 'center' }}>
                  <Col xs={12} md={6} xl={3}>
                    <span>Request ID </span>
                    <h6>{requestDetail.id}</h6>
                  </Col>
                  <Col xs={12} md={6} xl={3}>
                    <span>Drop Point </span>
                    <Link to={`/droppoint?id=${requestDetail.droppoint.id}`}>
                      <h6>
                        <span style={{ opacity: 0.75 }}>#</span><strong>{requestDetail.droppoint.id}</strong>
                      </h6>
                    </Link>
                  </Col>
                  <Col xs={12} md={6} xl={3}>
                    <span>Created On </span>
                    <h6> {d.getShortDate(requestDetail.date)}</h6>
                  </Col>
                  <Col xs={12} md={6} xl={3}>
                    <span>Last Updated </span>
                    <h6> {d.getShortDate(requestDetail.lastUpdated)}</h6>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <br />

          <h5>Request Lines</h5>
          <br />
          <Table
            data={requestLines}
            columns={columns}
            rowClasses="requestline-row"
            withAction={handleShowItemDetail}
          />
        </Col>
        {full ? <Col lg={1} /> : null}
      </Row>

      <Modal
        backdropClassName="layer"
        show={showItemDetail}
        onHide={setShowItemDetail}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Item Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {isNullOrUndefined(selectedItem) ? null : isNullOrUndefined(selectedItem.image) ? null : (
              <Col xs={4} style={{ alignSelf: 'center' }}>
                <Image src={selectedItem.image} fluid rounded style={{ objectFit: 'cover', height: '10em' }} />
              </Col>
            )}
            <Col>
              <BootstrapTable responsive borderless>
                <tbody>
                  {isNullOrUndefined(selectedItem)
                    ? null
                    : Object.entries(selectedItem)
                      .filter(([k, _]) => k !== 'image')
                      .map(([k, v], i) => (
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
                            {v}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </BootstrapTable>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Detail;
