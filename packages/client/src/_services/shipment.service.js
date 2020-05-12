import { config, argsValidator, Prototype } from "~/_helpers";
import mapService from "./map.service";

const { api } = config
const { throwIfMissing } = argsValidator

const fetchShipment = async (id = throwIfMissing()) => {
    const deliveries = await api(true).get(`/deliveries?id=${id}`);

    const { status } = deliveries;

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
};

const shipmentService = {
    fetchShipment,
}

export default shipmentService