import { ComponentPropsWithoutRef } from "react";

export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">): React.JSX.Element {
  return (
    <div
      className={`w-full px-4 mx-auto md:w-[95%] lg:w-[90%] xl:w-281.25 ${className}`}
      {...props}
    >
      {props.children}
    </div>
  );
}

export function Row({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">): React.JSX.Element {
  return (
    <div className={`flex ${className}`} {...props}>
      {props.children}
    </div>
  );
}
