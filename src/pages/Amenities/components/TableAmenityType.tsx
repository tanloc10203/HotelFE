import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { ColumnState } from "~/components";
import { useAmenityType } from "~/features/amenityType";
import { ForPage } from "~/layouts";
import { IAmenityType } from "~/types";

const { Table } = ForPage;

type TableAmenityTypeProps = {
  onEdit?: (item: IAmenityType) => void;
  onDelete?: (item: IAmenityType) => void;
};

const TableAmenityType: FC<TableAmenityTypeProps> = ({ onEdit, onDelete }) => {
  const { data } = useAmenityType();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên loại tiện nghi", minWidth: 170 },
      { id: "desc", label: "Mô tả loại tiện nghi", minWidth: 170 },
      { id: "actions", label: "Hành động", maxWidth: 120, minWidth: 120, align: "center" },
    ],
    []
  );

  const handleOnEdit = useCallback(
    (item: IAmenityType) => {
      if (!onEdit) return;
      onEdit(item);
    },
    [onEdit]
  );

  const handleOnDelete = useCallback(
    (item: IAmenityType) => {
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
              const value = item[column.id as keyof IAmenityType];

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
                    <Tooltip title="Xóa">
                      <IconButton
                        onClick={() => handleOnDelete(item)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleOnEdit(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
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

export default TableAmenityType;
