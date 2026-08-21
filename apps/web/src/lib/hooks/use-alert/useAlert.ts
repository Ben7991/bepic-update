"use client";

import { useState } from "react";

import type { AlertProps } from "../../../components/molecules/alert/Alert";

export type AlertInfoType = Pick<AlertProps, "variant" | "message">;

export function useAlert() {
  const [alertInfo, setAlertInfo] = useState<AlertInfoType>();
  const [state, setState] = useState(false);

  const hideAlert = (): void => {
    setState(false);
  };

  const showAlert = (): void => {
    setState(true);
  };

  return { alertInfo, setAlertInfo, hideAlert, showAlert, state };
}
