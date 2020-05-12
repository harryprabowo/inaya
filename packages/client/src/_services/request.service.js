import { config, argsValidator, Prototype } from "~/_helpers";

const { api } = config
const { throwIfMissing } = argsValidator

const fetchMyRequests = async () => {
  const response = await api(true).get(`/request`);

  const requests = response;

  return requests.map(request => new Prototype.Request(
    request.id,
    new Prototype.Droppoint(request.DroppointId),
    new Date(request.createdAt),
    new Date(request.updatedAt)
  ))
};

const fetchRequestDetail = async (reqId = throwIfMissing()) => {
  const response = await api(true).get(`/request/details/${reqId}`);

  const { request, data } = response;

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
};

const createRequest = async (droppoint_id = throwIfMissing(), items) => {
  const { id } = await api(true).post(
    `/request`,
    { droppoint_id }
  )

  const response = await api(true).post(
    `/requestline`,
    {
      request_id: id,
      items: items.map(item => ({
        id: item.item.id,
        quantity: item.quantity
      }))
    }
  )

  return {
    id,
    data: response
  }
}

const fetchRequestLinesByFacility = async (warehouseId = throwIfMissing()) => {
  const response = await api(true).get(`/requestline/warehouse/${warehouseId}`);

  const reqlines = response;

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
}

const requestService = {
  fetchMyRequests,
  fetchRequestDetail,
  createRequest,
  fetchRequestLinesByFacility
};

export default requestService;
