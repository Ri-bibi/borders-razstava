import { Children, isValidElement, type ReactNode } from "react";

export const isReactNodeWithProps = (
  node: ReactNode
): node is React.ReactElement<{
  children?: ReactNode;
  value?: string | number;
}> => {
  return isValidElement(node) && typeof node.props === "object";
};

export const extractTextContent = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return node.toString();

  if (isReactNodeWithProps(node)) {
    // Handle special transitional element case
    if (node.props?.value !== undefined) {
      return node.props.value.toString();
    }
    if (node.props?.children) {
      return Children.toArray(node.props.children)
        .map(extractTextContent)
        .join("");
    }
  }

  return "";
};
