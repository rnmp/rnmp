import React from "react";
import type { HTMLAttributes } from "react";

type VStackProps = HTMLAttributes<HTMLDivElement> & {};

export const VStack: React.FC<VStackProps> = (props) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1em",
        ...props.style,
      }}
    />
  );
};

type HStackProps = HTMLAttributes<HTMLDivElement> & {};

export const HStack: React.FC<HStackProps> = (props) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: "1em",
        ...props.style,
      }}
    />
  );
};
