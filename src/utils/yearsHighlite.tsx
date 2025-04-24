import { Fragment } from "react";
import type { ReactElement } from "react";

export function extractYears(
  text: string,
  YearComponent: (props: { year: string }) => ReactElement
): ReactElement[] {
  const regex = /\b(\d{4})\b/g;
  const parts: ReactElement[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const year = match[1];

    if (lastIndex < match.index) {
      parts.push(
        <Fragment key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </Fragment>
      );
    }

    parts.push(<YearComponent key={`year-${match.index}`} year={year} />);

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Fragment key={`text-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>
    );
  }

  return parts;
}
