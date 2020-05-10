import React, { useEffect } from "react";
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
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const Login = (props) => {
  useEffect(() => {
    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      props.history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Col md={{ offset: 4, span: 4 }} className="form-box">
      <Row>
        <Col>
          <h4>Sign in to your dashboard</h4>
        </Col>
        <Col xs={3} style={{ textAlign: "right", margin: "auto" }}>
          <Link to="/help">Forgot?</Link>
        </Col>
      </Row>

      <hr />

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={(
          { username, password },
          { setSubmitting, ...rest }
        ) => {
          authenticationService.login(username, password).then(
            (res) => {
              const { from } = props.location.state || {
                from: { pathname: "/" },
              };
              props.history.replace(from);
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
                    <FontAwesomeIcon icon={faSync} spin /> Logging you in...
                  </>
                ) : (
                    "Login"
                  )}
              </Button>
            </div>
            <div className="form-group" style={{ textAlign: "center" }}>
              <Link to="/register">
                <span className="text-info" style={{ fontWeight: 500 }}>
                  Or create an account here
                </span>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </Col>
  );
};

export default Login;
