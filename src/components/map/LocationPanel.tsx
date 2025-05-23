import { motion, AnimatePresence } from "framer-motion";
import type { MergedLoc } from "./MapView";
import { generateLocaleLink } from "../langSelect/languageutils";

export const LocationPanel = ({
  selectedPageLoc,
  t,
}: {
  selectedPageLoc: MergedLoc | undefined;
  t: (arg0: string) => string;
}) => {
  return (
    <AnimatePresence>
      {selectedPageLoc && (
        <motion.div
          key="location-panel"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "ease",
            duration: 0.2,
            bounce: 0.1,
          }}
          className="absolute bg-white p-6 px-18 pl-12 bottom-0 right-0 border-t-8 border-brand-blue/20 md:w-fit w-full lg:max-w-prose"
        >
          <div className="max-w-prose">
            <h1 className="font-plex font-bold text-brand-blue/70 lg:text-5xl text-3xl tracking-wide">
              {selectedPageLoc.location.name}
            </h1>
            {selectedPageLoc.page.map((onePage) => (
              <motion.a
                whileHover={{ x: 5 }}
                className="flex lg:mt-16 mt-6 mb-2 lg:mb-6 items-center gap-8"
                href={generateLocaleLink(onePage.url, window.location.pathname)}
              >
                <div className="">
                  <span className="text-brand-blue font-plex font-bold lg:text-3xl text-xl tracking-tight">
                    {}
                    {t(onePage.tKey + ".title1")}
                  </span>
                  <div className="text-brand-beige-dark text-md">
                    {t(onePage.tKey + ".author")}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right text-brand-blue"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
