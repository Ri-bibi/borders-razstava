import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import parse from "html-react-parser";

const processNodes = (
  node: ReactNode,
  processFn: (strIn: string) => ReactNode
): ReactNode => {
  // if node is a string, process it
  if (typeof node === "string") {
    return processFn(node);
  }

  // if node is an array, process each child
  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {processNodes(child, processFn)}
      </React.Fragment>
    ));
  }

  // if node is a valid React element, process its children
  if (React.isValidElement(node)) {
    const { type, props } = node as any;

    // Handle Astro slot string case
    if (
      props.value &&
      typeof props.value === "object" &&
      props.value[Symbol.for("astro:slot-string")]
    ) {
      const htmlContent = String(props.value);
      // Parse the HTML and recursively process each node

      return processNodes(parse(htmlContent), processFn);
    }

    // Handle special case for <p> elements
    if (type === "p") {
      const paragraphs = React.Children.toArray(props.children)
        .map((child) => processNodes(child, processFn))
        .flatMap((child) =>
          typeof child === "string"
            ? child.split("\n").map((p, index) => <p key={index}>{p}</p>)
            : child
        );
      return React.cloneElement(node, { ...props, children: paragraphs });
    }

    // Process the children of the node
    return React.cloneElement(node, {
      ...props,
      children: processNodes(props.children, processFn),
    });
  }

  // Return the node as-is if none of the above conditions match
  return node;
};

interface ElementTransformProps extends PropsWithChildren {}

// Main component
export const ElementTransform = ({ children }: ElementTransformProps) => {
  const processFn = (strIn: string) => {
    // Example transformation: wrap each word in a span
    return strIn.split(" ").map((word, index) => (
      <span key={index} style={{ color: "blue" }}>
        {word}
      </span>
    ));
  };

  const processedChildren = processNodes(children, processFn);

  return <>{processedChildren}</>;
};
