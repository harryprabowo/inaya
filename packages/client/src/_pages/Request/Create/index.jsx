import React, { useState, useEffect } from "react";

import { isNullOrUndefined } from "util"
import { requestService, droppointService, itemService } from "~/_services";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DropdownList } from 'react-widgets'
import { Button, Row, Col, Form as BForm, Modal, Card, ListGroup, ListGroupItem } from "react-bootstrap";
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
        <Button variant="info" onClick={() => handleAddItem(quantity)}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const Create = ({ full, ...props }) => {
  const [droppoints, setDroppoints] = useState([])

  const [items, setItems] = useState([])
  const [value, setValue] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedItem, setSelectedItem] = useState()
  const [showQuantityModal, setShowQuantityModal] = useState(false)

  useEffect(() => {
    droppointService.fetchMyDroppoints()
      .then(data => {
        setDroppoints(data)
      })
      .catch(err => {
        props.setAlert(err)
      })

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

  return (
    <>
      <Formik
        initialValues={{
          description: "",
          droppoint: "",
        }}
        validationSchema={Yup.object().shape({
          description: Yup.string().required("Please enter description. This makes sifting through requests easier"),
          droppoint: Yup.string().required("Please select a droppoint")
        })}
        onSubmit={(
          {
            droppoint,
          },
          { setSubmitting }
        ) => {
          if (selectedItems.length === 0) {
            setSubmitting(false);
            props.setAlert(new Error("Please select an item"))
          } else {
            requestService
              .createRequest(
                droppoint,
                selectedItems
              )
              .then(
                ({ id, data: { unavailable_items } }) => {
                  props.history.replace(`/request/${id}`, {
                    unavailable_items
                  });
                },
                (error) => {
                  setSubmitting(false);
                  error.variant = "danger"
                  props.setAlert(error)
                }
              );
          }
        }}
      >
        {({ errors, touched, isSubmitting, handleChange }) => (
          <Form>
            <Card border="light">
              <Card.Header>
                {full
                  ? <h3>Create New Facility</h3>
                  : <span>Enter request details</span>
                }
              </Card.Header>
              <Card.Body>
                <BForm.Row>
                  <Col
                    lg={{
                      offset: full ? 0 : 1,
                      span: full ? 5 : 10
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <Field
                        name="description"
                        type="text"
                        className={
                          "form-control" +
                          (errors.description && touched.description ? " is-invalid" : "")
                        }
                        disabled={isSubmitting}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="droppoint">Drop Point</label>
                      <BForm.Control
                        name="droppoint"
                        type="text"
                        as="select"
                        className={
                          "form-control" +
                          (errors.droppoint && touched.droppoint ? " is-invalid" : "")
                        }
                        disabled={isSubmitting}
                        onChange={handleChange}
                      >
                        <option value="">---</option>
                        {
                          isNullOrUndefined(droppoints) || droppoints.length === 0 ? (
                            <option disabled value="">No droppoints found.</option>
                          ) : droppoints.map((droppoint, i) => {
                            return (
                              <option key={i} value={droppoint.id}>
                                {droppoint.name || droppoint.id}
                              </option>
                            )
                          })
                        }
                      </BForm.Control>
                      <ErrorMessage
                        name="droppoint"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="items">Items</label>
                      <Card>
                        <Card.Header>
                          <DropdownList open={true} onToggle={() => { }} filter value={value} data={items} textField="name" onChange={handleSelect} />
                          <ErrorMessage
                            name="items"
                            component="div"
                            className="invalid-feedback"
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
                  </Col>
                </BForm.Row>
              </Card.Body>
              <Card.Footer style={{ textAlign: 'right' }}>
                <Button
                  type="submit"
                  size="lg"
                  variant="info"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faSync} spin />
                  ) : (
                      "Submit"
                    )}
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        )}
      </Formik>
      <QuantityModal showQuantityModal={showQuantityModal} setShowQuantityModal={setShowQuantityModal} handleAddItem={handleAddItem} />
    </>
  );
};

export default Create;
