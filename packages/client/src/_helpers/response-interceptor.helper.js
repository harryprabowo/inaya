import { isNullOrUndefined } from "util";
import logoutHelper from "./logout.helper";

const handleResponse = (response) => {
  const res = response.data;
  return res.data || res.meta;
};

const handleErrorResponse = (response) => {
  const error = response.response
  if (isNullOrUndefined(error)) return response;

  const { status, statusText } = error
  const err = error.data.meta || { status, statusText };

  if ([401, 498, 499, 501].indexOf(err.status) !== -1) logoutHelper();

  return err;
}

export default {
  handleResponse,
  handleErrorResponse
}