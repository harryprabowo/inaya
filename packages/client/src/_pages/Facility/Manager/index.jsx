import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  dateHelper as d,
  urlParamHelper as url
} from "~/_helpers";
import { facilityService } from "~/_services";
import { isUndefined, isNull, isNullOrUndefined } from "util";

import { Row, Col, Image, Modal, Table as BootstrapTable, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus, faTrash, faFileUpload } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components"
import AddItem from "./AddItem"
import CreateItem from "./CreateItem"
import ScheduleList from "./Schedules"

import "./style.scss"

const Manager = (props) => {
  let query = url.useQuery();

  const [facilityDetail, updateFacilityDetail] = useState();
  const [facilityItems, updateFacilityItems] = useState();

  const [selectedItem, setSelectedItem] = useState();
  const [itemToDelete, setItemToDelete] = useState()

  const [showItemDetail, setShowItemDetail] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fetchFacilityDetail = async (id) => {
    updateFacilityDetail();
    updateFacilityItems()

    facilityService.fetchFacilityDetail(id = query.get("id"))
      .then((data) => {
        updateFacilityDetail(data)
        fetchFacilityItems(id)
      })
      .catch((err) => {
        updateFacilityDetail(null)
        updateFacilityItems(null)
        props.setAlert(err)
      });
  };

  const fetchFacilityItems = async (id = query.get("id")) => {
    updateFacilityItems()

    facilityService.fetchFacilityItems(id)
      .then((data) => {
        updateFacilityItems(data)
      })
      .catch((err) => {
        updateFacilityItems(null)
        props.setAlert(err)
      });
  };

  useEffect(() => {
    if (!isNullOrUndefined(query.get("id"))) {
      fetchFacilityDetail(query.get("id"));
    } else {
      props.setAlert(new Error("Wrong parameters"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "#",
      hidden: true,
    },
    {
      dataField: "name",
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
      dataField: "action",
      isDummyField: true,
      text: "",
      formatter: (cell, row) => {
        const handleClick = (_e) => {
          _e.stopPropagation();

          setItemToDelete(row.id)
          setShowDeleteModal(true)
        };

        return (
          <div className="table-action">
            <Button variant="light" onClick={handleClick}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        )
      }
    },
  ]

  const handleShowItemDetail = (item) => {
    setItemToDelete(item)
    setShowItemDetail(true)

    setSelectedItem({
      "ID": item.id,
      "Name": item.name,
      "Description": item.description,
      "Created": d.getShortDate(item.date),
      "Last Updated": d.getShortDate(item.lastUpdated),
      image: item.image,
    })
  }

  const handleDeleteItem = () => {
    if (isNullOrUndefined(itemToDelete)) props.setAlert(new Error("An error occured"))
    else {
      facilityService.deleteItemFromWarehouse(itemToDelete)
        .then(res => {
          props.setAlert({
            message: "Delete successful",
            variant: "success"
          })
          setShowDeleteModal(false)
          fetchFacilityDetail(query.get("id"));
        })
        .catch(err => props.setAlert(err))
    }
  }

  return (
    <div className="pages no-map" id="facility-manager">
      <h3>Manage Facility</h3>
      <hr style={{ marginBottom: 0 }} />
      <br />
      <Row>
        <Col xs={12} md={5} className="left">
          <Card id="detail-container">
            <Card.Body>
              {isUndefined(facilityDetail) ? (
                <div style={{ textAlign: "center" }}>
                  <FontAwesomeIcon icon={faSpinner} size="lg" spin />
                </div>
              ) : isNull(facilityDetail) ? (
                <div style={{ textAlign: "center" }}>
                  No data found
                </div>
              ) : (
                    <Row style={{ alignItems: 'center' }}>
                      {isNullOrUndefined(facilityDetail) ? null : isNullOrUndefined(facilityDetail.image) ? null : (

                        <Col xs={12} md={6} lg={3}>
                          <Image src={facilityDetail.image} fluid rounded style={{ width: '100%', height: '8em', objectFit: 'cover' }} />
                        </Col>
                      )}
                      <Col xs={12} md={6} xl={3}>
                        <span>Facility </span>
                        <h6>{facilityDetail.name}</h6>
                      </Col>
                      <Col xs={12} md={6} xl={3}>
                        <span>Created </span>
                        <h6> {d.getShortDate(facilityDetail.date)}</h6>
                      </Col>
                      <Col xs={12} md={6} xl={3}>
                        <span>Last Updated </span>
                        <h6> {d.getShortDate(facilityDetail.lastUpdated)}</h6>
                      </Col>
                      <Col xs={12} md={6} xl={3}>
                        <span>Location</span>
                        <h6><Link to={`/facility?id=${facilityDetail.id}`}>See location</Link></h6>
                      </Col>
                    </Row>
                  )}
            </Card.Body>
          </Card>

          <br />

          <h5>Schedule</h5>
          <br />

          <div id="schedule-list" >
            <ScheduleList {...props} />
          </div>
        </Col>
        <Col className="right">
          <h5>Items List</h5>
          <br />
          <Table
            data={facilityItems}
            columns={columns}
            rowClasses="inventory-row"
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
                  value: <FontAwesomeIcon icon={faFileUpload} />,
                  tooltip: "Create new unverified item",
                  func: () => setShowRegisterModal(true),
                },
                {
                  value: <FontAwesomeIcon icon={faPlus} />,
                  tooltip: "Add verified item to warehouse",
                  func: () => setShowModal(true),
                },
              ]}
            withAction={handleShowItemDetail}
          />
        </Col>
      </Row>

      <Modal
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
                <Image src={selectedItem.image} fluid rounded style={{ objectFit: 'cover', height: '15em' }} />
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

      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            New item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <CreateItem setShowModal={setShowRegisterModal} {...props} />
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        keyboard={false}
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="wrapper"
          style={{ padding: 0, height: "60vh" }}
        >
          <div className="scrollable-children">
            <AddItem id={query.get("id")} setShowModal={setShowModal} fetchFacilityItems={fetchFacilityItems} {...props} />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="sm"
        backdropClassName="layer"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteItem()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Manager;
