import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  Filters,
  IService,
  IServicePayload,
  ImportProductDataType,
  LoadingState,
  ModeType,
  Pagination,
  ProductPayload,
  ResetFormType,
  SuccessResponseProp,
} from "~/types";
import { fNumber } from "~/utils";

interface InitialState {
  data: IService[];
  isLoading: LoadingState;
  errors: {
    addEdit: string;
    get: string;
  };
  filters: Filters;
  pagination: Pagination;
  importProductData: ImportProductDataType[];
  searching: ImportProductDataType[];

  openAddEdit: boolean;
  openAddEditProduct: boolean;
  openAddAttribute: boolean;
  selected: {
    mode: ModeType;
    data: IService | null;
  };
}

const initialState: InitialState = {
  data: [],
  importProductData: [],
  searching: [],

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

  selected: {
    mode: null,
    data: null,
  },

  openAddEdit: false,
  openAddEditProduct: false,
  openAddAttribute: false,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setToggleAddEdit: (state, { payload }: PayloadAction<boolean>) => {
      state.openAddEdit = payload;
    },

    setToggleAddEditProduct: (state, { payload }: PayloadAction<boolean>) => {
      state.openAddEditProduct = payload;
    },

    setToggleAddAttribute: (state, { payload }: PayloadAction<boolean>) => {
      state.openAddAttribute = payload;
    },

    setSelected: (
      state,
      {
        payload,
      }: PayloadAction<{
        mode: ModeType;
        data: IService | null;
      }>
    ) => {
      state.selected = {
        ...state.selected,
        ...payload,
      };
    },

    getDataStart: (state, _: PayloadAction<Filters>) => {
      state.isLoading = "pending";
    },

    getDataSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<SuccessResponseProp<IService[], Pagination>>
    ) => {
      const data = metadata.map((value) => {
        if (value.units?.length) {
          const quantity = value.units.reduce((total, value) => {
            if (Number(value.quantity) > 1) return total;
            return (total += Number(value.quantity_in_stock));
          }, 0);
          return { ...value, quantity };
        }

        return value;
      });

      state.data = data;
      state.isLoading = "success";

      if (options) {
        state.pagination = options;
      }

      if (!metadata.length) state.importProductData = [];
      else {
        const length = metadata.length;
        const results: ImportProductDataType[] = [];

        for (let i = 0; i < length; i++) {
          const service = metadata[i];
          const lengthUnit = service.units?.length || 0;

          for (let j = 0; j < lengthUnit; j++) {
            const unit = service.units![j];

            console.log("====================================");
            console.log(`unit`, { unit, service });
            console.log("====================================");

            results.push({
              ...service,
              unit_id: unit.unit_id,
              unit_name: unit.unitData?.name!,
              unit_service_id: unit.id!,
              unit_is_default: unit.is_default,
              unit_is_sell: unit.is_sell!,
              unit_price:
                !unit.is_default && unit.quantity !== 1
                  ? service.priceData?.price_original
                  : service.priceData?.price_original,
              unit_quantity_in_stock: unit.quantity_in_stock!,
              unit_quantity: unit.quantity || 0,
              quantity_import: 0,
              subTotal_import: 0,
            });
          }
        }

        state.importProductData = results;
      }
    },

    getDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.get = payload;
    },

    pushDataImport: (state, { payload }: PayloadAction<ImportProductDataType>) => {
      state.importProductData = [...state.importProductData, payload];
    },

    searchingDataStart: (state, _: PayloadAction<string>) => {
      state.isLoading = "pending";
      state.errors.get = "";
    },

    resetSearching: (state) => {
      state.searching = [];
    },

    searchingDataSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<SuccessResponseProp<IService[], Pagination>>
    ) => {
      state.isLoading = "success";
      state.errors.get = "";

      const data = metadata.map((value) => {
        if (value.units?.length) {
          const quantity = value.units.reduce((total, value) => {
            if (Number(value.quantity) > 1) return total;
            return (total += Number(value.quantity_in_stock));
          }, 0);
          return { ...value, quantity };
        }

        return value;
      });

      state.data = data;
      state.isLoading = "success";
      state.pagination = options!;

      if (!metadata.length) state.searching = [];
      else {
        const length = metadata.length;
        const results: ImportProductDataType[] = [];

        for (let i = 0; i < length; i++) {
          const service = metadata[i];

          const lengthUnit = service.units?.length || 0;

          for (let j = 0; j < lengthUnit; j++) {
            const unit = service.units![j];

            console.log("====================================");
            console.log(`unit`, { unit, service });
            console.log("====================================");

            results.push({
              ...service,
              unit_id: unit.unit_id,
              unit_name: unit.unitData?.name!,
              unit_service_id: unit.id!,
              unit_is_default: unit.is_default,
              unit_is_sell: unit.is_sell!,
              unit_price:
                !unit.is_default && unit.quantity !== 1
                  ? service.priceData?.price_original
                  : service.priceData?.price_original,
              unit_quantity_in_stock: unit.quantity_in_stock!,
              unit_quantity: unit.quantity || 0,
              quantity_import: 0,
              subTotal_import: 0,
            });
          }
        }

        state.searching = results;
      }
    },

    setDebounceSearchingProduct: (_state, _actions: PayloadAction<string>) => {},

    addDataStart: (state, _: PayloadAction<IServicePayload & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataSuccess: (state) => {
      state.isLoading = "success";
      state.openAddEdit = false;
      state.selected = {
        data: null,
        mode: null,
      };
    },

    addDataFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },

    addDataProductStart: (state, _: PayloadAction<ProductPayload & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    addDataProductSuccess: (state) => {
      state.isLoading = "success";
      state.openAddEditProduct = false;
    },

    addDataProductFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "error";
      state.errors.addEdit = payload;
    },

    editDataStart: (state, _: PayloadAction<IServicePayload & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    editProductStart: (state, _: PayloadAction<ProductPayload & ResetFormType>) => {
      if (state.errors.addEdit) state.errors.addEdit = "";
      state.isLoading = "pending";
    },

    deleteDataStart: (state, _: PayloadAction<IServicePayload>) => {
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

    setRemoveItemImportProduct: (state, { payload }: PayloadAction<string>) => {
      state.importProductData = [
        ...state.importProductData.filter((t) => t.unit_service_id !== payload),
      ];
    },

    setChangeQuantity: (
      state,
      {
        payload: { quantity, unitServiceId },
      }: PayloadAction<{ unitServiceId: string; quantity: number }>
    ) => {
      const index = state.importProductData.findIndex((t) => t.unit_service_id === unitServiceId);

      if (index !== -1) {
        const lastData = [...state.importProductData];

        lastData[index] = {
          ...lastData[index],
          quantity_import: quantity,
          subTotal_import:
            lastData[index].unit_price! * quantity * (lastData[index].unit_quantity || 1),
        };

        state.importProductData = lastData;
      }
    },

    setChangePrice: (
      state,
      { payload: { price, unitServiceId } }: PayloadAction<{ unitServiceId: string; price: number }>
    ) => {
      const index = state.importProductData.findIndex((t) => t.unit_service_id === unitServiceId);

      if (index !== -1) {
        const lastData = [...state.importProductData];

        if (price < lastData[index].priceData?.price_original!) {
          toast.error(
            "Không được phép nhỏ hơn giá vốn. " +
              fNumber(lastData[index].priceData?.price_original || 0)
          );
        } else {
          lastData[index] = {
            ...lastData[index],
            unit_price: price,
            subTotal_import:
              price * lastData[index].quantity_import! * (lastData[index].unit_quantity || 1),
          };
        }

        state.importProductData = lastData;
      }
    },

    setImportProductDataEmpty: (state) => {
      state.importProductData = [];
    },

    setChangeQuantityService: (
      state,
      {
        payload: { quantity, unitServiceId },
      }: PayloadAction<{ unitServiceId: string; quantity: number }>
    ) => {
      const lastData = [...state.importProductData];

      const index = lastData.findIndex((t) => t.unit_service_id === unitServiceId);

      if (Number(lastData[index].unit_quantity_in_stock) - Number(quantity) < 0) return;

      if (index !== -1) {
        lastData[index] = {
          ...lastData[index],
          unit_quantity_in_stock: Number(lastData[index].unit_quantity_in_stock) - Number(quantity),
        };

        state.importProductData = lastData;
      }
    },

    setRemoveQuantityService: (
      state,
      {
        payload: { quantity, unitServiceId },
      }: PayloadAction<{ unitServiceId: string; quantity: number }>
    ) => {
      const lastData = [...state.importProductData];

      const index = lastData.findIndex((t) => t.unit_service_id === unitServiceId);

      if (index !== -1) {
        lastData[index] = {
          ...lastData[index],
          unit_quantity_in_stock: Number(lastData[index].unit_quantity_in_stock) + Number(quantity),
        };

        state.importProductData = lastData;
      }
    },
  },
});

export const serviceActions = serviceSlice.actions;
export default serviceSlice.reducer;
