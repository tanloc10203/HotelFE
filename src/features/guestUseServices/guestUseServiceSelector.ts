import { useAppSelector } from "~/stores";

export const useGuestUseServiceSelector = () => useAppSelector((state) => state.guestUseService);
