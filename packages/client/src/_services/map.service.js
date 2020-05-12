import { config } from "~/_helpers";

const { api } = config

const getPath = async ([origin, destination]) => {
  const response = await api(true).get(`/route?start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`);
  return response.points.map((point) => point.reverse());
};

const mapService = {
  getPath,
};

export default mapService;
