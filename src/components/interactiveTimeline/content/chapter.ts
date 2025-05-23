import type { IRangeTimeline } from "./other";

export interface IChapterTimeline {
  year: number;
  chapters: string[];
}

export const chapterTimeline: IChapterTimeline[] = [
  { year: 1948, chapters: ["hunt"] },
  { year: 1952, chapters: ["health"] },
  { year: 1952, chapters: ["contraband"] },
  { year: 1955, chapters: ["sport", "contraband"] },
  { year: 1955, chapters: ["hunt"] },
  { year: 1957, chapters: ["bridge"] },
  { year: 1961, chapters: ["tourism"] },
  { year: 1962, chapters: ["alpeadria"] },
  { year: 1963, chapters: ["tourism"] },
  { year: 1965, chapters: ["politics"] },
  { year: 1965, chapters: ["mount"] },
  { year: 1969, chapters: ["business"] },
  { year: 1969, chapters: ["politics"] },
  { year: 1971, chapters: ["tvkc"] },
  { year: 1972, chapters: ["contraband"] },
  { year: 1972, chapters: ["tourism"] },
  { year: 1978, chapters: ["alpeadria"] },
  { year: 1988, chapters: ["punk"] },
  { year: 1991, chapters: ["politics"] },
  { year: 2015, chapters: ["bridge"] },
  { year: 2023, chapters: ["bridge"] },
  { year: 2023, chapters: ["bridge"] },

  // chapters merge
  { year: 1976, chapters: ["sport"] },
  { year: 1978, chapters: ["sport"] },
];

export interface IChapterRangeTimeline extends IRangeTimeline {
  chapters: string[];
}

export const chapterRangeTimeline: IChapterRangeTimeline[] = [
  { yearFrom: 1976, yearTo: 1992, chapters: ["sport"] },
  { yearFrom: 1978, yearTo: 1994, chapters: ["sport"] },
];
