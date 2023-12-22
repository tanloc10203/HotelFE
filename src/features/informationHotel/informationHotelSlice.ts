import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  InformationHotelState,
  LoadingState,
  Pagination,
  SuccessResponseProp,
} from "~/types";

interface InitialState {
  data: InformationHotelState[];
  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;

  selected: InformationHotelState | null;
  open: boolean;
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

  selected: null,
  open: false,
};

const informationHotelSlice = createSlice({
  name: "informationHotel",
  initialState,
  reducers: {
    setSelected: (state, { payload }: PayloadAction<InformationHotelState | null>) => {
      state.selected = payload;
    },

    setToggleDialogAddEdit: (state, { payload }: PayloadAction<boolean>) => {
      state.open = payload;
    },

    getDataStart: (state) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<InformationHotelState[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    addDataStart: (
      state,
      _: PayloadAction<{ data: InformationHotelState; resetForm: () => void }>
    ) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataSuccess: (state) => {
      state.isLoading = "success";
      state.selected = null;
      state.open = false;
    },

    addDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },

    editDataStart: (
      state,
      _: PayloadAction<{ data: InformationHotelState; resetForm: () => void }>
    ) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },
  },
});

export const informationHotelActions = informationHotelSlice.actions;
export default informationHotelSlice.reducer;
