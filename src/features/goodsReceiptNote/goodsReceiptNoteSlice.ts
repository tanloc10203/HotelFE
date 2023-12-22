import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  LoadingState,
  Pagination,
  ResetFormType,
  SuccessResponseProp,
  SupplierType,
} from "~/types";
import { GoodsReceiptNote, GoodsReceiptNotePayloadAdd } from "~/types/goodsReceiptNote";

type SupplierState = {
  open: boolean;
  error: string;
  isLoading: LoadingState;
  data: SupplierType[];

  filters: Filters;
  pagination: Pagination;
  selected: SupplierType | null;
};

type GoodsReceiptNoteState = {
  error: string;
  isLoading: LoadingState;
  data: GoodsReceiptNote[];

  filters: Filters;
  pagination: Pagination;

  openAdd: boolean;
};

type InitialState = {
  supplier: SupplierState;
  goodsReceiptNote: GoodsReceiptNoteState;
};

const initialState: InitialState = {
  supplier: {
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
    selected: null,
  },
  goodsReceiptNote: {
    error: "",
    isLoading: "ready",

    openAdd: false,

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
  },
};

export type GetSupplierResponse = SuccessResponseProp<SupplierType[], Pagination>;
export type GetGoodsReceiptNoteResponse = SuccessResponseProp<GoodsReceiptNote[], Pagination>;

const goodsReceiptNoteSlice = createSlice({
  name: "goodsReceiptNote",
  initialState,
  reducers: {
    addSupplierStart: (state, _: PayloadAction<{ data: SupplierType } & ResetFormType>) => {
      state.supplier.isLoading = "pending";
      state.supplier.error = "";
    },
    addSupplierSuccess: (state) => {
      state.supplier.isLoading = "success";
      state.supplier.error = "";
      state.supplier.open = true;
    },
    addSupplierFailed: (state, { payload }: PayloadAction<string>) => {
      state.supplier.isLoading = "error";
      state.supplier.error = payload;
    },

    addGoodsReceiptNoteStart: (state, _: PayloadAction<GoodsReceiptNotePayloadAdd>) => {
      state.goodsReceiptNote.isLoading = "pending";
      state.goodsReceiptNote.error = "";
    },
    addGoodsReceiptNoteSuccess: (state) => {
      state.goodsReceiptNote.isLoading = "success";
      state.goodsReceiptNote.error = "";
      state.goodsReceiptNote.openAdd = false;
    },
    addGoodsReceiptNoteFailed: (state, { payload }: PayloadAction<string>) => {
      state.goodsReceiptNote.isLoading = "error";
      state.goodsReceiptNote.error = payload;
    },

    getDataSupplierStart: (state, _: PayloadAction<Filters>) => {
      state.supplier.isLoading = "pending";
    },

    getDataSupplierSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetSupplierResponse>
    ) => {
      state.supplier.data = metadata;
      state.supplier.isLoading = "success";
      state.supplier.pagination = options!;
    },

    getDataSupplierFailed: (state, { payload }: PayloadAction<string>) => {
      state.supplier.isLoading = "error";
      state.supplier.error = payload;
    },

    setToggleSupplierOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.supplier.open = payload;
    },

    setSelectedSupplier: (state, { payload }: PayloadAction<SupplierType | null>) => {
      state.supplier.selected = payload;
    },

    getGoodsReceiptNoteStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.goodsReceiptNote.isLoading = "pending";
      state.goodsReceiptNote.error = "";
    },
    getGoodsReceiptNoteSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetGoodsReceiptNoteResponse>
    ) => {
      state.goodsReceiptNote.isLoading = "success";
      state.goodsReceiptNote.error = "";

      state.goodsReceiptNote.data = metadata;
      state.goodsReceiptNote.pagination = options!;
    },
    getGoodsReceiptNoteFailed: (state, { payload }: PayloadAction<string>) => {
      state.goodsReceiptNote.isLoading = "error";
      state.goodsReceiptNote.error = payload;
    },

    setToggleAdd: (state, { payload }: PayloadAction<boolean>) => {
      state.goodsReceiptNote.openAdd = payload;
    },
  },
});

export const goodsReceiptNoteActions = goodsReceiptNoteSlice.actions;
export default goodsReceiptNoteSlice.reducer;
