import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const positionState = (state: RootState) => state.position;

const positionDataSelector = createSelector(positionState, ({ data }) => {
  if (!data.length) return [];
  return data.map((value) => ({ label: value.name, value: value.id! }));
});

export const usePosition = () => useAppSelector(positionState);
export const useOptionPosition = () => useAppSelector(positionDataSelector);
