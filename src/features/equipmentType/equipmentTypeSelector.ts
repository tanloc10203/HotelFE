import { useAppSelector } from "~/stores";

export const useEquipmentType = () => useAppSelector((state) => state.equipmentType);
