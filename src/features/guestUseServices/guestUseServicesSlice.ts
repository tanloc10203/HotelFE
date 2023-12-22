import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";
import {
  GuestUseServiceType,
  GuestUseServicesPlusMinusPayload,
} from "~/types/guestUseServices.type";

type InitialState = {
  open: boolean;

  error: string;
  isLoading: LoadingState;
  data: GuestUseServiceType[];

  filters: Filters;
  pagination: Pagination;

  bookingDetailsId: string;
};

const initialState: InitialState = {
  data: [],

  isLoading: "ready",
  error: "",
  open: false,

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

  bookingDetailsId: "",
};

export type GetUseServiceResponse = SuccessResponseProp<GuestUseServiceType[], Pagination>;

const guestUseServiceSlice = createSlice({
  name: "guestUseService",
  initialState,
  reducers: {
    addUseServiceStart: (
      state,
      _: PayloadAction<{ data: GuestUseServiceType; isProduct: boolean }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addUseServiceSuccess: (state, { payload }: PayloadAction<GuestUseServiceType[]>) => {
      state.isLoading = "success";
      state.error = "";
      state.data = payload;
    },
    addUseServiceFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    deleteUseServiceStart: (
      state,
      _: PayloadAction<{ guestUseServiceId: string; isProduct: boolean }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    deleteUseServiceSuccess: (state, { payload }: PayloadAction<GuestUseServiceType[]>) => {
      state.isLoading = "success";
      state.error = "";
      state.data = payload;
    },
    deleteUseServiceFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    plusMinusUseServiceStart: (
      state,
      _: PayloadAction<{ data: GuestUseServicesPlusMinusPayload; isProduct: boolean }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    plusMinusUseServiceSuccess: (state, { payload }: PayloadAction<GuestUseServiceType[]>) => {
      state.isLoading = "success";
      state.error = "";
      state.data = payload;
    },
    plusMinusUseServiceFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetUseServiceResponse>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    setToggleSupplierOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.open = payload;
    },

    setBookingDetailsId: (state, { payload }: PayloadAction<string>) => {
      state.bookingDetailsId = payload;
    },
  },
});

export const guestUseServiceActions = guestUseServiceSlice.actions;
export default guestUseServiceSlice.reducer;
