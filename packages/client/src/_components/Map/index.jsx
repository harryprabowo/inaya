import React, { useState, useEffect } from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  FeatureGroup,
  LayerGroup,
  LayersControl,
} from "react-leaflet";

import "./style.scss";

import { isNullOrUndefined } from "util";
import { Image } from "react-bootstrap";

const { BaseLayer, Overlay } = LayersControl;

export const MapTooltip = ({ data }) => {
  return (
    <div className="map-tooltip">
      {isNullOrUndefined(data.image) ? null : (
        <>
          <Image src={data.image} rounded />
          <hr />
        </>
      )}
      <span style={{ opacity: 0.5 }}>ID</span><strong> {data.id}</strong>
      <br />
      <span style={{ opacity: 0.5 }}>Name</span><strong> {data.name}</strong>
    </div>
  )
}

const Map = ({ points, routes }) => {
  const DEFAULT_VIEWPORT = {
    center: [-6.2, 106.816666],
    zoom: 6,
  };

  const [markers, setMarkers] = useState(isNullOrUndefined(points) ? [] : points);
  const [lines, setLines] = useState(isNullOrUndefined(routes) ? [] : routes);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  useEffect(() => {
    if (!isNullOrUndefined(points) && points.length !== 0) {
      setMarkers(points)

      const latAvg = points.reduce((acc, { position }) => acc + position[0], 0) / points.length
      const longAvg = points.reduce((acc, { position }) => acc + position[1], 0) / points.length

      setViewport({
        center: [latAvg, longAvg],
        zoom: DEFAULT_VIEWPORT.zoom
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  useEffect(() => {
    if (!isNullOrUndefined(routes) && routes.length !== 0) {
      setLines(routes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes])

  return (
    <div className="map">
      <LeafletMap
        minZoom={2}
        viewport={viewport}
        onViewportChanged={setViewport}
        // ondblclick={() => setViewport(DEFAULT_VIEWPORT)} // TODO: change to buttons
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap.Mapnik" onChange={e => console.log(e)}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <Overlay checked name="Marker with popup">
            <LayerGroup>
              {markers.map(({ position, message, tooltip }, k) => (
                <Marker key={k} position={position}>
                  {isNullOrUndefined(message) ? null : (
                    <Popup>{message}</Popup>
                  )}
                  {isNullOrUndefined(tooltip) ? null : (
                    <Tooltip offset={[0, 20]}>{tooltip}</Tooltip>
                  )}
                </Marker>
              ))}
            </LayerGroup>
            {lines.map((line, i) => (
              <FeatureGroup key={i}>
                <Popup direction="top">
                  {line.popup}
                </Popup>
                {lines.length > 0 ? (
                  <Polyline positions={line.path} />
                ) : null}
              </FeatureGroup>
            ))}
          </Overlay>
        </LayersControl>
      </LeafletMap>
    </div>
  );
};

export default Map;
