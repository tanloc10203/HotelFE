import { useAppSelector } from "~/stores";

export const useSnackbar = () => useAppSelector((state) => state.app.snackbar);
export const useOverplay = () => useAppSelector((state) => state.app.overplay);
