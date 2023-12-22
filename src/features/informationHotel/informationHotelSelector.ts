import { useAppSelector } from "~/stores";

export const useInformationHotel = () => useAppSelector((state) => state.informationHotel);
