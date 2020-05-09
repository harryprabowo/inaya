import axios from "axios"
import { authHeader, handleResponse } from "~/_helpers";

const fetchNotification = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/notification`,
      authHeader()
    );

    const data = await handleResponse(response);

    return data.map(({ createdAt, updatedAt, ...d }) => ({
      ...d,
      time: new Date(updatedAt)
    }))
  } catch (err) {
    const error = handleResponse(err, true);
    throw error;
  }
};

const notificationService = {
  fetchNotification
}

export default notificationService