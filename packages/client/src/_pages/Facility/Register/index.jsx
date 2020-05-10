import React from "react";

import { facilityService } from "~/_services";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Row, Col, Card, Form as BForm } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const Register = ({ full, ...props }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        latitude: 0,
        longitude: 0,
        image: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Please enter facility name"),
        latitude: Yup.number()
          .required("Latitude value missing")
          .min(-90, "Latitude must be between -90 & 90")
          .max(90, "Latitude must be between -90 & 90"),
        longitude: Yup.number()
          .required("Longitude value missing")
          .min(-180, "Longitude must be between -180 & 180")
          .max(180, "Longitude must be between -180 & 180"),
        // image: Yup.object().shape({
        //   file: Yup.mixed().required(),
        // })
      })}
      onSubmit={(
        {
          name,
          latitude,
          longitude,
          // image
        },
        { setSubmitting }
      ) => {
        facilityService
          .register(
            // name,
            latitude,
            longitude,
            //image
          )
          .then(
            ({ id }) => {
              props.setAlert({
                message: "Facility successfully registered",
                variant: "success"
              })
              window.location.replace(`/facility?id=${id}`);
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
              {full
                ? <h3>Register New Facility</h3>
                : <span>Enter facility details</span>
              }
            </Card.Header>
            <Card.Body>
              <Row>
                <Col
                  md={{
                    offset: full ? 0 : 1,
                    span: full ? 5 : 10
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field
                      name="name"
                      type="text"
                      className={
                        "form-control" +
                        (errors.name && touched.name ? " is-invalid" : "")
                      }
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <BForm.Row>
                    <Col style={{ padding: 0 }}>
                      <div className="form-group">
                        <label htmlFor="latitude">Latitude</label>
                        <Field
                          name="latitude"
                          type="number"
                          min={-90}
                          max={90}
                          step={0.0001}
                          className={
                            "form-control" +
                            (errors.latitude && touched.latitude ? " is-invalid" : "")
                          }
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name="latitude"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="longitude">Longitude</label>
                        <Field
                          name="longitude"
                          type="number"
                          min={-180}
                          max={180}
                          step={0.0001}
                          className={
                            "form-control" +
                            (errors.longitude && touched.longitude ? " is-invalid" : "")
                          }
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name="longitude"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    {/* <Col style={{ paddingRight: 0 }}>
                <div className="form-group">
                <label for="file">File upload</label>
                <input id="file" name="file" type="file" onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }} className="form-control" />
                  <Thumb file={values.file} />
                  </div>
              </Col> */}
                  </BForm.Row>
                </Col >
              </Row>
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
  );
};

export default Register;
