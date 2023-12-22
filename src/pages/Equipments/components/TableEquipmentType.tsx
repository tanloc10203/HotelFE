import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { ColumnState } from "~/components";
import { equipmentTypeActions, useEquipmentType } from "~/features/equipmentType";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IEquipmentType } from "~/types";

const { Table } = ForPage;

type TableEquipmentTypeProps = {
  onEdit?: (item: IEquipmentType) => void;
  onDelete?: (item: IEquipmentType) => void;
};

const TableEquipmentType: FC<TableEquipmentTypeProps> = ({ onEdit, onDelete }) => {
  const { data, pagination, filters } = useEquipmentType();
  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên loại thiết bị", minWidth: 170 },
      { id: "desc", label: "Mô tả loại thiết bị", minWidth: 170 },
      { id: "actions", label: "Hành động", maxWidth: 120, minWidth: 120, align: "center" },
    ],
    []
  );

  const handleOnEdit = useCallback(
    (item: IEquipmentType) => {
      if (!onEdit) return;
      onEdit(item);
    },
    [onEdit]
  );

  const handleOnDelete = useCallback(
    (item: IEquipmentType) => {
      if (!onDelete) return;
      onDelete(item);
    },
    [onDelete]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(equipmentTypeActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  return (
    <Table
      columns={columns}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
      page={pagination.page}
      totalRow={pagination.totalPage}
      onPageChange={handleChangePage}
    >
      {!data.length ? (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có dữ liệu
          </TableCell>
        </TableRow>
      ) : (
        data.map((item) => (
          <TableRow key={item.id + ""}>
            {columns.map((column) => {
              const value = item[column.id as keyof IEquipmentType];

              if (column.id === "actions") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <IconButton
                      onClick={() => handleOnDelete(item)}
                      aria-label="delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleOnEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                );
              }

              return (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.styles,
                  }}
                  key={column.id}
                  component="th"
                  scope="row"
                  align={column.align}
                >
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      )}
    </Table>
  );
};

export default TableEquipmentType;
