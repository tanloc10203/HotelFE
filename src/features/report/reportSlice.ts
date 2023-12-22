import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  LoadingState,
  RoomTypeMoneyDetailsState,
  ServiceMoneyResponse,
  ServiceMoneyState,
} from "~/types";

export type BoxReportsState = {
  quantityBooking: {
    online: number;
    offline: number;
    inProgress: number;
    canceled: number;
  };

  rateBooking: number;
  moneyRoom: number;
};

type InitialState = {
  isLoading: LoadingState;
  error: string;

  boxReports: BoxReportsState;

  roomTypesDetailsChart: RoomTypeMoneyDetailsState[];

  serviceMoney: {
    products: ServiceMoneyState[];
    services: ServiceMoneyState[];
  };
};

type GetBoxSuccessState = {
  online: number;
  offline: number;
  canceled: number;
  inProgress: number;
  rateBooking: number;
};

const initialState: InitialState = {
  isLoading: "ready",
  error: "",

  boxReports: {
    quantityBooking: {
      online: 0,
      offline: 0,
      inProgress: 0,
      canceled: 0,
    },

    rateBooking: 0,
    moneyRoom: 0,
  },

  roomTypesDetailsChart: [],

  serviceMoney: {
    products: [],
    services: [],
  },
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getBoxReportStart: (state, _: PayloadAction<string>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getBoxReportSuccess: (
      state,
      { payload: { rateBooking, ...other } }: PayloadAction<GetBoxSuccessState>
    ) => {
      state.isLoading = "success";
      state.error = "";
      state.boxReports.quantityBooking = other;
      state.boxReports.rateBooking = rateBooking;
    },
    getBoxReportFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.error = payload;
    },

    getRoomTypeDetailsChartStart: (state, _: PayloadAction<string>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getRoomTypeDetailsChartSuccess: (
      state,
      { payload }: PayloadAction<RoomTypeMoneyDetailsState[]>
    ) => {
      state.isLoading = "success";
      state.error = "";
      state.roomTypesDetailsChart = payload;
    },

    getServiceMoneyStart: (state, _: PayloadAction<{ dateStart: string; dateEnd: string }>) => {
      state.isLoading = "pending";
      state.error = "";
    },

    getServiceMoneySuccess: (state, { payload }: PayloadAction<ServiceMoneyResponse>) => {
      state.isLoading = "success";
      state.error = "";
      state.serviceMoney.products = payload.resultsProducts;
      state.serviceMoney.services = payload.resultsService;
    },
  },
});

export const reportActions = reportSlice.actions;
export default reportSlice.reducer;
