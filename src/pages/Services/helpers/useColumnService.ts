import { useMemo } from "react";
import { ColumnState } from "~/components";
import { ServicesUnitType } from "~/types";
import { fDateTime } from "~/utils";

export const useColumnServiceTypes = () => {
  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên loại dịch vụ", minWidth: 30 },
      {
        id: "created_at",
        label: "Ngày tạo",
        minWidth: 30,
        format(value) {
          return fDateTime(value as string, "dd/MM/yyyy p");
        },
      },
      {
        id: "updated_at",
        label: "Ngày cập nhật",
        minWidth: 30,
        format(value) {
          return fDateTime(value as string, "dd/MM/yyyy p");
        },
      },
      {
        id: "actions",
        label: "AC",
        minWidth: 30,
        maxWidth: 30,
        align: "center",
      },
    ],
    []
  );

  return columns;
};

export const useColumnServices = () => {
  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên dịch vụ", minWidth: 200, maxWidth: 200 },
      {
        id: "units",
        label: "Đơn vị",
        minWidth: 50,
        maxWidth: 50,
        align: "center",
        format(value) {
          return (value as ServicesUnitType[]).reduce(
            (text, value, index, old) =>
              (text += `${value?.unitData?.name}${index === old.length - 1 ? "" : ", "}`),
            ""
          );
        },
      },
      {
        id: "quantity",
        label: "Tồn kho",
        minWidth: 50,
        maxWidth: 50,
        format(value) {
          return value === 0 || value ? value : "Không có tồn kho";
        },
      },
      {
        id: "actions",
        label: "AC",
        minWidth: 30,
        maxWidth: 30,
        align: "center",
      },
    ],
    []
  );

  return columns;
};
