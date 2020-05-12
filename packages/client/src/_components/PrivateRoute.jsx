import React, { useState, useEffect } from "react";
import { useHistory } from "react-router"
import { Redirect } from "react-router-dom";

import { isNullOrUndefined } from "util";
import Cookies from 'js-cookie';
import { Helmet } from "react-helmet";
import { authenticationService } from "~/_services";

import Loading from "~/_components/_static/Loading";
import { Forbidden, ServiceUnavailable } from "~/_pages";

const PrivateRoute = ({ component: Component, name, role, ...props }) => {
  const history = useHistory()

  const [nothing, setNothing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState();

  const validateUser = async () => {
    try {
      const validated = await authenticationService.currentUserValue;
      setCurrentUser(validated);

      if (isNullOrUndefined(validated)) {
        const error = new Error("Session Unauthorized")
        error.status = 401

        setCurrentRole()

        throw (error)
      }

      const user = JSON.parse(Cookies.get("user"));
      setCurrentRole(user.RoleId);

      setLoading(false);
    } catch (err) {
      if (err.status !== 401) {
        setNothing(true);
        props.setAlert(err);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (nothing) {
    return <ServiceUnavailable />;
  } else {
    if (isNullOrUndefined(currentUser)) {
      // not logged in so redirect to login page with the return url
      return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    }

    // authorised so return component
    if (isNullOrUndefined(role) || role.includes(currentRole)) {
      return (
        <>
          <Helmet>
            <title>{isNullOrUndefined(name) ? name : `INAYA - ${name}`}</title>
          </Helmet>
          <Component history={history} {...props} />
        </>
      );
    }

    return <Forbidden />;
  }
};

export default PrivateRoute;
