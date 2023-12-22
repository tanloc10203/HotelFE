import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
import {
  BookingDeskTopPayload,
  Filters,
  IBooking,
  IBookingDetail,
  ICustomer,
  IRoomType,
  IRoomTypePayload,
  IRoomTypePayloadEdit,
  LoadingState,
  ModeTimeBookingPrice,
  Pagination,
  RoomsAvailableDesktop,
  RoomsSelected,
  SearchingAvailableDesktopPayload,
  SuccessResponseProp,
} from "~/types";
import { ModeTimeLine } from "~/types/timeline";
import { endDate, startDate } from "~/utils";

export type CheckInOutPayload = {
  type: "check-in" | "check-out";
  value: Dayjs;
};

interface InitialState {
  data: IBooking[];
  roomsAvailable: RoomsAvailableDesktop[];
  roomsSelected: RoomsSelected[];
  isLoading: LoadingState;
  modeTime: ModeTimeBookingPrice;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;
  checkIn: Dayjs;
  checkOut: Dayjs;
  customerBooking: ICustomer | null;
  note: string;

  bookingDetails: IBookingDetail[];
}

const initialState: InitialState = {
  data: [],
  roomsAvailable: [],
  note: "",
  roomsSelected: [],
  isLoading: "ready",
  modeTime: "day",
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
  checkIn: startDate(),
  checkOut: endDate(startDate()),
  customerBooking: null,

  bookingDetails: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      { payload }: PayloadAction<SuccessResponseProp<IBooking[], Pagination>>
    ) => {
      state.data = payload.metadata;
      state.isLoading = "success";

      if (payload?.options) {
        state.pagination = payload.options;
      }
    },

    getDataBookingDetailsStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataBookingDetailsSuccess: (state, { payload }: PayloadAction<IBookingDetail[]>) => {
      state.bookingDetails = payload;
      state.isLoading = "success";
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

    deleteDataFailed: (state) => {
      state.isLoading = "error";
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},

    getRoomAvailableDesktopStart: (state, _: PayloadAction<SearchingAvailableDesktopPayload>) => {
      if (state.errors.get) state.errors.get = "";
      state.isLoading = "pending";
    },
    getRoomAvailableDesktopSuccess: (
      state,
      { payload }: PayloadAction<RoomsAvailableDesktop[]>
    ) => {
      state.isLoading = "success";
      state.roomsAvailable = payload;
    },
    getRoomAvailableDesktopFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    setCheckInOut: (state, { payload: { type, value } }: PayloadAction<CheckInOutPayload>) => {
      if (type === "check-in") {
        state.checkIn = value;
      } else {
        state.checkOut = value;
      }
    },

    setRoomsSelected: (state, { payload }: PayloadAction<RoomsSelected[]>) => {
      state.roomsSelected = payload;
    },

    setModeTime: (state, { payload }: PayloadAction<ModeTimeBookingPrice>) => {
      state.modeTime = payload;
    },
    setCustomerBooking: (state, { payload }: PayloadAction<ICustomer | null>) => {
      state.customerBooking = payload;
    },
    setNote: (state, { payload }: PayloadAction<string>) => {
      state.note = payload;
    },

    bookingDesktopStart: (state, _: PayloadAction<BookingDeskTopPayload>) => {
      state.isLoading = "pending";
      state.errors.addEdit = "";
    },
    bookingDesktopSuccess: (state) => {
      state.isLoading = "success";
      state.errors.addEdit = "";
      state.note = "";
    },
    bookingDesktopFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },
    receiveRoomDesktopStart: (
      state,
      _: PayloadAction<{ data: BookingDeskTopPayload; mode: ModeTimeLine }>
    ) => {
      state.isLoading = "pending";
      state.errors.addEdit = "";
    },
    receiveRoomDesktopSuccess: (state) => {
      state.isLoading = "success";
      state.errors.addEdit = "";
      state.note = "";
      state.customerBooking = null;
      state.roomsSelected = [];
      state.modeTime = "day";
    },
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
