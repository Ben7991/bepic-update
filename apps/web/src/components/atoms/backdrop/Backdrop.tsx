"use client";

import { ComponentPropsWithoutRef } from "react";

export function Backdrop({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">): React.JSX.Element {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen bg-white/30 backdrop-blur-sm z-5 ${className}`}
      {...props}
    />
  );
}
