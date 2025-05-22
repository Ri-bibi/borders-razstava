import { Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import { useEffect, useState } from "react";
import type { Resource } from "i18next";
import { useClientTranslation } from "../../utils/usei18n";
import { generateLocaleLink } from "../langSelect/languageutils";

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

export interface GeoLocation {
  name: string;
  gejson: any;
  type: "river" | "street";
}
export interface PlaceLocation {
  name: string;
  coords: [number, number];
  type: "place" | "mountain" | "border";
}

export type MapLocation = PlaceLocation | GeoLocation;

function calculateBoundsZoomAndCenter(
  locations: MapLocation[],
  bounds: { topLeft: [number, number]; bottomRight: [number, number] },
  padding: number = 0.1 // Default padding of 10%
) {
  const filteredLocations: PlaceLocation[] = locations.filter(
    (location) =>
      location.type == undefined ||
      location.type == "place" ||
      location.type == "border" ||
      location.type == "mountain"
  ) as PlaceLocation[];

  if (filteredLocations.length === 0) {
    return {
      center: [
        (bounds.topLeft[0] + bounds.bottomRight[0]) / 2,
        (bounds.topLeft[1] + bounds.bottomRight[1]) / 2,
      ],
      zoom: 1,
    };
  }

  if (filteredLocations.length === 1) {
    return {
      center: filteredLocations[0].coords,
      zoom: 10, // Default zoom for a single location
    };
  }

  const latitudes = filteredLocations.map((loc) => loc.coords[0]);
  const longitudes = filteredLocations.map((loc) => loc.coords[1]);

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

export const MapComponent = ({
  locations,
  locale,
  resources,
}: {
  locations: MapLocation[];
  locale: string;
  resources: Resource;
}) => {
  const t = useClientTranslation(locale, resources);
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
      <div className="w-full relative group">
        <div className="w-full h-full absolute bg-brand-blue/15 z-10 flex  px-8 group-hover:bg-brand-blue/40 transtion duration-400 justify-end items-end">
          <a
            className="text-xl text-brand-blue font-plex bg-white  px-18 py-6 font-bold underline tracking-widest opacity-0 group-hover:opacity-100 transtion duration-400 delay-200 mb-16"
            href={generateLocaleLink("/MAP/", window.location.pathname)}
          >
            {t("generic.viewonthemap")}
          </a>
        </div>
        <Map
          tileComponent={ImgTile}
          // @ts-expect-error css height works, not only number despite it being whiney
          height="60vh"
          center={mapCenter} // Use dynamic center
          zoom={mapZoom} // Use dynamic zoom
          metaWheelZoom={false}
        >
          {locations
            .filter(
              (location) =>
                location.type == undefined ||
                location.type == "place" ||
                location.type == "border" ||
                location.type == "mountain"
            )
            .map((location) => {
              return (
                <Marker
                  key={location.name}
                  width={24}
                  // @ts-expect-error but types are all correct due to filtering
                  anchor={location.coords}
                  onClick={() => {
                    console.log(location.name);
                  }}
                >
                  {(location.type == "place" || location.type == undefined) && (
                    <div className="flex items-center gap-4">
                      <div className="p-6 bg-brand-blue/40 rounded-full">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <div>
                        <span className="bg-white text-brand-blue px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {location.type == "mountain" && (
                    <div className="flex items-center gap-4">
                      <div className="p-6 bg-brand-beige-dark/40 rounded-full">
                        <div className="h-4 w-4 bg-brand-beige-dark rounded-full"></div>
                      </div>
                      <div>
                        <span className="bg-brand-beige-dark text-white px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {location.type == "border" && (
                    <div className="flex items-center gap-4">
                      <div className="p-6 bg-white rounded-full">
                        <div className="h-4 w-4 bg-black/30 rounded-full"></div>
                      </div>
                      <div>
                        <span className="bg-white text-brand-white px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      </div>
                    </div>
                  )}
                </Marker>
              );
            })}
        </Map>
      </div>
    </div>
  );
};
