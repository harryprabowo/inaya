import { config, Prototype, argsValidator } from "~/_helpers";

const { api } = config
const { throwIfMissing } = argsValidator

const getSchedules = async (id = throwIfMissing()) => {
  const response = await api(true).get(`/warehouse/schedule?warehouse_id=${id}`);

  const schedules = response;

  return schedules.map(schedule => new Prototype.Schedule(
    schedule.id,
    new Prototype.Facility(schedule.WarehouseId),
    parseInt(schedule.Hour),
    new Date(schedule.createdAt),
    new Date(schedule.updatedAt),
  ))
}

const createSchedule = async (warehouse_id = throwIfMissing(), hour = throwIfMissing()) => {
  return await api(true).post(
    `/warehouse/schedule`,
    {
      warehouse_id,
      hour
    },
  )
}

const deleteSchedule = async (id = throwIfMissing()) => {
  return await api(true).delete(`/warehouse/schedule?schedule_id=${id}`)
}

const scheduleService = {
  getSchedules,
  createSchedule,
  deleteSchedule,
}

export default scheduleService