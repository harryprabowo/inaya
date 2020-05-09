import React, { useState, useEffect } from "react";
import { useHistory } from "react-router"
import { Route, Redirect } from "react-router-dom";

import { isNullOrUndefined } from "util";
import Cookies from 'js-cookie';
import { Helmet } from "react-helmet";
import { authenticationService } from "~/_services";

import Loading from "~/_components/_static/Loading";
import { Forbidden, ServiceUnavailable } from "~/_pages";

const PrivateRoute = ({ route, ...rest }) => {
  const history = useHistory()
  const { path, name, role, component: Component } = route;

  const [nothing, setNothing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState();

  const validateUser = async () => {
    try {
      const validated = await authenticationService.currentUserValue;
      setCurrentUser(validated);

      if (isNullOrUndefined(validated)) {
        const error = new Error("Session not found")
        error.status = 404

        setCurrentRole()

        throw (error)
      }

      const user = JSON.parse(Cookies.get("user"));
      setCurrentRole(user.RoleId);

      setLoading(false);
    } catch (err) {
      if (err.status !== 404) {
        err.variant = "danger"
        setNothing(true);
        rest.setAlert(err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (nothing) {
    return <ServiceUnavailable />;
  } else if (loading) {
    return <Loading />;
  } else {
    return (
      <Route
        path={path}
        render={(props) => {
          if (isNullOrUndefined(currentUser)) {
            // not logged in so redirect to login page with the return url
            return (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            );
          }
          // authorised so return component
          if (isNullOrUndefined(role) || role.includes(currentRole)) {
            return (
              <>
                <Helmet>
                  <title>{name}</title>
                </Helmet>
                <Component history={history} {...props} {...rest} />
              </>
            );
          } else return <Forbidden />;
        }}
      />
    );
  }
};

export default PrivateRoute;
