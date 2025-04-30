import React from "react";

import cn from "../../utils/classnames.ts";
import Loader from "../misc/Loader.tsx";

interface ButtonBase {
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

interface ButtonButton extends ButtonBase {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export type ButtonProps = ButtonButton;

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  loading = false,
  disabled = false,
  ...props
}) => {
  className = cn(
    className,
    "rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 inline-flex gap-4 items-center justify-center",
    {
      "cursor-not-allowed pointer-events-none opacity-80": loading || disabled,
    }
  );

  return (
    <button onClick={props.onClick} className={className} disabled={loading}>
      {loading ? <Loader /> : null}
      {children}
    </button>
  );
};

export default Button;
