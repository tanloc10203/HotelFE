import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const roomTypeSelector = createSelector(
  (state: RootState) => state.roomType,
  ({ data }) => {
    if (!data.length) return [];
    return data.map((value) => ({ label: value.name, value: `${value.id!}` }));
  }
);

export const useRoomTypes = () => useAppSelector((state) => state.roomType);
export const useRoomTypeOptions = () => useAppSelector(roomTypeSelector);
