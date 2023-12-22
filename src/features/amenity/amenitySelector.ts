import { useAppSelector } from "~/stores";

export const useAmenity = () => useAppSelector((state) => state.amenity);
