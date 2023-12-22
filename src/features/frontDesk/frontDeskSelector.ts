import { useAppSelector } from "~/stores";

export const useFrontDeskSelector = () => useAppSelector((state) => state.frontDesk);
