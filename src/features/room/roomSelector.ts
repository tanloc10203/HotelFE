import { useAppSelector } from "~/stores";

export const useRoom = () => useAppSelector((state) => state.room);
