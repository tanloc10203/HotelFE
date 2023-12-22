import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAttributes } from "~/contexts/AttributeContext";
import { useUnits } from "~/contexts/UnitContext";
import { appActions } from "~/features/app";
import { serviceActions, useServiceSelector } from "~/features/service";
import { useAppDispatch } from "~/stores";
import { IService, IServicePayload, ModeType, ProductPayload } from "~/types";

const useServiceHelpers = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    errors: { addEdit },
    filters,
    isLoading,
    pagination,
    selected,
  } = useServiceSelector();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [type, setType] = useState("-1");
  const [search, setSearch] = useState("");

  const { getUnits } = useUnits();
  const { getAttributes } = useAttributes();

  const open = Boolean(anchorEl);

  useEffect(() => {
    getUnits();
    getAttributes();
  }, []);

  useLayoutEffect(() => {
    if (type !== "-1") {
      dispatch(serviceActions.getDataStart({ ...filters, service_type_id: type }));
      return;
    }

    dispatch(serviceActions.getDataStart(filters));
  }, [filters, type]);

  const onChangeType = useCallback((values: string) => {
    setType(values);
    dispatch(serviceActions.setFilter({ page: 1, limit: 5 }));
  }, []);

  const initialValues = useMemo((): IServicePayload => {
    if (selected.mode === "edit" && selected.data)
      return {
        ...selected.data,
        // @ts-ignore
        timer: selected.data?.timer || "",
        price_original: selected.data.priceData?.price_original,
        price_sell: selected.data.priceData?.price_sell,
        units: selected.data?.units?.map((r) => ({
          id: r.id,
          is_sell: r.is_sell!,
          unit_id: r.unit_id!,
          price: r.price!,
          quantity: r.quantity!,
          is_default: r.is_default,
        })) || [{ is_sell: true, is_default: true, unit_id: 0 }],
      };

    return {
      name: "",
      desc: "",
      // @ts-ignore
      service_type_id: "",
      note: "",
      // @ts-ignore
      timer: "",
      photo_public: "",
      // @ts-ignore
      price_original: "",
      // @ts-ignore
      price_sell: "",
      units: [{ is_sell: true, is_default: true, unit_id: 0 }],
    };
  }, [selected]);

  const initialValuesProduct = useMemo((): ProductPayload => {
    if (selected.mode === "edit" && selected.data) {
      const { data } = selected;

      return {
        priceData: data.priceData,
        id: data.id,
        name: data.name,
        desc: data?.desc || "",
        service_type_id: data.service_type_id,
        quantity: selected.data.quantity,
        note: data?.note || "",
        min_quantity_product: data.min_quantity_product || 5,
        photo_public: data.photo_public || "",
        price_original: data.priceData?.price_original!,
        price_sell: data.priceData?.price_sell!,
        attributes: data.attributes || [],
        units: selected.data?.units?.map((r) => ({
          id: r.id,
          is_sell: r.is_sell!,
          unit_id: r.unit_id!,
          price: r.price!,
          quantity: r.quantity!,
          is_default: r.is_default,
        })) || [{ is_sell: true, is_default: true, unit_id: 0 }],
      };
    }

    return {
      name: "",
      desc: "",
      service_type_id: "",
      note: "",
      // @ts-ignore
      timer: "",
      photo_public: "",
      // @ts-ignore
      price_original: "",
      // @ts-ignore
      price_sell: "",
      attributes: [],
      units: [{ is_sell: true, is_default: true, unit_id: 0 }],
      min_quantity_product: 5,
      quantity: 0,
    };
  }, [selected]);

  const textsByMode = useMemo(() => {
    if (selected.mode === "edit" && selected.data)
      return { textButton: "Chỉnh sửa dịch vụ", title: "Cập nhật" };
    return { textButton: "Thêm mới dịch vụ", title: "Tạo mới" };
  }, [selected]);

  const textsByModeProduct = useMemo(() => {
    if (selected.mode === "edit" && selected.data)
      return { textButton: "Chỉnh sửa Hàng hóa", title: "Cập nhật" };
    return { textButton: "Thêm mới Hàng hóa", title: "Tạo mới" };
  }, [selected]);

  const isEditMode = useMemo(() => Boolean(selected.mode === "edit" && selected.data), [selected]);

  const handleOnSubmit = useCallback(
    (values: IServicePayload, resetForm: () => void) => {
      dispatch(appActions.openOverplay(`Đang ${isEditMode ? "Cập nhật" : "Thêm"} dữ liệu...`));

      if (isEditMode) {
        const {
          id,
          service_type_id,
          name,
          timer,
          desc,
          note,
          price_original,
          price_sell,
          units,
          photo_public,
          priceData,
        } = values;

        dispatch(
          serviceActions.editDataStart({
            ...{
              id,
              service_type_id,
              name,
              timer,
              desc,
              note,
              price_original,
              price_sell,
              units,
              photo_public,
              price_id: priceData?.id,
            },
            resetForm,
          })
        );
        return;
      }

      dispatch(serviceActions.addDataStart({ ...values, resetForm }));
    },
    [isEditMode]
  );

  const handleOnClick = useCallback(
    (mode: ModeType, data: IService | null, isProduct?: boolean) => {
      if (!mode || !data) return;
      if (mode === "edit") {
        if (isProduct) {
          dispatch(serviceActions.setToggleAddEditProduct(true));
        } else {
          dispatch(serviceActions.setToggleAddEdit(true));
        }
      }

      dispatch(serviceActions.setSelected({ data, mode }));
    },
    []
  );

  const handleCloseModeEdit = useCallback(() => {
    dispatch(serviceActions.setSelected({ data: null, mode: null }));
  }, []);

  const handleOnCloseDialog = useCallback(() => {
    dispatch(serviceActions.setToggleAddEdit(false));
    handleCloseModeEdit();
  }, []);

  const handleClickMenuItem = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenuItem = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOpenFormDialog = useCallback(() => {
    dispatch(serviceActions.setToggleAddEdit(true));
    handleCloseMenuItem();
  }, []);

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(serviceActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleOpenFormDialogAddEditProduct = useCallback(() => {
    dispatch(serviceActions.setToggleAddEditProduct(true));
    handleCloseMenuItem();
  }, []);

  const handleOnCloseDialogAddEditProduct = useCallback(() => {
    dispatch(serviceActions.setToggleAddEditProduct(false));
    handleCloseModeEdit();
  }, []);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(serviceActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  return {
    addEditError: addEdit,
    isLoading,
    data,
    pagination,
    initialValues,
    textsByMode,
    isEditMode,
    anchorEl,
    open,
    textsByModeProduct,
    initialValuesProduct,
    type,
    search,
    handleChangeSearch,
    onChangeType,
    handleOnClick,
    handleOnSubmit,
    handleCloseModeEdit,
    handleOnCloseDialog,
    handleClickMenuItem,
    handleCloseMenuItem,
    handleOpenFormDialog,
    handleChangePage,
    handleOnCloseDialogAddEditProduct,
    handleOpenFormDialogAddEditProduct,
  };
};

export default useServiceHelpers;
