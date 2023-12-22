import { useAppSelector } from "~/stores";

export const useAmenityType = () => useAppSelector((state) => state.amenityType);
