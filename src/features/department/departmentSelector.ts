import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const departmentState = (state: RootState) => state.department;

const departmentDataSelector = createSelector(departmentState, ({ data }) => {
  if (!data.length) return [];
  return data.map((value) => ({ label: value.name, value: value.id! + "" }));
});

export const usePosition = () => useAppSelector(departmentState);
export const useOptionDepartment = () => useAppSelector(departmentDataSelector);
