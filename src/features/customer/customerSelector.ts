import { useAppSelector, type RootState } from "~/stores";

export const useCustomer = () => useAppSelector((rootState: RootState) => rootState.customer);
