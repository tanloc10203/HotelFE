import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

const discountState = (state: RootState) => state.discount;

const discountDataSelector = createSelector(discountState, ({ data }) => {
  if (!data.length) return [];
  return data.map((value) => ({ label: value.id, value: value.id! }));
});

export const useDiscount = () => useAppSelector(discountState);
export const useOptionDiscount = () => useAppSelector(discountDataSelector);
