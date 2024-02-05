import { RefObject } from "react";

export const useFocus = (refArray: RefObject<HTMLElement>[]) => {
  const focusNext = (current: number) => {
    const next = (current + 1) % refArray.length;
    refArray[next].current?.focus();
  };

  const focusPrevious = (current: number) => {
    const previous = (current - 1 + refArray.length) % refArray.length;
    refArray[previous].current?.focus();
  };

  return { focusNext, focusPrevious };
};
