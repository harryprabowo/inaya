import React, { useState } from "react";
import { Link } from "react-router-dom";

import { authenticationService } from "~/_services";
import {
  Formik,
  Field,
  Form,
  ErrorMessage
} from "formik";
import * as Yup from "yup";
import {
  Button,
  Col,
  Form as BForm
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "src/_components";
import { isNullOrUndefined } from "util";

const Register = (props) => {
  const [showLoading, setShowLoading] = useState(false)

  const equalTo = (ref, msg) => {
    return Yup.mixed().test({
      name: "equalTo",
      exclusive: false,
      message: msg || "Password must be the same",
      params: {
        reference: ref.path,
      },
      test: function (value) {
        return value === this.resolve(ref);
      },
    });
  };

  Yup.addMethod(Yup.string, "equalTo", equalTo);

  return (
    <>
      {showLoading ? <Loading cover /> : null}
      <Formik
        initialValues={{
          // firstname: "",
          // lastname: "",
          email: "",
          username: "",
          password: "",
          passwordagain: "",
          role: "",
        }}
        validationSchema={Yup.object().shape({
          // firstname: Yup.string()
          //   .required("Fisrt name is required")
          //   .min(2, "Too Short!")
          //   .max(50, "Too Long!")
          //   .required("Required"),
          // lastname: Yup.string()
          //   .required("Last name is required")
          //   .min(2, "Too Short!")
          //   .max(50, "Too Long!")
          //   .required("Required"),
          email: Yup.string()
            .required("Please enter your email")
            .email("Invalid email"),
          username: Yup.string().required("Username cannot be empty"),
          password: Yup.string()
            .required("Please enter password")
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
              "Must contain at least 8 characters, uppercase & lowercase letters, and numbers"
            ),
          passwordagain: Yup.string()
            .required("Confirm password")
            .equalTo(Yup.ref("password"), "Password must match"),
          role: Yup.string().required("Please select a role"),
        })}
        onSubmit={(
          {
            // firstname,
            // lastname,
            email,
            username,
            password,
            role,
          },
          { setSubmitting }
        ) => {
          authenticationService
            .register(
              // firstname,
              // lastname,
              email,
              username,
              password,
              role
            )
            .then(
              (res) => {
                setShowLoading(true)

                const state = isNullOrUndefined(props.location) ? undefined : props.location.state
                const from = isNullOrUndefined(state) ? undefined : props.location.state.from

                window.location.replace(isNullOrUndefined(from) ? "/" : from.pathname || "/");
              },
              (error) => {
                setSubmitting(false)
                error.variant = "danger"
                props.setAlert(error)
              }
            );
        }}
      >
        {({ errors, touched, isSubmitting, handleChange }) => (
          <Form>
            <BForm.Row style={{ margin: '5vh auto', padding: '0 1em' }}>
              <Col sm={2} lg={3} xl={4} />
              <Col>
                <BForm.Row>
                  <Col style={{ padding: 0 }}>
                    <h4>Create account</h4>
                  </Col>
                  <Col
                    xs={3}
                    style={{ padding: 0, textAlign: "right", margin: "auto" }}
                  ></Col>
                </BForm.Row>

                <hr />

                {/* <div className="form-group">
              <label htmlFor="firstname">First name</label>
              <Field
                name="firstname"
                type="text"
                className={
                  "form-control" +
                  (errors.firstname && touched.firstname ? " is-invalid" : "")
                }
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last name</label>
              <Field
                name="lastname"
                type="text"
                className={
                  "form-control" +
                  (errors.lastname && touched.lastname ? " is-invalid" : "")
                }
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="invalid-feedback"
              />
            </div> */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field
                    name="username"
                    type="text"
                    className={
                      "form-control" +
                      (errors.username && touched.username ? " is-invalid" : "")
                    }
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className={
                      "form-control" +
                      (errors.password && touched.password ? " is-invalid" : "")
                    }
                    disabled={isSubmitting}
                    autoComplete="on"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordagain">Confirm password</label>
                  <Field
                    name="passwordagain"
                    type="password"
                    className={
                      "form-control" +
                      (errors.passwordagain && touched.passwordagain
                        ? " is-invalid"
                        : "")
                    }
                    disabled={isSubmitting}
                    autoComplete="on"
                  />
                  <ErrorMessage
                    name="passwordagain"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <BForm.Control
                    name="role"
                    type="text"
                    as="select"
                    className={
                      "form-control" +
                      (errors.role && touched.role ? " is-invalid" : "")
                    }
                    disabled={isSubmitting}
                    onChange={handleChange}
                  >
                    {/* <option value="">-- None --</option> */}
                    <option value="">--</option>
                    <option value="2">Facility</option>
                    <option value="3">Droppoint</option>
                  </BForm.Control>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <br />

                <div className="form-group" style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    size="lg"
                    variant="info"
                    disabled={isSubmitting}
                    block
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSync} spin /> Signing you up...
                  </>
                    ) : (
                        "Register"
                      )}
                  </Button>
                </div>
                <div className="form-group" style={{ textAlign: "center" }}>
                  <Link to="/login">
                    <span className="text-info" style={{ fontWeight: 500 }}>
                      Already have an account? Login
                </span>
                  </Link>
                </div>
              </Col>
              <Col sm={2} lg={3} xl={4} />
            </BForm.Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;
