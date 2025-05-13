import React, {
  isValidElement,
  cloneElement,
  Children,
  type ReactNode,
} from "react";
import { extractTextContent, isReactNodeWithProps } from "./extractContent";

export const ParagraphWrapper = ({ children }: { children: ReactNode }) => {
  const processContent = (content: ReactNode): ReactNode => {
    // Handle special transitional element case
    if (isReactNodeWithProps(content) && content.props?.value !== undefined) {
      const text = extractTextContent(content);
      return text
        .split("\n")
        .filter((p) => p.trim())
        .map((paragraph, index) => <p key={index}>{paragraph}</p>);
    }

    if (typeof content === "string") {
      console.log("String content:", content);

      return content
        .split(/\n+/) // Split on one or more newlines
        .filter((p) => p.trim()) // Remove empty paragraphs
        .map((paragraph, index) => <p key={index}>{paragraph}</p>);
    }

    if (isReactNodeWithProps(content) && content.props.children) {
      return cloneElement(content, {
        ...content.props,
        children: processContent(content.props.children),
      });
    }

    return content;
  };

  const processedChildren = Children.toArray(children).flatMap((child) =>
    processContent(child)
  );

  return <>{processedChildren}</>;
};
