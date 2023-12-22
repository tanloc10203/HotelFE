import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filters, IPosition, LoadingState, Pagination, SuccessResponseProp } from "~/types";

interface InitialState {
  data: IPosition[];
  isLoading: LoadingState;
  error: string;
}

const initialState: InitialState = {
  data: [],
  isLoading: "ready",
  error: "",
};

const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      { payload: { metadata } }: PayloadAction<SuccessResponseProp<IPosition[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },
  },
});

export const positionActions = positionSlice.actions;
export default positionSlice.reducer;
