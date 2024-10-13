import { HTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof Variants;
};

const Variants = {
  primary: {},
  embossed: {},
  tinted: {},
  ghost: {},
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = "primary" } = props;
  return (
    <button {...props} className={[styles.base, styles[variant]].join(" ")} />
  );
};
