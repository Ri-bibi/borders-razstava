import { Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import { useEffect, useState } from "react";

const ImgTile: TileComponent = ({ tile, tileLoaded }) => (
  <img
    src={tile.url}
    srcSet={tile.srcSet}
    width={tile.width}
    height={tile.height}
    loading={"lazy"}
    onLoad={tileLoaded}
    alt={""}
    style={{
      position: "absolute",
      left: tile.left,
      top: tile.top,
      willChange: "transform",
      transformOrigin: "top left",
      opacity: 1,
      filter: "saturate(0.3)",
    }}
  />
);

export interface MapLocation {
  name: string;
  coords: [number, number];
}

function calculateBoundsZoomAndCenter(
  locations: MapLocation[],
  bounds: { topLeft: [number, number]; bottomRight: [number, number] },
  padding: number = 0.1 // Default padding of 10%
) {
  if (locations.length === 0) {
    return {
      center: [
        (bounds.topLeft[0] + bounds.bottomRight[0]) / 2,
        (bounds.topLeft[1] + bounds.bottomRight[1]) / 2,
      ],
      zoom: 1,
    };
  }

  const latitudes = locations.map((loc) => loc.coords[0]);
  const longitudes = locations.map((loc) => loc.coords[1]);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latPadding = (maxLat - minLat) * padding;
  const lngPadding = (maxLng - minLng) * padding;

  const center: [number, number] = [
    (maxLat + minLat) / 2,
    (maxLng + minLng) / 2,
  ];

  const latDiff = maxLat - minLat + 2 * latPadding;
  const lngDiff = maxLng - minLng + 2 * lngPadding;

  const boundsLatDiff = Math.abs(bounds.bottomRight[0] - bounds.topLeft[0]);
  const boundsLngDiff = Math.abs(bounds.bottomRight[1] - bounds.topLeft[1]);

  const zoom = Math.min(
    Math.log2(boundsLatDiff / latDiff),
    Math.log2(boundsLngDiff / lngDiff)
  );

  return { center, zoom: Math.floor(zoom) };
}

export const MapComponent = ({ locations }: { locations: MapLocation[] }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(11);

  useEffect(() => {
    const bounds: { topLeft: [number, number]; bottomRight: [number, number] } =
      { topLeft: [90, -180], bottomRight: [-90, 180] };
    const { center, zoom } = calculateBoundsZoomAndCenter(
      locations,
      bounds,
      0.0
    );
    setMapCenter(center as [number, number]);
    setMapZoom(zoom);
  }, [locations]);

  return (
    <div className="">
      <div className="w-full relative">
        <div className="w-full h-full absolute bg-brand-blue/15 z-10 flex items-end px-8 "></div>
        <Map
          tileComponent={ImgTile}
          // @ts-expect-error css height works, not only number despite it being whiney
          height="50vh"
          center={mapCenter} // Use dynamic center
          zoom={mapZoom} // Use dynamic zoom
          metaWheelZoom={false}
        >
          {locations.map((location) => {
            return (
              <Marker
                key={location.name}
                width={16}
                anchor={location.coords}
                onClick={() => {
                  console.log(location.name);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-6 bg-brand-blue/40 rounded-full">
                    <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                  </div>
                  <div>
                    <span className="bg-white text-brand-blue px-4 py-1">
                      {location.name}
                    </span>
                  </div>
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>
    </div>
  );
};
