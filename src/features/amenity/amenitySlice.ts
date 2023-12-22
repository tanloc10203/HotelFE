import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  IAmenityResponse,
  LoadingState,
  Pagination,
  ResetFormType,
  SuccessResponseProp,
} from "~/types";

interface AmenitySliceState {
  data: IAmenityResponse[];
  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;
}

const initialState: AmenitySliceState = {
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

const amenitySlice = createSlice({
  name: "amenity",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<IAmenityResponse[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    addDataStart: (state, _: PayloadAction<IAmenityResponse & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataSuccess: (state) => {
      state.isLoading = "success";
    },

    addDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },

    editDataStart: (state, _: PayloadAction<IAmenityResponse & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<IAmenityResponse>) => {
      state.isLoading = "pending";
    },

    restoreDataStart: (state, _: PayloadAction<IAmenityResponse>) => {
      state.isLoading = "pending";
    },

    deleteInTrashStart: (state, _: PayloadAction<IAmenityResponse>) => {
      state.isLoading = "pending";
    },

    deleteDataFailed: (state) => {
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

export const amenityActions = amenitySlice.actions;
export default amenitySlice.reducer;
