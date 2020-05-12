import React from "react";
import { Redirect } from "react-router-dom";

import { isNullOrUndefined } from "util";
import { Helmet } from "react-helmet";

const PublicRoute = ({ component: Component, name, restrict, ...props }) => {
  if (!isNullOrUndefined(props.currentUser) && restrict) {
    const redirectRoleToPage = [undefined, "/", "/facility", "/droppoint"]

    return <Redirect to={redirectRoleToPage[props.currentUser.RoleId]} />
  }

  return (
    <>
      <Helmet>
        <title>{isNullOrUndefined(name) ? name : `INAYA - ${name}`}</title>
      </Helmet>
      <Component {...props} />
    </>
  )
}

export default PublicRoute