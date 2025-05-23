import { GeoJson, Map as PigeonMap, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import { useEffect, useMemo, useState } from "react";
import type { MapLocation } from "./Map";
import type { Resource } from "i18next";
import { initializei18nClient } from "../../utils/i18nClient";
import { useClientTranslation } from "../../utils/usei18n";
import { LocationPanel } from "./LocationPanel";

export interface PageLocation {
  url: string;
  tKey: string;
  index: number;
  locations: MapLocation[];
}

export interface MergedLoc {
  page: PageLocation[];
  location: MapLocation;
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
  locale,
  resources,
}: {
  pageLocations: PageLocation[];
  locale: string;
  resources: Resource;
}) => {
  const t = useClientTranslation(locale, resources);
  const [isCentered, setIsCentered] = useState(false);

  const [selectedPageLoc, setSelectedPageLoc] = useState<MergedLoc>();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>([
    46.0770411, 14.6219863,
  ]);

  useEffect(() => {
    if (!selectedPageLoc) {
      setMapCenter(undefined);
      return;
    }

    const typ = selectedPageLoc?.location.type;
    if (typ == "place" || typ == "mountain" || typ == "border") {
      setMapCenter(selectedPageLoc?.location.coords);
      return;
    }

    if (typ == "river" || typ == "street") {
      const [long, lat] =
        selectedPageLoc?.location.gejson.features[0].geometry.coordinates[0];
      setMapCenter([lat, long]);
    }
  }, [selectedPageLoc]);
  const [mapZoom, setMapZoom] = useState<number>(9);

  const convertedLocations = useMemo(() => {
    const locationMap = new Map<
      string,
      { location: MapLocation; pages: Set<PageLocation> }
    >();

    pageLocations.forEach((pageLoc) => {
      pageLoc.locations.forEach((loc) => {
        if (locationMap.has(loc.name)) {
          // Add page to the existing location's pages Set
          locationMap.get(loc.name)!.pages.add(pageLoc);
        } else {
          // Create new entry with a Set containing the page
          locationMap.set(loc.name, {
            location: loc,
            pages: new Set([pageLoc]),
          });
        }
      });
    });

    // Convert the map to an array of the desired format
    return Array.from(locationMap.values()).map((item) => ({
      location: item.location,
      page: Array.from(item.pages), // Convert Set back to array
    }));
  }, []);

  useEffect(() => {
    setIsCentered(false);
  }, [selectedPageLoc]);

  return (
    <div className="">
      <PigeonMap
        twoFingerDrag={true}
        onBoundsChanged={({ center, bounds, zoom }) => {
          setMapZoom(zoom);
          setIsCentered(true);
          if (isCentered) {
            setSelectedPageLoc(undefined);
          }
        }}
        tileComponent={ImgTile}
        zoom={mapZoom}
        // @ts-expect-error css height works, not only number despite it being whiney
        height="100vh"
        center={mapCenter} // Use dynamic center
        metaWheelZoom={false}
        onClick={() => {
          setSelectedPageLoc(undefined);
        }}
      >
        {convertedLocations.map((pageLoc) => {
          const { location, page } = pageLoc;

          if (location.type == "street" || location.type == "river") {
            return (
              <GeoJson
                key={location.name + page[0].index}
                data={location.gejson}
                onClick={() => {
                  setSelectedPageLoc(pageLoc);
                }}
                style={{
                  strokeLinejoin: "round",
                }}
                styleCallback={(feature: any, hover: any) => {
                  return {
                    strokeWidth: "15",
                    stroke: "#00567080",
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
                style={{ pointerEvents: "auto", cursor: "pointer" }}
                key={location.name + page[0].index}
                width={16}
                hover
                anchor={location.coords}
                onClick={() => {
                  setSelectedPageLoc(pageLoc);
                }}
              >
                {(location.type == "place" || location.type == undefined) && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/40 rounded-full">
                      <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 9 && (
                        <span className="bg-white text-brand-blue px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {location.type == "mountain" && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-beige-dark/40 rounded-full">
                      <div className="h-4 w-4 bg-brand-beige-dark rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 9 && (
                        <span className="bg-brand-beige-dark text-white px-4 py-1 opacity-70">
                          {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {location.type == "border" && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full">
                      <div className="h-4 w-4 bg-black/30 rounded-full"></div>
                    </div>
                    <div>
                      {mapZoom > 9 && (
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
      </PigeonMap>

      <LocationPanel selectedPageLoc={selectedPageLoc} t={t} />
    </div>
  );
};
