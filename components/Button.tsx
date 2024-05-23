import { HTMLAttributes } from "react";

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof Variants;
};

const Variants = {
  primary: {
    style: {
      color: "#FF002F",
    },
  },
  embossed: {
    style: {
      color: "#FF002F",
      background: "transparent",
      boxShadow:
        "0px 0.6021873017743928px 0.6021873017743928px -1.3333333333333333px rgba(0, 0, 0, 0.19), 0px 2.288533303243457px 2.288533303243457px -2.6666666666666665px rgba(0, 0, 0, 0.16567), 0px 10px 10px -4px rgba(0, 0, 0, 0.05), inset 0px 20px 12px 0px rgba(255, 255, 255, 0.2), inset 0px -3px 7px 0px rgba(66, 42, 42, 0.08)",
    },
  },
  tinted: {
    style: {
      background: "rgba(0, 0, 0, 0.2)",
    },
  },
  ghost: {
    style: {},
  },
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = "primary" } = props;
  return (
    <button
      {...props}
      style={{
        appearance: "none",
        border: "none",
        backgroundColor: "transparent",
        color: "inherit",
        fontFamily: "inherit",
        fontSize: "var(--font-size-button)",
        cursor: "pointer",
        padding: "16px 48px 16px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        borderRadius: 100,
        ...Variants[variant].style,
        ...props.style,
      }}
    />
  );
};
