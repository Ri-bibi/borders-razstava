import { GeoJson, Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import { useState } from "react";
import type { MapLocation } from "./Map";

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
      filter: "saturate(0.5)",
    }}
  />
);

const locations = [{}];

const kolpa = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [14.689342, 45.491092],
          [14.691722, 45.491159],
          [14.692748, 45.492487],
          [14.692504, 45.493918],
          [14.698553, 45.494965],
          [14.701457, 45.496817],
          [14.701017, 45.505506],
          [14.703856, 45.510774],
          [14.701395, 45.515511],
          [14.703664, 45.517223],
          [14.699924, 45.525529],
          [14.70313, 45.528291],
          [14.701507, 45.532858],
          [14.71057, 45.533624],
          [14.723408, 45.533462],
          [14.731576, 45.528526],
          [14.735253, 45.530237],
          [14.737687, 45.524778],
          [14.760104, 45.510159],
          [14.769941, 45.512548],
          [14.768071, 45.505698],
          [14.786442, 45.506826],
          [14.78652, 45.501695],
          [14.78931, 45.499996],
          [14.795926, 45.503452],
          [14.803718, 45.495401],
          [14.798545, 45.491577],
          [14.800403, 45.48833],
          [14.805304, 45.487014],
          [14.804976, 45.479343],
          [14.816224, 45.45939],
          [14.868332, 45.466997],
          [14.892168, 45.477409],
          [14.910235, 45.480612],
          [14.914239, 45.507665],
          [14.921072, 45.52695],
          [14.951415, 45.518226],
          [14.985323, 45.496754],
          [15.014466, 45.4992],
          [15.026586, 45.484507],
          [15.055568, 45.494585],
          [15.086862, 45.482681],
          [15.087448, 45.468512],
          [15.138427, 45.443253],
          [15.160328, 45.424891],
          [15.180586, 45.427954],
          [15.19154, 45.436919],
          [15.200845, 45.431016],
          [15.226291, 45.427295],
          [15.274525, 45.466807],
          [15.343889, 45.458574],
          [15.392163, 45.494448],
          [15.343499, 45.505489],
          [15.307363, 45.536442],
          [15.300289, 45.577189],
          [15.282993, 45.607219],
          [15.305363, 45.618336],
          [15.302172, 45.630833],
          [15.353549, 45.637751],
          [15.34238, 45.646452],
          [15.389289, 45.640205],
          [15.403969, 45.646675],
          [15.443539, 45.646452],
          [15.454389, 45.630387],
          [15.476088, 45.625031],
          [15.466515, 45.614988],
          [15.502256, 45.619229],
          [15.513105, 45.628825],
          [15.50417, 45.614764],
          [15.535762, 45.604719],
          [15.535762, 45.604719],
          [15.517367, 45.559659],
          [15.533923, 45.515851],
        ],
      },
    },
  ],
};

export const MapView = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    46.0770411, 14.6219863,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(9);

  return (
    <div className="">
      <Map
        tileComponent={ImgTile}
        // @ts-expect-error css height works, not only number despite it being whiney
        height="100vh"
        center={mapCenter} // Use dynamic center
        zoom={mapZoom} // Use dynamic zoom
        metaWheelZoom={false}
        zoomSnap={false}
        limitBounds="center"
      >
        <Marker
          width={16}
          anchor={mapCenter}
          onClick={() => {
            console.log();
          }}
        >
          <div className="flex items-center gap-4 cursor-pointer z-500">
            <div className="p-6 border-1 bg-brand-blue/10 border-brand-blue rounded-full">
              <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
            </div>
          </div>
        </Marker>

        <GeoJson
          data={kolpa}
          styleCallback={(feature, hover) => {
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
        {/* {locations.map((location) => {
            return (
            );
          })} */}
      </Map>
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
    </div>
  );
};
