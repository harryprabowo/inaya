import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { isNullOrUndefined } from "util";
import { authenticationService } from "~/_services";

import Loading from "~/_components/_static/Loading";

const PrivateComponent = ({
  component: Component,
  show,
  setShow,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const validateUser = async () => {
    try {
      const validated = await authenticationService.currentUserValue;
      setCurrentUser(validated);

      if (isNullOrUndefined(validated)) {
        const error = new Error("Session not found")
        error.status = 404

        throw (error)
      }

      setLoading(false);
    } catch (err) {
      setShow(false);
      props.setAlert(err);
    }
  };

  useEffect(() => {
    if (show) {
      validateUser();
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) {
    return null;
  } else {
    if (loading) {
      return <Loading />;
    } else if (!currentUser) {
      return null;
    } else {
      if (isNullOrUndefined(currentUser)) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }
      // authorised so return component
      return (
        <Component
          show={show}
          setShow={setShow}
          currentUser={currentUser}
          {...props}
        />
      );
    }
  }
};

export default PrivateComponent;
