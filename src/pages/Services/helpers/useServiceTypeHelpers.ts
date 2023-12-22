import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { serviceTypesActions, useServiceTypesSelector } from "~/features/serviceTypes";
import { useAppDispatch } from "~/stores";
import { IServiceType } from "~/types";

type ModeType = "edit" | "delete" | null;

const useServiceTypeHelpers = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    errors: { addEdit },
    filters,
    isLoading,
    pagination,
  } = useServiceTypesSelector();
  const { severity } = useSnackbar();
  const [selected, setSelected] = useState<{
    mode: ModeType;
    data: IServiceType | null;
  }>({
    mode: null,
    data: null,
  });

  useEffect(() => {
    if (severity !== "success") return;
    setSelected({ data: null, mode: null });
  }, [severity]);

  useLayoutEffect(() => {
    dispatch(serviceTypesActions.getDataStart(filters));
  }, [filters]);

  const initialValues = useMemo((): IServiceType => {
    if (selected.mode === "edit" && selected.data) return selected.data;

    return {
      name: "",
      desc: "",
    };
  }, [selected]);

  const textsByMode = useMemo(() => {
    if (selected.mode === "edit" && selected.data)
      return { textButton: "Chỉnh sửa", title: "Cập nhật" };
    return { textButton: "Thêm mới", title: "Tạo mới" };
  }, [selected]);

  const isEditMode = useMemo(() => Boolean(selected.mode === "edit" && selected.data), [selected]);

  const handleOnSubmit = useCallback(
    (values: IServiceType, resetForm: () => void) => {
      if (isEditMode) {
        dispatch(
          serviceTypesActions.editDataStart({
            name: values.name,
            desc: values.desc,
            id: values.id,
            resetForm,
          })
        );
        return;
      }

      dispatch(serviceTypesActions.addDataStart({ ...values, resetForm }));
    },
    [isEditMode]
  );

  const handleOnClick = useCallback((mode: ModeType, data: IServiceType | null) => {
    if (!mode || !data) return;
    setSelected((prev) => ({ ...prev, mode, data }));
  }, []);

  const handleCloseModeEdit = useCallback(() => {
    setSelected({ data: null, mode: null });
  }, []);

  return {
    addEditError: addEdit,
    isLoading,
    data,
    pagination,
    initialValues,
    textsByMode,
    isEditMode,
    handleOnClick,
    handleOnSubmit,
    handleCloseModeEdit,
  };
};

export default useServiceTypeHelpers;
