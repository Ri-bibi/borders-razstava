import type { ReactNode, ReactElement } from "react";
import React, { isValidElement, cloneElement, Children } from "react";

interface InitialLetterProps {
  children: ReactNode;
  Component?: React.ComponentType<{ children: ReactNode }>;
}

export const InitialLetter = ({ children, Component }: InitialLetterProps) => {
  const isObjectWithProps = (
    value: unknown
  ): value is { props: { children: ReactNode } } => {
    return (
      typeof value === "object" &&
      value !== null &&
      "props" in value &&
      typeof (value as any).props === "object" &&
      (value as any).props !== null
    );
  };

  const processInitialLetter = (content: ReactNode): ReactNode => {
    if (typeof content === "string" && content.length > 0) {
      const firstLetter = content[0];
      const remainingText = content.slice(1);

      return (
        <>
          {Component ? (
            <Component>{firstLetter}</Component>
          ) : (
            <span
              style={{
                fontSize: "2em",
                fontWeight: "bold",
                lineHeight: "0.8",
                marginRight: "2px",
                verticalAlign: "text-top",
                color: "#3f51b5",
              }}
            >
              {firstLetter}
            </span>
          )}
          {remainingText}
        </>
      );
    }

    if (isValidElement(content) && isObjectWithProps(content)) {
      return cloneElement(content, {
        ...content.props,
        children: processInitialLetter(content.props.children),
      });
    }

    return content;
  };

  const processedChildren = Children.toArray(children).flatMap((child) => {
    const processed = processInitialLetter(child);
    return Array.isArray(processed) ? processed : [processed];
  });

  return <>{processedChildren}</>;
};
