import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Filters,
  GroupEquipment,
  GroupEquipmentArray,
  IEquipmentResponse,
  LoadingState,
  Pagination,
  ResetFormType,
  SuccessResponseProp,
} from "~/types";

interface InitialState {
  data: IEquipmentResponse[];
  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  groups: GroupEquipmentArray;
  dataGroups: IEquipmentResponse[];
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
  groups: [],
  pagination: {
    limit: 5,
    page: 1,
    totalPage: 2,
    totalRows: 10,
  },
  dataGroups: [],
};

const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      {
        payload: { metadata, options },
      }: PayloadAction<SuccessResponseProp<IEquipmentResponse[], Pagination>>
    ) => {
      state.data = metadata;
      state.isLoading = "success";
      state.pagination = options!;
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    getDataGroupsStart: (state) => {
      state.isLoading = "pending";
    },

    getDataGroupsSuccess: (state, { payload }: PayloadAction<GroupEquipmentArray>) => {
      state.groups = payload;
      state.isLoading = "success";
    },

    getDataGroupsFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    getDataGroupsFilterStart: (state, _: PayloadAction<GroupEquipment>) => {
      state.isLoading = "pending";
    },

    getDataGroupsFilterSuccess: (state, { payload }: PayloadAction<IEquipmentResponse[]>) => {
      state.dataGroups = payload;
      state.isLoading = "success";
    },

    addDataStart: (state, _: PayloadAction<IEquipmentResponse & ResetFormType>) => {
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

    editDataStart: (state, _: PayloadAction<IEquipmentResponse & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<IEquipmentResponse>) => {
      state.isLoading = "pending";
    },

    restoreDataStart: (state, _: PayloadAction<IEquipmentResponse>) => {
      state.isLoading = "pending";
    },

    deleteInTrashStart: (state, _: PayloadAction<IEquipmentResponse>) => {
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

export const equipmentActions = equipmentSlice.actions;
export default equipmentSlice.reducer;
