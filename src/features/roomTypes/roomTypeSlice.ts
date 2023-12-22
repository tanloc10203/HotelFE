import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  IRoomType,
  IRoomTypePayload,
  IRoomTypePayloadEdit,
  IRoomTypeResponse,
  LoadingState,
  Pagination,
  SuccessResponseProp,
} from "~/types";

interface InitialState {
  data: IRoomTypeResponse[];
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

const roomTypeSlice = createSlice({
  name: "roomType",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<IRoomTypeResponse[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    addDataStart: (state, _: PayloadAction<IRoomTypePayload>) => {
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

    editDataStart: (state, _: PayloadAction<IRoomTypePayloadEdit>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<IRoomType>) => {
      state.isLoading = "pending";
    },

    restoreDataStart: (state, _: PayloadAction<IRoomType>) => {
      state.isLoading = "pending";
    },

    deleteInTrashStart: (state, _: PayloadAction<IRoomType>) => {
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

export const roomTypeActions = roomTypeSlice.actions;
export default roomTypeSlice.reducer;
