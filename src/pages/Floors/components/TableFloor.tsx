import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { ColumnState } from "~/components";
import { useFloor } from "~/features/floor";
import { ForPage } from "~/layouts";
import { IFloor } from "~/types";

const { Table } = ForPage;

type TableFloorProps = {
  onEdit?: (item: IFloor) => void;
  onDelete?: (item: IFloor) => void;
};

const TableFloor: FC<TableFloorProps> = ({ onEdit, onDelete }) => {
  const { data } = useFloor();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên tầng" },
      { id: "character", label: "Kí tự", align: "center" },
      { id: "desc", label: "Mô tả tầng" },
      { id: "actions", label: "Hành động", maxWidth: 80, minWidth: 80 },
    ],
    []
  );

  const handleOnEdit = useCallback(
    (item: IFloor) => {
      if (!onEdit) return;
      onEdit(item);
    },
    [onEdit]
  );

  const handleOnDelete = useCallback(
    (item: IFloor) => {
      if (!onDelete) return;
      onDelete(item);
    },
    [onDelete]
  );

  return (
    <Table
      columns={columns}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
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
              const value = item[column.id as keyof IFloor];

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

export default TableFloor;
