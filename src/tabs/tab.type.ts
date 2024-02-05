import { ReactNode } from "react";

export interface TabProps {
  id: string;
  label: ReactNode;
  className?: string;
}

export enum ALIGN_DIRECTION {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}
