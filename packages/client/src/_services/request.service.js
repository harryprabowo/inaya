import axios from "axios";
import { authHeader, handleResponse, argsValidator, Prototype } from "~/_helpers";

const { throwIfMissing } = argsValidator

const fetchMyRequests = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/request`,
      authHeader()
    );

    const requests = await handleResponse(response);

    return requests.map(request => new Prototype.Request(
      request.id,
      new Prototype.Droppoint(request.DroppointId),
      new Date(request.createdAt),
      new Date(request.updatedAt)
    ))
  } catch (err) {
    throw handleResponse(err, true);
  }
};

const fetchRequestDetail = async (reqId = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/request/details/${reqId}`,
      authHeader()
    );

    const { request, data } = await handleResponse(response);

    return {
      request: new Prototype.Request(
        reqId,
        new Prototype.Droppoint(request.DroppointId),
        new Date(request.createdAt),
        new Date(request.updatedAt),
      ),
      requestLines: data.map(({ requestline, item }) => new Prototype.RequestLine(
        requestline.id,
        new Prototype.Request(requestline.RequestId),
        new Prototype.Item(
          item.id,
          item.name,
          new Date(item.createdAt),
          new Date(item.updatedAt),
          item.description,
          // isNullOrUndefined(item.image)
          //   ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
          //   : item.image  // TODO: Implement image
        ),
        parseInt(requestline.Quantity),
        new Prototype.Shipment(
          requestline.DeliveryId,
          new Prototype.RequestLine(requestline.id),
          new Prototype.Droppoint(request.DroppointId),
        ),
        new Prototype.Facility(requestline.WarehouseId),
        requestline.status,
        new Date(requestline.createdAt),
        new Date(requestline.updatedAt)
      ))
    }
  } catch (err) {
    throw handleResponse(err, true);
  }
};

const createRequest = async (droppoint_id = throwIfMissing(), items) => {
  try {
    const request = await axios.post(
      `${process.env.REACT_APP_API_URL}/request`,
      { droppoint_id },
      authHeader()
    )

    const { id } = await handleResponse(request)

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/requestline`,
      {
        request_id: id,
        items: items.map(item => ({
          id: item.item.id,
          quantity: item.quantity
        }))
      },
      authHeader()
    )

    return {
      id,
      data: await handleResponse(response)
    }
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const fetchRequestLinesByFacility = async (warehouseId = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/requestline/warehouse/${warehouseId}`,
      authHeader()
    );

    const reqlines = await handleResponse(response);

    return reqlines.map(reqline => {
      return new Prototype.RequestLine(
        reqline.id,
        new Prototype.Request(reqline.RequestId),
        new Prototype.Item(reqline.ItemId),
        parseInt(reqline.Quantity),
        new Prototype.Shipment(
          reqline.DeliveryId,
          new Prototype.RequestLine(reqline.id)
        ),
        new Prototype.Facility(reqline.WarehouseId),
        reqline.status,
        new Date(reqline.createdAt),
        new Date(reqline.updatedAt)
      )
    })
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const requestService = {
  fetchMyRequests,
  fetchRequestDetail,
  createRequest,
  fetchRequestLinesByFacility
};

export default requestService;
