import Cookie from "js-cookie"
import { isNullOrUndefined } from "util"
import {
  argsValidator,
  config,
  Prototype,
} from "~/_helpers";

const { api } = config
const { throwIfMissing } = argsValidator

const fetchMyDroppoints = async () => {
  const response = await api(true).get(`/droppoint/user`);

  const droppoints = response;

  return droppoints.map(droppoint => new Prototype.Droppoint(
    droppoint.id,
    `Point #${droppoint.id}`, // TODO: Implement name
    new Prototype.Position(
      parseFloat(droppoint.longitude),
      parseFloat(droppoint.latitude)
    ),
    new Date(droppoint.createdAt),
    new Date(droppoint.updatedAt),
    // isNullOrUndefined(droppoint.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : droppoint.image  // TODO: Implement image
  ))
}

const register = async (latitude = throwIfMissing(), longitude = throwIfMissing()) => {
  const userId = JSON.parse(Cookie.get("user"))["id"] //FIXME: Please dont ask userId from client
  if (isNullOrUndefined(userId)) return Promise.reject("User ID not available")

  return await api(true).post(
    `/droppoint/create`,
    {
      userId,
      longitude,
      latitude
    },
  )
}

const getDroppointByShipment = async (id = throwIfMissing()) => {
  const response = await api(true).get(`/droppoint?delivery_id=${id}`);

  const droppoint = response.droppoints[0];

  return new Prototype.Droppoint(
    droppoint.id,
    `Point #${droppoint.id}`, // TODO: Implement name
    new Prototype.Position(
      parseFloat(droppoint.longitude),
      parseFloat(droppoint.latitude)
    ),
    new Date(droppoint.createdAt),
    new Date(droppoint.updatedAt),
    // isNullOrUndefined(droppoint.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : droppoint.image  // TODO: Implement image
  )
}

const droppointService = {
  fetchMyDroppoints,
  register,
  getDroppointByShipment
}

export default droppointService