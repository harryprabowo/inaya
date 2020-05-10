import axios from "axios"
import { authHeader, handleResponse, Prototype, argsValidator } from "~/_helpers";

const { throwIfMissing } = argsValidator

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

const scheduleService = {
  getSchedules,
  createSchedule,
  deleteSchedule,
}

export default scheduleService