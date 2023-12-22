import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  snackbar: {
    open: boolean;
    duration: number;
    severity: AlertColor;
    text: string;
    vertical: "top" | "bottom";
  };
  overplay: {
    open: boolean;
    text: string;
  };
}

type SnackbarPayload = {
  duration?: number;
  open: boolean;
  severity: AlertColor;
  text: string;
  vertical?: "top" | "bottom";
};

const initialState: InitialState = {
  snackbar: {
    vertical: "top",
    open: false,
    duration: 3000,
    severity: "info",
    text: "",
  },
  overplay: {
    open: false,
    text: "Loading...",
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSnackbar: (state, { payload }: PayloadAction<SnackbarPayload>) => {
      state.snackbar = {
        ...state.snackbar,
        ...payload,
      };
    },

    setCloseSnackbar: (state) => {
      state.snackbar = initialState.snackbar;
    },

    openOverplay: (state, { payload }: PayloadAction<string | undefined>) => {
      state.overplay.text = payload ?? "Loading...";
      state.overplay.open = true;
    },
    closeOverplay: (state) => {
      state.overplay.text = "Loading...";
      state.overplay.open = false;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
