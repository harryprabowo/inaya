import argsValidator from "./args-validator.helper"

const { throwIfMissing } = argsValidator

const role = [undefined, "Superadmin", "Facility", "Droppoint"]
// const shipmentStatus = ["Open", "Shipping", "Arrived", "Cancelled"];
const requestLineStatus = ["Open", "Commited", "Completed", "Cancelled"]; //FIXME: shit

const getRequestLineStatus = (status = throwIfMissing()) => requestLineStatus.indexOf(status)

const getRequestLineVariant = (status = throwIfMissing()) => {
  const variant = ["secondary", "info", "success", "warning"]
  const idx = requestLineStatus.indexOf(status)

  return idx >= 0 ? variant[requestLineStatus.indexOf(status)] : "info"
}

export default {
  role,
  getRequestLineStatus,
  getRequestLineVariant
};
