import axios from "axios";
import { authHeader, handleResponse } from "~/_helpers";

const getPath = async ([origin, destination]) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/route?start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`,
      authHeader()
    );

    const data = await handleResponse(response);

    data.points.map((point) => point.reverse());

    return data;
  } catch (err) {
    const error = handleResponse(err, true);
    throw error;
  }
};

const mapService = {
  getPath,
};

export default mapService;
