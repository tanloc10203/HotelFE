import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  LoadingState,
  Pagination,
  SuccessResponseProp,
  ICustomer,
  CustomerPayload,
} from "~/types";

interface InitialState {
  data: ICustomer[];
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

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addFrontDeskStart: (
      state,
      _: PayloadAction<{ data: CustomerPayload; resetForm: () => void }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },

    addFrontDeskSuccess: (state) => {
      state.isLoading = "success";
      state.error = "";
    },

    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<ICustomer[], Pagination>>
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

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
