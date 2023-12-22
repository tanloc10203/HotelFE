import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";
import { PriceListState } from "~/types/priceList.model";

interface PriceListSateRD {
  data: PriceListState[];
  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;

  dataDiscounts: PriceListState[];
  filtersDiscount: Filters;
  paginationDiscount: Pagination;

  openAddEdit: boolean;
  openSeeDetails: boolean;
  selected: PriceListState | null;

  openSeeDetailsDiscount: boolean;
  openAddEditDiscount: boolean;
  selectedDiscount: PriceListState | null;
}

const initialState: PriceListSateRD = {
  data: [],
  dataDiscounts: [],

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

  filtersDiscount: {
    limit: 5,
    page: 1,
  },
  paginationDiscount: {
    limit: 5,
    page: 1,
    totalPage: 2,
    totalRows: 10,
  },

  openAddEdit: false,
  openSeeDetails: false,
  selected: null,

  openSeeDetailsDiscount: false,
  openAddEditDiscount: false,
  selectedDiscount: null,
};

const priceListSlice = createSlice({
  name: "priceList",
  initialState,
  reducers: {
    setToggleOpenAddEdit: (state, { payload }: PayloadAction<boolean>) => {
      state.openAddEdit = payload;
    },

    setToggleOpenSeeDetails: (state, { payload }: PayloadAction<boolean>) => {
      state.openSeeDetails = payload;
    },

    setSelected: (state, { payload }: PayloadAction<PriceListState | null>) => {
      state.selected = payload;
    },

    setToggleOpenAddEditDiscount: (state, { payload }: PayloadAction<boolean>) => {
      state.openAddEditDiscount = payload;
    },

    setToggleOpenSeeDetailsDiscount: (state, { payload }: PayloadAction<boolean>) => {
      state.openSeeDetailsDiscount = payload;
    },

    setSelectedDiscount: (state, { payload }: PayloadAction<PriceListState | null>) => {
      state.selectedDiscount = payload;
    },

    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<PriceListState[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataDiscountStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataDiscountSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<PriceListState[], Pagination>>
    ) => {
      state.dataDiscounts = metadata;
      state.isLoading = "success";
      state.paginationDiscount = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    addDataStart: (state, _: PayloadAction<{ data: PriceListState; resetForm: () => void }>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataSuccess: (state) => {
      state.isLoading = "success";
      state.selected = null;
      state.openAddEdit = false;
    },

    addDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },

    editDataStart: (state, _: PayloadAction<{ data: PriceListState; resetForm: () => void }>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataDiscountStart: (
      state,
      _: PayloadAction<{ data: PriceListState; resetForm: () => void }>
    ) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataDiscountSuccess: (state) => {
      state.isLoading = "success";
      state.selectedDiscount = null;
      state.openAddEditDiscount = false;
    },

    editDataDiscountStart: (
      state,
      _: PayloadAction<{ data: PriceListState; resetForm: () => void }>
    ) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<PriceListState>) => {
      state.isLoading = "pending";
    },

    restoreDataStart: (state, _: PayloadAction<PriceListState>) => {
      state.isLoading = "pending";
    },

    deleteInTrashStart: (state, _: PayloadAction<PriceListState>) => {
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

    setFilterDiscount: (state, { payload }: PayloadAction<Filters>) => {
      state.filtersDiscount = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},
  },
});

export const priceListActions = priceListSlice.actions;
export default priceListSlice.reducer;
