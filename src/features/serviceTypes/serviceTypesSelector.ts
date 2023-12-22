import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const serviceTypes = createSelector(
  (state: RootState) => state.serviceTypes,
  ({ data }) => {
    if (!data.length) return [];
    return [...data].map((value) => ({
      label: value.name,
      value: `${value.id!}`,
    }));
  }
);

export const useServiceTypesSelector = () => useAppSelector((state) => state.serviceTypes);
export const useServiceTypesOptions = () => useAppSelector(serviceTypes);
