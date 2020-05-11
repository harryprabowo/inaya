import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { isNullOrUndefined } from "util";
import {
  dateHelper as d,
  Enum,
} from "~/_helpers";
import {
  requestService,
  facilityService,
  itemService
} from "~/_services";

import { Row, Col, Badge, Button, Modal, Table as BootstrapTable, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components"

const RequestLines = (props) => {
  const { id } = useParams();

  const [requestLines, updateRequestLines] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [showItemDetail, setShowItemDetail] = useState(false);

  const fetchRequestLines = async (requestId) => {
    updateRequestLines([]);

    facilityService.fetchMyFacilities()
      .then(facilities => {
        facilities.forEach(facility => {
          requestService.fetchRequestLinesByFacility(facility.id)
            .then(data => {
              updateRequestLines(requestLines => [...requestLines, ...data])
            })
            .catch((err) => {
              props.setAlert(err)
            });
        })
      })
  };

  useEffect(() => {
    fetchRequestLines(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "Request Line",
      formatter: (e) => <span style={{ opacity: 0.5 }}>#{e}</span>
    },
    {
      dataField: "facility",
      text: "Facility",
      sort: true,
      classes: "facility-link",
      formatter: (e) => {
        const handleClick = (_e) => {
          _e.stopPropagation();
          props.history.push(`/facility?id=${e.id}`);
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
      text: "Last Updated",
      sort: true,
      formatter: (e) => d.getShortDate(e),
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: (e) => (
        <Badge pill variant={Enum.getRequestLineVariant(e)} >
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
        } else {
          return null
        }

      }
    }
  ]

  const handleShowItemDetail = ({ id, _item, quantity }) => {
    itemService.fetchItemByRequestLine(id)
      .then(item => {
        if (isNullOrUndefined(item)) {
          const err = new Error("Item not fetched")
          err.variant = "danger"
          props.setAlert(err)
        }
        else {
          setSelectedItem({
            "ID": item.id,
            "Name": item.name,
            "Description": item.description,
            "Quantity": quantity,
            image: item.image
          })

          setShowItemDetail(true)
        }
      })
  }

  return (
    <div className="pages">
      <h3>Request Lines</h3>
      <hr style={{ marginBottom: 0 }} />
      <br />
      <Row>
        <Col lg={1} />
        <Col>
          <h5>Manage</h5>
          <br />
          <Table
            data={requestLines}
            columns={columns}
            rowClasses="requestline-row"
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
            withAction={handleShowItemDetail}
          />

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
        </Col>
        <Col lg={1} />
      </Row>
    </div>
  );
};

export default RequestLines;
