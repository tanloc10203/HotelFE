import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { ColumnState } from "~/components";
import { amenityActions, useAmenity } from "~/features/amenity";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IAmenityResponse } from "~/types";

const { Table } = ForPage;

type TableAmenityProps = {
  isTrashMode?: boolean;
  onEdit?: (item: IAmenityResponse) => void;
  onDelete?: (item: IAmenityResponse) => void;
  onDeleteTrash?: (item: IAmenityResponse) => void;
  onRestore?: (item: IAmenityResponse) => void;
};

const TableAmenity: FC<TableAmenityProps> = ({
  onEdit,
  onDelete,
  isTrashMode,
  onDeleteTrash,
  onRestore,
}) => {
  const { data, pagination, filters } = useAmenity();
  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên tiện nghi", minWidth: 170 },
      { id: "typeData", label: "Loại tiện nghi", minWidth: 170 },
      { id: "desc", label: "Mô tả tiện nghi", minWidth: 170 },
      { id: "actions", label: "Hành động", maxWidth: 120, minWidth: 120, align: "center" },
    ],
    []
  );

  const handleOnEdit = useCallback(
    (item: IAmenityResponse) => {
      if (!onEdit) return;
      onEdit(item);
    },
    [onEdit]
  );

  const handleOnDelete = useCallback(
    (item: IAmenityResponse) => {
      if (!onDelete) return;
      onDelete(item);
    },
    [onDelete]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(amenityActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleOnDeleteTrash = useCallback(
    (item: IAmenityResponse) => {
      if (!onDeleteTrash) return;
      onDeleteTrash(item);
    },
    [onDeleteTrash]
  );

  const handleOnRestore = useCallback(
    (item: IAmenityResponse) => {
      if (!onRestore) return;
      onRestore(item);
    },
    [onRestore]
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
      minHeight={480}
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
              const value = item[column.id as keyof IAmenityResponse];

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
                    <Tooltip title={isTrashMode ? "Xóa vĩnh viễn" : "Xóa tạm"}>
                      <IconButton
                        onClick={() =>
                          isTrashMode ? handleOnDeleteTrash(item) : handleOnDelete(item)
                        }
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {isTrashMode ? (
                      <Tooltip placement="bottom-start" arrow title="Khôi phục">
                        <IconButton
                          onClick={() => handleOnRestore(item)}
                          aria-label="restore"
                          color="primary"
                        >
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={() => handleOnEdit(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                );
              }

              if (column.id === "typeData") {
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
                    {item.typeData.name}
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
                  {value as string}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      )}
    </Table>
  );
};

export default TableAmenity;
