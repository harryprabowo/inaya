import React, { useState, useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Helmet } from 'react-helmet'

import { authenticationService } from "~/_services";
import { history, logoutHelper } from "~/_helpers";

import { PrivateRoute, Alert, MenuBar, PublicRoute } from "./_components";

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
    try {
      authenticationService.currentUser.subscribe((x) => setCurrentUser(x));
    } catch (err) {
      setAlert(err)
    }
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
          {routes.map((route, i) => (
            <Route
              key={i}
              exact={route.path === "/"}
              path={route.path}
              render={props => {
                if (route.isPrivate) {
                  return (
                    <PrivateRoute
                      name={route.name}
                      role={route.role}
                      component={route.component}
                      {...props}
                      setAlert={setAlert}
                    />
                  )
                } else {
                  return (
                    <PublicRoute
                      name={route.name}
                      component={route.component}
                      {...props}
                      setAlert={setAlert}
                    />
                  )
                }
              }}
            />
          ))}

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
