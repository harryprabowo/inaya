import React, { useState, useEffect } from "react"

import { isNullOrUndefined } from "util"
import {
  urlParamHelper as url
} from "~/_helpers";
import { facilityService, itemService } from "~/_services";

import { DropdownList } from 'react-widgets'
import {
  Row,
  Col,
  Button,
  Card,
  ListGroupItem,
  ListGroup,
  Modal,
  Form
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faTimes } from "@fortawesome/free-solid-svg-icons";


const QuantityModal = ({ showQuantityModal, setShowQuantityModal, handleAddItem }) => {
  const [quantity, setQuantity] = useState(1)

  const handleQuantity = e => setQuantity(parseInt(e.target.value))

  return (
    <Modal
      size="sm"
      backdropClassName="layer"
      show={showQuantityModal}
      onHide={() => setShowQuantityModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Quantity
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="number"
          min={0}
          step={1}
          className="form-control"
          onChange={handleQuantity}
          defaultValue={1}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowQuantityModal(false)}>
          Cancel
          </Button>
        <Button variant="info" onClick={() => {
          handleAddItem(quantity)
          setQuantity(1)
        }
        }>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const AddItem = ({ id, ...props }) => {
  let query = url.useQuery();

  const [items, setItems] = useState([])
  const [value, setValue] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedItem, setSelectedItem] = useState()
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  useEffect(() => {
    itemService.fetchAllItems()
      .then(data => {
        setItems(data)
      })
      .catch(err => {
        props.setAlert(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelect = (e) => {
    setValue(e)
    if (!selectedItems.find(_e => _e.item === e)) {
      setShowQuantityModal(true)
      setSelectedItem(e)
    } else {
      props.setAlert(new Error("Item has already been selected"))
    }
  }

  const handleAddItem = (quantity = 1) => {
    setSelectedItems([...selectedItems, {
      item: selectedItem,
      quantity
    }])
    setSelectedItem()
    setShowQuantityModal(false)
    setValue()
  }

  const handleDeleteItem = (idx) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!isNullOrUndefined(query.get("id"))) {
      facilityService.addItemToWarehouse(
        query.get("id"), selectedItems
      ).then(
        (res) => {
          props.setShowModal(false)
          props.setAlert({
            message: "Added item(s) successfully",
            variant: "success"
          })
          props.fetchFacilityItems()
        },
        (error) => {
          setSubmitting(false);
          error.variant = "danger"
          props.setAlert(error)
        }
      )
    } else {
      props.setAlert(new Error("Wrong parameters"))
    }
  }


  return (
    <div
      style={{ padding: '2em 4em' }}
    >
      <Row>
        <Col style={{ padding: 0 }}>
          <h5>Enter item details</h5>
        </Col>
      </Row>

      <hr />
      <Form>
        <div className="form-group">
          <label htmlFor="items">Items</label>
          <Card>
            <Card.Header>
              <DropdownList
                filter
                open={true}
                onToggle={() => { }}
                value={value}
                data={items}
                textField="name"
                onChange={handleSelect}
                disabled={isSubmitting}
              />
            </Card.Header>
            {
              isNullOrUndefined(selectedItems) || selectedItems.length === 0
                ? (
                  <Card.Body style={{ textAlign: 'center' }}>
                    No items selected
                  </Card.Body>
                ) : (
                  <ListGroup variant="flush">
                    {
                      selectedItems.map(({ item, quantity }, i) => (
                        <ListGroupItem key={i} className="item-list">
                          <Row>
                            <Col>
                              {item.name}
                            </Col>
                            <Col style={{ paddingRight: '1em', textAlign: 'right' }}>
                              <strong>{quantity}</strong>
                            </Col>
                            <Col xs={1} className="close-col">
                              <Button variant="link" onClick={() => handleDeleteItem(i)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </Button>
                            </Col>
                          </Row>
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                )
            }
          </Card>
        </div>

        <br />

        <div className="form-group" style={{ textAlign: "right" }}>
          <Button
            size="lg"
            variant="info"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSync} spin />
            ) : (
                "Submit"
              )}
          </Button>
        </div>
      </Form>
      <br />
      <QuantityModal showQuantityModal={showQuantityModal} setShowQuantityModal={setShowQuantityModal} handleAddItem={handleAddItem} />
    </div >
  );
}

export default AddItem