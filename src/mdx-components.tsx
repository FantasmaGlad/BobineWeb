import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/components/CodeBlock";

const components: MDXComponents = {
  pre: (props) => <CodeBlock {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

