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
  Card,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const CreateItem = ({ id, ...props }) => {
  return (
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
          <Card border="light">
            <Card.Header>
              <span>Enter item details</span>
            </Card.Header>
            <Card.Body>
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
}

export default CreateItem