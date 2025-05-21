import { GeoJson, Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import { useMemo, useState } from "react";
import type { MapLocation } from "./Map";

export interface PageLocation {
  url: string;
  tKey: string;
  index: number;
  locations: MapLocation[];
}

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

export const MapView = ({
  pageLocations,
}: {
  pageLocations: PageLocation[];
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    46.0770411, 14.6219863,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(99);

  const convertedLocations = useMemo(() => {
    const locs: { page: PageLocation; location: MapLocation }[] = [];

    pageLocations.forEach((pageLoc) => {
      pageLoc.locations.forEach((loc) => {
        locs.push({
          location: loc,
          page: pageLoc,
        });
      });
    });
    return locs;
  }, []);

  return (
    <div className="">
      <Map
        onBoundsChanged={({ center, bounds, zoom }) => {
          setMapZoom(zoom);
        }}
        tileComponent={ImgTile}
        zoom={9}
        // @ts-expect-error css height works, not only number despite it being whiney
        height="100vh"
        center={mapCenter} // Use dynamic center
        metaWheelZoom={false}
        zoomSnap={false}
        limitBounds="center"
      >
        {convertedLocations.map((pageLoc) => {
          const { location, page } = pageLoc;

          if (location.type == "street" || location.type == "river") {
            return (
              <GeoJson
                data={location.gejson}
                styleCallback={(feature: any, hover: any) => {
                  if (feature.geometry.type === "LineString") {
                    return { strokeWidth: "6", stroke: "#005670A0" };
                  }
                  return {
                    fill: "#d4e6ec99",
                    strokeWidth: "1",
                    stroke: "white",
                    r: "20",
                  };
                }}
              />
            );
          }

          if (
            location.type == "border" ||
            location.type == "mountain" ||
            location.type == "place"
          ) {
            return (
              <Marker
                width={16}
                anchor={location.coords}
                onClick={() => {
                  console.log();
                }}
              >
                {(location.type == "place" || location.type == undefined) && (
                  <div className="flex items-center gap-4">
                    <div className="p-6 bg-brand-blue/40 rounded-full">
                      <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 10 && (
                        <span className="bg-white text-brand-blue px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {location.type == "mountain" && (
                  <div className="flex items-center gap-4">
                    <div className="p-6 bg-brand-beige-dark/40 rounded-full">
                      <div className="h-4 w-4 bg-brand-beige-dark rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 10 && (
                        <span className="bg-brand-beige-dark text-white px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {location.type == "border" && (
                  <div className="flex items-center gap-4">
                    <div className="p-6 bg-white rounded-full">
                      <div className="h-4 w-4 bg-black/30 rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 10 && (
                        <span className="bg-white text-black px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Marker>
            );
          }
        })}
      </Map>

      {
        <div className="absolute bg-white p-6 px-48 pl-12 bottom-0 right-0 border-t-8 border-brand-blue/20">
          <div className="max-w-prose">
            <h1 className="font-plex font-bold text-brand-blue/70 text-5xl tracking-wide">
              Reka Kolpa
            </h1>
            <div className="py-1 text-black/50">Preberite več v poglavju:</div>
            <a className="flex mt-8 items-center gap-8" href="">
              <div className="">
                <span className="text-brand-blue font-plex font-bold text-3xl tracking-tight">
                  Ovira in Most
                </span>
                <div className="text-brand-beige-dark text-md">
                  Nina Hofer man
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right text-brand-blue"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
            </a>
          </div>
        </div>
      }
    </div>
  );
};
