import React, {
  type ReactNode,
  isValidElement,
  cloneElement,
  Children,
} from "react";
import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element as DomElement,
} from "html-react-parser";

interface YearComponentProps {
  children: ReactNode | string;
  highlightStyle?: React.CSSProperties;
}

const YEAR_REGEX = /\b(\d{4})\b/g;

// Wrap years in text with spans
function wrapYears(text: string, style?: React.CSSProperties): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = YEAR_REGEX.exec(text)) !== null) {
    const [full, year] = match;
    if (last < match.index) parts.push(text.slice(last, match.index));
    parts.push(
      <span
        key={`year-${match.index}-${year}`}
        style={{
          backgroundColor: "yellow",
          padding: "0 2px",
          borderRadius: 2,
          ...style,
        }}
      >
        {year}
      </span>
    );
    last = match.index + full.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : [text];
}

// Recursive node processor
function processNode(node: ReactNode, style?: React.CSSProperties): ReactNode {
  if (typeof node === "string") {
    return wrapYears(node, style);
  }
  if (Array.isArray(node)) {
    return node.flatMap((child, idx) => (
      <React.Fragment key={idx}>{processNode(child, style)}</React.Fragment>
    ));
  }
  if (isValidElement(node)) {
    const { type, props } = node as any;

    // Handle Astro StaticHtml: parse its raw HTML
    if (props.value && typeof props.value === "string") {
      const options: HTMLReactParserOptions = {
        replace: (domNode) => {
          if (domNode instanceof DomElement) {
            // Process children of parsed element
            const children = domToReact(domNode.children, options);
            const element = React.createElement(
              domNode.name,
              domNode.attribs || {},
              children
            );
            return processNode(element, style);
          } else if ((domNode as any).type === "text") {
            return wrapYears((domNode as any).data, style);
          }
        },
      };
      const parsed = parse(props.value, options);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr;
    }

    // handle the case where props.children is undefined and the node is not a string
    if (props.children === undefined) {
      return node;
    }
    // Handle special transitional element case
    if (props.value !== undefined) {
      const text = props.value.toString();
      const wrapped = wrapYears(text, style);
      return cloneElement(node, {
        ...props,
        children: wrapped,
      });
    }
    // Handle special case for <p> elements
    if (type === "p") {
      const paragraphs = Children.toArray(props.children)
        .map((child) => processNode(child, style))
        .flatMap((child) =>
          typeof child === "string"
            ? child
                .split("\n")
                .map((p, index) => <p key={index}>{wrapYears(p, style)}</p>)
            : child
        );
      return cloneElement(node, { ...props, children: paragraphs });
    }

    // For any other element (DOM or custom), recurse into children
    const childNodes = Children.toArray(props.children);
    const processedChildren = childNodes.flatMap((child) =>
      processNode(child, style)
    );
    return cloneElement(node, { ...props, children: processedChildren });
  }
  return node;
}

// Main component
export const YearComponent: React.FC<YearComponentProps> = ({
  children,
  highlightStyle,
}) => {
  const initialNodes =
    typeof children === "string" ? [children] : Children.toArray(children);
  const output = initialNodes.flatMap((node) =>
    processNode(node, highlightStyle)
  );
  return <>{output}</>;
};
