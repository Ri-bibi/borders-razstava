import { Map, Marker } from "pigeon-maps";
import type { TileComponent } from "pigeon-maps";
import Container from "../../layouts/Container.astro";

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

export const MapComponent = () => {
  return (
    <div className="">
      <div className="w-full relative">
        <div className="w-full h-full absolute bg-brand-blue/40 z-10 flex items-end px-8 ">
          {/* <div className="lg:max-w-7xl mx-auto  w-full">
          <div className="z-30 flex flex-col gap-12">
            <div className="bg-brand-blue w-fit p-4 py-2 text-white text-end">
              Jure Ramšak
            </div>
            <h1 className="text-8xl font-black text-white font-aleo z-30 max-w-7xl break-normal pb-48 ">
              {title1 + " " + title2}
            </h1>
          </div>
        </div> */}
        </div>
        <Map
          tileComponent={ImgTile}
          height="50vh"
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
    </div>
  );
};
