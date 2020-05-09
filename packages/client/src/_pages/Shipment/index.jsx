import React, { useState, useEffect } from "react";

import { shipmentService, droppointService, facilityService } from "~/_services";
import {
  Prototype,
  urlParamHelper as url,
  dateHelper as d,
} from "~/_helpers";
import { isNullOrUndefined } from "util"

import Map, { MapTooltip } from "~/_components/Map";

import "./style.scss";

const Shipment = (props) => {
  let query = url.useQuery();

  const [shipmentData, updateShipmentData] = useState();
  const [points, setPoints] = useState([])
  const [routes, setRoutes] = useState([])

  const fetchShipmentRoute = async (id) => {
    updateShipmentData()
    const facilityId = query.get("facility")

    if (isNullOrUndefined(facilityId)) props.setAlert(new Error("Facility ID missing"))
    else {
      shipmentService.fetchShipment(id)
        .then(async shipment => {
          shipment.facility = await facilityService.getFacilityByShipment(facilityId, shipment.id)
          shipment.droppoint = await droppointService.getDroppointByShipment(shipment.id)
          updateShipmentData(shipment)
        })
        .catch((err) => {
          updateShipmentData(null)
          props.setAlert(err)
        });
    }
  }

  useEffect(() => {
    const id = query.get("id")
    fetchShipmentRoute(isNullOrUndefined(id) ? undefined : id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isNullOrUndefined(shipmentData)) {
      try {
        if (!isNullOrUndefined(shipmentData.droppoint) && !isNullOrUndefined(shipmentData.facility)) {
          setPoints(
            [
              new Prototype.Marker(
                shipmentData.droppoint.position,
                shipmentData.droppoint.name,
                <MapTooltip data={shipmentData.droppoint} />
              ),
              new Prototype.Marker(
                shipmentData.facility.position,
                shipmentData.facility.name,
                <MapTooltip data={shipmentData.facility} />
              ),
            ]
          )
        }
      } catch (err) {
        props.setAlert(err)
      }

      setRoutes(isNullOrUndefined(shipmentData.route)
        ? []
        : [
          {
            path: shipmentData.route.path,
            popup: (
              <div className="map-tooltip">
                <span style={{ opacity: 0.5 }}>Departed</span><strong> {d.getShortDate(shipmentData.date)} - {d.getTimeString(shipmentData.date)}</strong>
                <br />
                <span style={{ opacity: 0.5 }}>ETA</span><strong> {d.getShortDate(shipmentData.date)} - {d.getTimeString(shipmentData.date)}</strong>
                <br />
                <span style={{ opacity: 0.5 }}>Last update</span><strong> {d.getShortDate(shipmentData.date)} - {d.getTimeString(shipmentData.date)}</strong>
              </div>
            )
          }
        ]
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentData])

  return (
    <div id="shipment">
      <Map points={points} routes={routes} {...props} />
    </div>
  );
};

export default Shipment;
