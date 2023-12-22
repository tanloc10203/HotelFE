import { useAppSelector } from "~/stores";

export const useServiceSelector = () => useAppSelector((state) => state.service);
