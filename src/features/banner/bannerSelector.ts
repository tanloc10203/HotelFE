import { useAppSelector } from "~/stores";

export const useBanner = () => useAppSelector((state) => state.banner);
