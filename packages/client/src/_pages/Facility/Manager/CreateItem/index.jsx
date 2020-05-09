import React from "react"

import { itemService } from "~/_services";

import {
  Formik,
  Field,
  Form,
  ErrorMessage
} from "formik";
import * as Yup from "yup";
import {
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const CreateItem = ({ id, ...props }) => {
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

      <Formik
        initialValues={{
          name: "",
          description: ""
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("Please enter item name"),
          // image: Yup.object().shape({
          //   file: Yup.mixed().required(),
          // })
        })}
        onSubmit={(
          {
            name,
            description,
            // image
          },
          { setSubmitting }
        ) => {
          itemService
            .createGlobalItem(
              name,
              description,
              //image
            )
            .then(
              () => {
                props.setShowModal(false)
                props.setAlert({
                  message: "Added item successfully. Please wait for verification.",
                  variant: "success"
                })
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

            {/* <div className="form-group">
                <label for="file">File upload</label>
                <input id="file" name="file" type="file" onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }} className="form-control" />
                  <Thumb file={values.file} />
                  </div> */}

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
      <br />
    </div>
  );
}

export default CreateItem