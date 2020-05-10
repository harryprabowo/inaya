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

const addItemToWarehouse = async (warehouse_id = throwIfMissing(), items = throwIfMissing()) => {
  try {
    let responses = []

    for (const { item: { id: item_id }, quantity } of items) {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/items/warehouse`,
        { warehouse_id, item_id, quantity },
        authHeader()
      )

      responses.push(await handleResponse(res))
    }

    return Promise.resolve(responses)
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

  getFacilityByShipment
}

export default facilityService