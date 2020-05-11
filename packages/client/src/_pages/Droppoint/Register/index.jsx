import React from "react";

import { droppointService } from "~/_services";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Col, Card, Form as BForm } from "react-bootstrap";
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
          .required("Please enter drop point name"),
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
        droppointService
          .register(
            // name,
            latitude,
            longitude,
            //image
          )
          .then(
            ({ id }) => {
              props.setAlert({
                message: "Drop point successfully registered",
                variant: "success"
              })
              window.location.replace(`/droppoint?id=${id}`);
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
                ? <h3>Register New Droppoint</h3>
                : <span>Enter droppoint details</span>
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
                    <Col>
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
                  </BForm.Row>
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
  );
};

export default Register;
