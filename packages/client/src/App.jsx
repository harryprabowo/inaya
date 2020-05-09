import React, { useState, useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Helmet } from 'react-helmet'

import { isNullOrUndefined } from "util";
import { authenticationService } from "~/_services";
import { history, logoutHelper } from "~/_helpers";

import { PrivateRoute, Alert, MenuBar } from "./_components";

import { routes } from "~/_pages";

import 'react-widgets/dist/css/react-widgets.css';
import "./App.scss";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState();

  // returns current username, or undefined if not logged in
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    authenticationService.currentUser.subscribe((x) => setCurrentUser(x));
  });

  return (
    <Router history={history}>
      <Helmet>
        <title>INAYA Aid Logistics</title>
      </Helmet>
      <Alert alert={alert} showAlert={showAlert} setShowAlert={setShowAlert} />
      <div id="App">
        <MenuBar
          currentUser={currentUser}
          setAlert={setAlert}
        />
        <Switch>
          {routes.map((route, key) =>
            route.isPrivate ? (
              <PrivateRoute
                key={key}
                route={route}
                path={route.path}
                // PROPS
                setAlert={setAlert}
              />
            ) : (
                <Route
                  key={key}
                  exact={route.path === "/"}
                  path={route.path}
                  render={(props) => (
                    <>
                      {isNullOrUndefined(route.name) ? null : (
                        <Helmet>
                          <title>{route.name}</title>
                        </Helmet>
                      )}
                      <route.component setAlert={setAlert} {...props} />
                    </>
                  )}
                />
              )
          )}
          <Route
            path="/logout"
            children={() => {
              logoutHelper()
            }}
          />
          <Redirect to="/404" />
        </Switch>
        <br />
      </div>
      <footer>
        <hr style={{ margin: 0 }} />
        <br />
        <p
          style={{
            textAlign: "center",
            fontSize: "9pt",
            color: "grey",
            transition: "0.2s",
          }}
        >
          @ 2020, ITB, Inc. or its affiliates
        </p>
        <br />
      </footer>
    </Router>
  );
};

export default App;
