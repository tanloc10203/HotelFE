import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  LoadingState,
  Pagination,
  SuccessResponseProp,
  TypeEmployeeResponse,
} from "~/types";

interface InitialState {
  data: TypeEmployeeResponse[];
  filters: Filters;
  pagination: Pagination;
  isLoading: LoadingState;
  error: string;
  tabStatus: number;
}

const initialState: InitialState = {
  data: [],
  filters: {
    limit: 5,
    page: 1,
  },
  pagination: {
    limit: 5,
    page: 1,
    totalPage: 2,
    totalRows: 10,
  },
  isLoading: "ready",
  error: "",
  tabStatus: 0,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<TypeEmployeeResponse[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setTabStatus: (state, { payload }: PayloadAction<number>) => {
      state.tabStatus = payload;
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},
  },
});

export const employeeActions = employeeSlice.actions;
export default employeeSlice.reducer;
