import { useAppSelector, type RootState } from "~/stores";

export const useEmployee = () => useAppSelector((rootState: RootState) => rootState.employee);
