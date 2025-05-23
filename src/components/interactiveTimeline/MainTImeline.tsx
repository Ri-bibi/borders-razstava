import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { globalTimeStart, globalTimeEnd } from "../navbar/timelineGlobals";
import { content } from "./content";
import { generateRange } from "./timelineUtils";
import { globalYears } from "./content/global";
import { other, otherRange, type IRangeTimeline } from "./content/other";
import type { Resource } from "i18next";
import { useClientTranslation } from "../../utils/usei18n";
import { chapterRangeTimeline, chapterTimeline } from "./content/chapter";
import { generateLocaleLink } from "../langSelect/languageutils";
import { div } from "framer-motion/client";
import { RangeComponent } from "./RangeComponent";

export interface pagesDump {
  url: string;
  tKey: string;
  index: number;
}

const chapterYears = chapterTimeline.map((obj) => obj.year);
const yearsToMatch = globalYears.concat(other, chapterYears);
const indexed = ["a", "b", "c", "d", "e"];

const chapterRange: IRangeTimeline[] = otherRange.concat(chapterRangeTimeline);

export const MainTimeline = ({
  locale,
  resources,
  pages,
}: {
  locale: string;
  resources: Resource;
  pages: pagesDump[];
}) => {
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>();
  const t = useClientTranslation(locale, resources);

  // Ref for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Store refs for each year element
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!selectedYear || !selectedYearIndex) {
      return;
    }

    const container = scrollContainerRef.current;
    const yearEl = yearRefs.current[selectedYearIndex];
    if (container && yearEl) {
      const scrollLeft = yearEl.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: scrollLeft - (96 / 2 - 26),
        behavior: "smooth",
      });
    }
  }, [selectedYear]);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute bg-white w-1 h-full mx-24"></div>
        <div className="w-full overflow-x-auto flex" ref={scrollContainerRef}>
          <div className="bg-brand-blue lg:py-20 py-8 flex items-center pr-[100vw]">
            {generateRange(globalTimeStart, globalTimeEnd).map((year, i) => {
              return (
                <motion.div
                  className={
                    "flex flex-col px-8 items-center min-w-32 relative "
                  }
                  key={year}
                  ref={(el) => {
                    yearRefs.current[i] = el;
                  }}
                  animate={{
                    opacity: !selectedYear || selectedYear !== year ? 1 : 0.15,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {yearsToMatch.includes(year) && (
                    <>
                      <div
                        onClick={() => {
                          setSelectedYear(year);
                          setSelectedYearIndex(i);
                        }}
                        className={
                          "text-white lg:text-3xl text-2xl font-plex font-bold cursor-pointer pl-8 -mr-8 " +
                          (i % 2 == 0 ? "opacity-0" : "opacity-100")
                        }
                      >
                        {year}
                      </div>
                      <div
                        className={
                          "w-1 h-16 bg-white/30 " +
                          (i % 2 == 0 ? "opacity-0" : "opacity-100")
                        }
                      ></div>
                    </>
                  )}

                  <div className="w-1 h-6 bg-white">
                    {chapterRange
                      .map((range) => range.yearFrom)
                      .includes(year) && (
                      <RangeComponent
                        onClick={(year) => {
                          setSelectedYear(year);
                          setSelectedYearIndex(i);
                        }}
                        range={
                          chapterRange.find((range) => range.yearFrom == year)!
                        }
                        key={year}
                      />
                    )}
                  </div>
                  {yearsToMatch.includes(year) && (
                    <>
                      <div
                        className={
                          "w-1 h-16 bg-white/30 " +
                          (i % 2 == 1 ? "opacity-0" : "opacity-100")
                        }
                      ></div>
                      <div
                        onClick={() => {
                          setSelectedYear(year);
                          setSelectedYearIndex(i);
                        }}
                        className={
                          "text-white lg:text-3xl text-2xl font-plex font-bold pl-8 cursor-pointer -mr-8 " +
                          (i % 2 == 1 ? "opacity-0" : "opacity-100")
                        }
                      >
                        {year}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between pl-24">
        {selectedYear ? <div className="w-1  bg-brand-blue"></div> : <div />}
        <div className="flex flex-col items-end pt-18 pb-12 lg:pb-0 pr-16">
          <h3 className="text-brand-blue font-bold lg:text-6xl text-5xl">
            {t("generic.timeline")}
          </h3>

          <h3 className="lg:text-9xl text-7xl font-bold text-brand-blue  opacity-10  -mt-18 tracking-tight hidden sm:block">
            {t("generic.timeline")}
          </h3>
        </div>
      </div>

      <motion.div
        key={selectedYear}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="pl-16 text-brand-blue font-plex font-bold lg:text-7xl text-5xl py-4"
      >
        {selectedYear}
      </motion.div>

      {selectedYear && (
        <div className="pl-24">
          <motion.div
            initial="hidden"
            animate="visible"
            className="border-l-3 border-brand-blue flex flex-col gap-14 pr-8"
          >
            <>
              <motion.div
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-14 "
              >
                {/* global years */}
                {selectedYear &&
                  globalYears.includes(selectedYear) &&
                  globalYears
                    .filter((year) => year == selectedYear)
                    .map((globalYear, i) => (
                      <motion.div
                        key={globalYear + "-" + i}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              duration: 0.8,
                              ease: "easeOut",
                              staggerChildren: 0.8,
                              delayChildren: 0.2,
                            },
                          },
                        }}
                        className="flex items-start gap-4 max-w-prose lg:text-3xl text-xl font-plex font-light text-black/70"
                      >
                        <div className="w-8 h-0.5 bg-brand-blue/50 mt-4"></div>
                        <div className="">
                          <div className="">
                            {t(`global.${globalYear}${indexed[i]}`)}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                {selectedYear &&
                  other.includes(selectedYear) &&
                  other
                    .filter((year) => year == selectedYear)
                    .map((globalYear, i) => (
                      <motion.div
                        key={globalYear + "-" + i}
                        variants={{
                          delay: {
                            opacity: 300,
                          },
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              duration: 0.8,
                              ease: "easeOut",
                              staggerChildren: 0.8,
                              delayChildren: 0.2,
                            },
                          },
                        }}
                        className="flex items-start gap-4 max-w-prose lg:text-3xl text-xl font-plex  text-brand-blue"
                      >
                        <div className="w-8 h-0.5 bg-brand-blue/50 mt-4"></div>
                        <div className="">
                          <div className="">
                            {t(`other.${globalYear}${indexed[i]}`)}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                {selectedYear &&
                  chapterYears.includes(selectedYear) &&
                  chapterTimeline
                    .filter((chap) => chap.year == selectedYear)
                    .map((chap, i) => (
                      <motion.div
                        key={chap.year + "-chapter-" + i}
                        variants={{
                          stagger: {
                            opacity: 600,
                          },
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              duration: 0.8,
                              ease: "easeOut",
                              staggerChildren: 0.8,
                              delayChildren: 0.2,
                            },
                          },
                        }}
                        className="flex items-start gap-4 lg:text-2xl text-xl "
                      >
                        {/* why the fck do i need manual 2px.... h-0.5 fcks it up randomly */}
                        <div className="w-8 h-[2px] bg-brand-blue/50 mt-4" />
                        <div className="max-w-prose ">
                          <div className="text-brand-blue lg:text-3xl text-xl font-plex font-medium">
                            <p> {t(`chapter.${chap.year}${indexed[i]}`)}</p>

                            <div className="flex gap-8 pt-2">
                              {chap.chapters &&
                                chap.chapters.map((chapter) => {
                                  const page = pages.find(
                                    (page) => page.tKey == chapter
                                  )!;
                                  return (
                                    <div className="pt-2" key={chapter}>
                                      <a
                                        href={generateLocaleLink(
                                          page?.url,
                                          window.location.pathname
                                        )}
                                        className="bg-brand-beige-dark px-8 py-2 text-white text-lg font-bold"
                                      >
                                        {t(`${page.tKey}.title1`)}
                                      </a>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </motion.div>
            </>
          </motion.div>
        </div>
      )}

      {!selectedYear && (
        <div className="w-full flex flex-col justify-center items-center pt-32 gap-8">
          <div className="text-4xl font-plex font-bold text-brand-beige-dark/70">
            {t("generic.noyearselected")}
          </div>
          <div className="font-plex text-brand-beige-dark/70">
            {t("generic.clickyeartosee")}
          </div>
        </div>
      )}
    </div>
  );
};
