import { CSSProperties, ReactNode } from "react";
import styles from "./Content.module.css";
import Markdown from "react-markdown";

export const TextBlock: React.FC<{
  children: string | ReactNode;
  style?: CSSProperties;
}> = (props) => (
  <div className={styles.content} style={props.style}>
    {typeof props.children === "string" ? (
      <Markdown
        components={{
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {props.children}
      </Markdown>
    ) : (
      props.children
    )}
  </div>
);
