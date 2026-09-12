"use client";

import { useState } from "react";

import type { AlertPopupProps } from "../../../components/molecules/alert-popup/AlertPopup";

export type AlertPopupInfoType = Pick<AlertPopupProps, "variant" | "message">;

export function useAlertPopup() {
  const [alertInfo, setAlertInfo] = useState<AlertPopupInfoType>();
  const [state, setState] = useState(false);

  const hideAlert = (): void => {
    setState(false);
  };

  const showAlert = (): void => {
    setState(true);
  };

  return { alertInfo, setAlertInfo, hideAlert, showAlert, state };
}
