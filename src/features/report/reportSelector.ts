import { useAppSelector } from "~/stores";

export const useReports = () => useAppSelector((state) => state.report);
