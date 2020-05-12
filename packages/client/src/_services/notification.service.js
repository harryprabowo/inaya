import { config } from "~/_helpers";

const { api } = config

const fetchNotification = async () => {
  const response = await api(true).get(`/notification`);

  return response.map(({ createdAt, updatedAt, ...d }) => ({
    ...d,
    time: new Date(updatedAt)
  }))
};

const notificationService = {
  fetchNotification
}

export default notificationService