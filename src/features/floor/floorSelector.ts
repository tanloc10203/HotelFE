import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const floorSelector = createSelector(
  (state: RootState) => state.floor,
  ({ data }) => {
    if (!data.length) return [];
    return data.map((value) => ({ label: value.name, value: `${value.id!}` }));
  }
);

export const useFloor = () => useAppSelector((state) => state.floor);
export const useFloorOptions = () => useAppSelector(floorSelector);
