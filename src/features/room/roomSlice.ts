import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  FrontDesk,
  FrontDeskTimeline,
  IRoomResponse,
  LoadingState,
  Pagination,
  RoomAddDiscount,
  RoomPayloadAdd,
  SuccessResponseProp,
} from "~/types";

interface InitialState {
  data: IRoomResponse[];

  dataFrontDesk: FrontDesk[];
  dataFrontDeskTimeline: FrontDeskTimeline[];

  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;

  openDialogAddFloor: boolean;
}

const initialState: InitialState = {
  data: [],

  dataFrontDeskTimeline: [],
  dataFrontDesk: [],

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

  openDialogAddFloor: false,
};

const roomSlice = createSlice({
  name: "room",
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
      }: PayloadAction<SuccessResponseProp<IRoomResponse[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFrontDeskStart: (state) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      if (state.errors.get) state.errors.get = "";
      state.isLoading = "pending";
    },

    resetData: (state) => {
      state.dataFrontDesk = [];
      state.dataFrontDeskTimeline = [];
    },

    getDataFrontDeskSuccess: (state, { payload }: PayloadAction<FrontDesk[]>) => {
      state.dataFrontDesk = payload;
      state.isLoading = "success";
    },

    getDataFrontDeskTimelineStart: (
      state,
      _: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      if (state.errors.get) state.errors.get = "";
      state.isLoading = "pending";
    },

    getDataFrontDeskTimelineSuccess: (state, { payload }: PayloadAction<FrontDeskTimeline[]>) => {
      state.dataFrontDeskTimeline = payload;
      state.isLoading = "success";
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    addDataStart: (state, _: PayloadAction<RoomPayloadAdd>) => {
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

    addDiscountStart: (state, _: PayloadAction<RoomAddDiscount>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    editDataStart: (state, _: PayloadAction<RoomPayloadAdd>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<IRoomResponse>) => {
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

    setToggleDialogAddFloor: (state, { payload }: PayloadAction<boolean>) => {
      state.openDialogAddFloor = payload;
    },
  },
});

export const roomActions = roomSlice.actions;
export default roomSlice.reducer;
