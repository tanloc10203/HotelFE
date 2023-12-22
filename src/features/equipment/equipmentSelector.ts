import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useEquipment = () => useAppSelector((state) => state.equipment);
export const bedsOptions = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.equipment.dataGroups,
      (data) => {
        if (!data.length) return [];
        return data.map((r) => ({ label: r.name, value: r.id!, quantity: 0 }));
      }
    )
  );
