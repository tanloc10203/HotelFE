import { useAppSelector } from "~/stores";

export const useRate = () => useAppSelector((state) => state.rate);
