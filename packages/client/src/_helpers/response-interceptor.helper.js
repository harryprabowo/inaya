import { isNullOrUndefined } from "util";
import { authenticationService } from "~/_services";

const handleResponse = (response) => {
  const res = response.data;
  return res.data || res.meta;
};

const handleErrorResponse = (response) => {
  const error = response.response

  if (isNullOrUndefined(error)) {
    return response;
  }

  const { status, statusText } = error

  const err = error.data.meta || { status, statusText };

  if ([401, 498, 499, 501].indexOf(err.status) !== -1) {
    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    authenticationService.logout();
    window.location.reload(true);
  }

  return err;
}

export default {
  handleResponse,
  handleErrorResponse
}