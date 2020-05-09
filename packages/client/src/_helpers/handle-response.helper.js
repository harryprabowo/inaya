import { isNullOrUndefined } from "util";
import { authenticationService } from "~/_services";

const handleResponse = (response, isError = false) => {
  if (isError) {
    if (isNullOrUndefined(response.response)) {
      return response;
    }

    const err = response.response.data.meta;

    if (isNullOrUndefined(err)) {
      return new Error(response.message)
    }

    if ([401].indexOf(err.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.logout();
      window.location.reload(true);
    }
    return err || new Error(response.statusText);
  }

  const res = response.data;
  return res.data || res.meta;
};

export default handleResponse;
