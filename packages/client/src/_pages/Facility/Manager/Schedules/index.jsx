import React, { useEffect, useState } from "react";

import {
  dateHelper as d,
  urlParamHelper as url
} from "~/_helpers";
import { scheduleService } from "~/_services";
import { isNullOrUndefined } from "util";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SelectList } from "react-widgets"
import { Modal, Button, Col, Card, Form as BForm } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faSync } from "@fortawesome/free-solid-svg-icons";

import { Table } from "~/_components"

const ScheduleList = (props) => {
  let query = url.useQuery();

  const [schedules, updateSchedules] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState()

  const fetchSchedules = async (id = query.get("id")) => {
    updateSchedules([])

    scheduleService.getSchedules(id)
      .then(data => {
        updateSchedules(data)
      })
      .catch(err => props.setAlert(err))
  }

  useEffect(() => {
    if (!isNullOrUndefined(query.get("id"))) {
      fetchSchedules()
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
      dataField: "hour",
      text: "Dispatch Hour",
      sort: true
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

          setIdToDelete(row.id)
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

  const handleDeleteSchedule = () => {
    scheduleService.deleteSchedule(idToDelete)
      .then(res => {
        props.setAlert({
          message: "Schedule delete successful",
          variant: "success"
        })
        setShowDeleteModal(false)
        fetchSchedules();
      })
      .catch(err => {
        err.variant = "danger"
        props.setAlert(err)
      })
  }

  return (
    <>
      <Table
        searchBar={false}
        pagination={false}
        data={schedules}
        columns={columns}
        rowClasses="schedule-row"
        defaultSorted={[
          {
            dataField: "hour",
            order: "asc"
          }
        ]}
        headerBtn={
          [
            {
              value: <FontAwesomeIcon icon={faPlus} />,
              tooltip: "Create new schedule",
              func: () => setShowModal(true),
            }
          ]}
      />
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Create Schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <Formik
            initialValues={{
              name: "",
              latitude: 0,
              longitude: 0,
              image: null
            }}
            validationSchema={Yup.object().shape({
              hour: Yup.number()
                .required("Hour value missing"),
            })}
            onSubmit={(
              {
                days,
                hour,
                minute
              },
              { setSubmitting }
            ) => {
              scheduleService
                .createSchedule(
                  query.get("id"), hour
                )
                .then(
                  (res) => {
                    props.setAlert({
                      message: "Schedule successfully created",
                      variant: "success"
                    })
                    setShowModal(false)
                    fetchSchedules()
                  },
                  (error) => {
                    setSubmitting(false);
                    error.variant = "danger"
                    props.setAlert(error)
                  }
                );
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Card border="light">
                  <Card.Header>
                    <span>Enter item details</span>
                  </Card.Header>
                  <Card.Body>

                    <label>Time</label>
                    <BForm.Row>
                      <Col style={{ marginRight: ".25em", padding: 0 }}>
                        <div className="form-group">
                          <Field
                            name="hour"
                            type="number"
                            min={0}
                            max={23}
                            step={1}
                            defaultValue={0}
                            className={
                              "form-control" +
                              (errors.hour && touched.hour ? " is-invalid" : "")
                            }
                            disabled={isSubmitting}
                          />
                          <ErrorMessage
                            name="number"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </Col>
                      <h3>:</h3>
                      <Col style={{ marginLeft: ".25em", padding: 0 }}>
                        <div className="form-group">
                          <Field
                            name="minute"
                            type="number"
                            min={0}
                            max={59}
                            step={1}
                            defaultValue={0}
                            className={
                              "form-control" +
                              (errors.minute && touched.minute ? " is-invalid" : "")
                            }
                            disabled={isSubmitting}
                          />
                          <ErrorMessage
                            name="number"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </Col>
                    </BForm.Row>

                    <div className="form-group">
                      <label htmlFor="day">Day (WIP)</label>
                      <SelectList
                        name="day"
                        data={[
                          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
                        ]}
                        multiple
                        disabled
                      />
                      <ErrorMessage
                        name="day"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
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
          <Button variant="danger" onClick={() => handleDeleteSchedule()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ScheduleList