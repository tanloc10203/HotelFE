import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filters, LoadingState, Pagination, RateState, SuccessResponseProp } from "~/types";

interface InitialState {
  data: RateState[];

  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };

  filters: Filters;
  pagination: Pagination;
}

const initialState: InitialState = {
  data: [],

  isLoading: "ready",
  errors: {
    addEdit: "",
    get: "",
  },
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
};

const rateSlice = createSlice({
  name: "rate",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      if (state.errors.get) state.errors.get = "";
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<RateState[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    editDataStart: (state, _: PayloadAction<Partial<RateState>>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },
    editDataSuccess: (state) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "success";
    },
    editDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.errors.addEdit = payload;
      state.isLoading = "error";
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},
  },
});

export const rateActions = rateSlice.actions;
export default rateSlice.reducer;
