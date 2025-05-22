import { globalTimeStart, globalTimeEnd } from "../navbar/timelineGlobals";
import { content } from "./content";
import { generateRange } from "./timelineUtils";

export const MainTimeline = () => {
  return (
    <div className="w-full h-full ">
      <div className="w-full overflow-x-auto flex">
        <div className="bg-brand-blue py-32 flex items-center">
          {generateRange(globalTimeStart, globalTimeEnd).map((year, i) => {
            return (
              <div className="flex flex-col px-8  items-center min-w-32">
                {Object.keys(content)
                  .map((year) => parseInt(year))
                  .includes(year) && (
                  <>
                    <div className="text-white text-3xl font-plex font-bold pl-8 -mr-8">
                      {year}
                    </div>
                    <div className="w-1 h-16 bg-white/30"></div>
                  </>
                )}
                <div className="w-1 h-6 bg-white"></div>
                {i % 2 == 0 &&
                  Object.keys(content)
                    .map((year) => parseInt(year))
                    .includes(year) && (
                    <>
                      <div className="w-1 h-16 bg-white/30"></div>
                      <div className="text-white text-3xl font-plex font-bold pl-8 -mr-8">
                        {year}
                      </div>
                    </>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
