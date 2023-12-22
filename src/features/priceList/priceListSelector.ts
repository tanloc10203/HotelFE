import { useAppSelector } from "~/stores";

export const usePriceList = () => useAppSelector((state) => state.priceList);
