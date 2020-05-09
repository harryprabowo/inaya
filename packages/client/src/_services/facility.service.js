import axios from "axios"
import { authHeader, handleResponse, Prototype, argsValidator } from "~/_helpers";

const { throwIfMissing } = argsValidator

const fetchMyFacilities = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/warehouse/user`,
      authHeader()
    );

    const facilities = await handleResponse(response);

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
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const fetchFacilityDetail = async (id = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/warehouse?id=${id}`,
      authHeader()
    );

    const facility = await handleResponse(response);

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
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const fetchFacilityItems = async (id = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/items/warehouse?warehouse_id=${id}`,
      authHeader()
    );

    const items = await handleResponse(response);

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
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const register = async (latitude = throwIfMissing(), longitude = throwIfMissing()) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/warehouse`,
      { longitude, latitude },
      authHeader()
    )

    return await handleResponse(response)
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const addItemToWarehouse = async (warehouse_id = throwIfMissing(), item = throwIfMissing()) => {
  try {
    const payload = {
      warehouse_id,
      item_id: item.id,
      quantity: item.quantity
    }
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/items/warehouse`,
      payload,
      authHeader()
    )

    return await handleResponse(res)
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const deleteItemFromWarehouse = async (id = throwIfMissing) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/items/warehouse?warehouseItem_id=${id}`,
      authHeader()
    )
    return await handleResponse(response)
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const getSchedules = async (id = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/warehouse/schedule?warehouse_id=${id}`,
      authHeader()
    );

    const schedules = await handleResponse(response);

    return schedules.map(schedule => new Prototype.Schedule(
      schedule.id,
      new Prototype.Facility(schedule.WarehouseId),
      parseInt(schedule.Hour),
      new Date(schedule.createdAt),
      new Date(schedule.updatedAt),
    ))
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const createSchedule = async (warehouse_id = throwIfMissing(), hour = throwIfMissing()) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/warehouse/schedule`,
      { warehouse_id, hour },
      authHeader()
    )
    return await handleResponse(response)
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const deleteSchedule = async (id = throwIfMissing()) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/warehouse/schedule?schedule_id=${id}`,
      authHeader()
    )
    return await handleResponse(response)
  } catch (err) {
    throw handleResponse(err, true)
  }
}

const getFacilityByShipment = async (facilityId = throwIfMissing(), deliveryId = throwIfMissing()) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/warehouse?delivery_id=${deliveryId}&facility_id=${facilityId}`,
      authHeader()
    );

    const facility = await handleResponse(response);

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
  } catch (err) {
    throw handleResponse(err, true);
  }
}

const facilityService = {
  fetchMyFacilities,
  fetchFacilityDetail,
  fetchFacilityItems,
  register,

  addItemToWarehouse,
  deleteItemFromWarehouse,

  getSchedules,
  createSchedule,
  deleteSchedule,

  getFacilityByShipment
}

export default facilityService