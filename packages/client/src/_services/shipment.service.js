import axios from "axios";
import { authHeader, handleResponse, argsValidator, Prototype } from "~/_helpers";
import mapService from "./map.service";

const { throwIfMissing } = argsValidator

const fetchShipment = async (id = throwIfMissing()) => {
    try {
        const deliveries = await axios.get(
            `${process.env.REACT_APP_API_URL}/deliveries?id=${id}`,
            authHeader()
        );

        const { status } = await handleResponse(deliveries);

        const route = status.Route
            .split(";")
            .map(e => e.split(","))
            .map(e => e.reverse())
            .map(e => e.map(x => parseFloat(x)))

        const { points } = await mapService.getPath(route)

        return new Prototype.Shipment(
            status.id,
            undefined,
            undefined,
            undefined,
            status.status,
            new Prototype.Route(
                undefined,
                points
            ),
            new Date(status.estimated_time_arrival),
            new Date(status.createdAt),
            new Date(status.updatedAt),
        )
    } catch (err) {
        throw handleResponse(err, true);
    }
};

const shipmentService = {
    fetchShipment,
}

export default shipmentService