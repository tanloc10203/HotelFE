import { useAppSelector } from "~/stores";

export const useBookingSelector = () => useAppSelector((state) => state.booking);
