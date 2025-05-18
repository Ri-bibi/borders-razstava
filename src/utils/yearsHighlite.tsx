import { Fragment } from "react";
import type { ReactElement } from "react";
import {
  globalTimeEnd,
  globalTimeStart,
} from "../components/navbar/timelineGlobals";

export function extractYears(
  text: string,
  YearComponent: (props: { year: string }) => ReactElement
): ReactElement[] {
  const regex = /\b(\d{4})\b/g;

  return text
    .split("\n")
    .filter((p) => p.trim())
    .map((paragraph, paragraphIndex) => {
      const parts: ReactElement[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(paragraph)) !== null) {
        const year = match[1];
        const yearNum = parseInt(year, 10);
        // Only extract year if within globalTimeStart and globalTimeEnd (inclusive)
        if (yearNum >= globalTimeStart && yearNum <= globalTimeEnd) {
          if (lastIndex < match.index) {
            parts.push(
              <Fragment key={`text-${paragraphIndex}-${lastIndex}`}>
                {paragraph.slice(lastIndex, match.index)}
              </Fragment>
            );
          }

          parts.push(
            <YearComponent
              key={`year-${paragraphIndex}-${match.index}`}
              year={year}
            />
          );

          lastIndex = regex.lastIndex;
        }
      }

      if (lastIndex < paragraph.length) {
        parts.push(
          <Fragment key={`text-${paragraphIndex}-${lastIndex}`}>
            {paragraph.slice(lastIndex)}
          </Fragment>
        );
      }

      return <p key={`para-${paragraphIndex}`}>{parts}</p>;
    });
}
