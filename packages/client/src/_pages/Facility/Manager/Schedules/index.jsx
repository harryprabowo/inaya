import React, { useEffect, useState } from "react";

import {
  dateHelper as d,
  urlParamHelper as url
} from "~/_helpers";
import { scheduleService } from "~/_services";
import { isNullOrUndefined } from "util";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
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
        size="sm"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                hour
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
                <div className="form-group">
                  <label htmlFor="hour">Dispatch Hour</label>
                  <Field
                    name="hour"
                    type="number"
                    min={0}
                    max={23}
                    step={1}
                    className={
                      "form-control" +
                      (errors.latitude && touched.latitude ? " is-invalid" : "")
                    }
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="number"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <br />

                <div className="form-group" style={{ textAlign: "right" }}>
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
                </div>
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
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you positive?
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