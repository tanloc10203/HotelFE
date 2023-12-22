import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filters, IDepartment, LoadingState, Pagination, SuccessResponseProp } from "~/types";

interface InitialState {
  data: IDepartment[];
  isLoading: LoadingState;
  error: string;
}

const initialState: InitialState = {
  data: [],
  isLoading: "ready",
  error: "",
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      { payload: { metadata } }: PayloadAction<SuccessResponseProp<IDepartment[], Pagination>>
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

export const departmentActions = departmentSlice.actions;
export default departmentSlice.reducer;
