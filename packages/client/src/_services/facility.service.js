import {
  argsValidator,
  config,
  Prototype,
} from "~/_helpers";

const { api } = config
const { throwIfMissing } = argsValidator

const fetchMyFacilities = async () => {
  const response = await api(true).get(`/warehouse/user`);

  const facilities = response;

  return facilities.map(facility => new Prototype.Facility(
    facility.id,
    `Facility #${facility.id}`, // TODO: Implement name
    new Prototype.Position(
      parseFloat(facility.longitude),
      parseFloat(facility.latitude)
    ),
    new Date(facility.createdAt),
    new Date(facility.updatedAt),
    // isNullOrUndefined(facility.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : facility.image  // TODO: Implement image
  ))
}

const fetchFacilityDetail = async (id = throwIfMissing()) => {
  const response = await api(true).get(`/warehouse?id=${id}`);

  const facility = response;

  return new Prototype.Facility(
    facility.id,
    `Facility #${facility.id}`, // TODO: Implement name
    new Prototype.Position(
      parseFloat(facility.longitude),
      parseFloat(facility.latitude)
    ),
    new Date(facility.createdAt),
    new Date(facility.updatedAt),
    // isNullOrUndefined(facility.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : facility.image  // TODO: Implement image
  )
}

const fetchFacilityItems = async (id = throwIfMissing()) => {
  const response = await api(true).get(`/items/warehouse?warehouse_id=${id}`);

  const items = response;

  return items.map(item => new Prototype.Item(
    item.id,
    item.name,
    new Date(item.createdAt),
    new Date(item.updatedAt),
    item.description,
    // isNullOrUndefined(item.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : item.image  // TODO: Implement image
  ))
}

const register = async (latitude = throwIfMissing(), longitude = throwIfMissing()) => {
  return await api(true).post(
    `/warehouse`,
    {
      longitude,
      latitude
    }
  )
}

const addItemToWarehouse = async (warehouse_id = throwIfMissing(), items = throwIfMissing()) => {
  let responses = []

  for (const { item: { id: item_id }, quantity } of items) {
    responses.push(await api(true).post(
      `/items/warehouse`,
      {
        warehouse_id,
        item_id,
        quantity
      }
    ))
  }

  return Promise.resolve(responses)
}

const deleteItemFromWarehouse = async (id = throwIfMissing) => {
  return await api(true).delete(`/items/warehouse?warehouseItem_id=${id}`)
}

const getFacilityByShipment = async (facilityId = throwIfMissing(), deliveryId = throwIfMissing()) => {
  const response = await api(true).get(`/warehouse?delivery_id=${deliveryId}&facility_id=${facilityId}`);

  const facility = response;

  return new Prototype.Facility(
    facility.id,
    `Facility #${facility.id}`, // TODO: Implement name
    new Prototype.Position(
      parseFloat(facility.longitude),
      parseFloat(facility.latitude)
    ),
    new Date(facility.createdAt),
    new Date(facility.updatedAt),
    // isNullOrUndefined(facility.image)
    //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
    //     : facility.image  // TODO: Implement image
  )
}

const facilityService = {
  fetchMyFacilities,
  fetchFacilityDetail,
  fetchFacilityItems,
  register,

  addItemToWarehouse,
  deleteItemFromWarehouse,

  getFacilityByShipment
}

export default facilityService