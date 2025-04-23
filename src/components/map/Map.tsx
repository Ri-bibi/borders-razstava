import { Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";

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
      filter: "grayscale(1)",
      mixBlendMode: "color-burn",
    }}
  />
);

export const MapComponent = ({ title }: { title: string }) => {
  return (
    <div className="w-full relative">
      <div className="w-full h-full absolute bg-brand-blue/30 z-10 flex items-end justify-center ">
        <div className="z-30 px-8 lg:hidden pb-16">
          <h1 className="text-8xl font-black text-white font-aleo z-30 text-center">
            {title}
          </h1>
        </div>
      </div>
      <Map
        tileComponent={ImgTile}
        height="70vh"
        defaultCenter={[46.1797619, 13.7337097]}
        metaWheelZoom={false}
        defaultZoom={12}
      >
        <Marker width={16} anchor={[46.1797619, 13.7337097]}>
          <div className="p-6 bg-brand-blue/40 rounded-full">
            <div className="p-6 bg-brand-blue/40 rounded-full">
              <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
};
