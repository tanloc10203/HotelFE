import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { ColumnState } from "~/components";
import { roomTypeActions, useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IRoomTypeResponse } from "~/types";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Link } from "react-router-dom";

const { Table } = ForPage;

type TableRoomTypeProps = {
  onDelete?: (item: IRoomTypeResponse) => void;
  onDetails?: (item: IRoomTypeResponse) => void;
};

const TableRoomType: FC<TableRoomTypeProps> = ({ onDelete, onDetails }) => {
  const { data, pagination, filters } = useRoomTypes();
  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "name", label: "Tên loại phòng", minWidth: 170 },
      { id: "character", label: "Kí tự", minWidth: 80, align: "center" },
      { id: "desc", label: "Mô tả", minWidth: 200 },
      {
        id: "actions",
        label: "Hành động",
        maxWidth: 150,
        minWidth: 150,
        styles: { padding: 0 },
        align: "center",
      },
    ],
    []
  );

  const handleOnDelete = useCallback(
    (item: IRoomTypeResponse) => {
      if (!onDelete) return;
      onDelete(item);
    },
    [onDelete]
  );

  const handleOnDetails = useCallback(
    (item: IRoomTypeResponse) => {
      if (!onDetails) return;
      onDetails(item);
    },
    [onDetails]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(roomTypeActions.setFilter({ ...filters, page: newPage }));
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
      minHeight={450}
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
              const value = item[column.id as keyof IRoomTypeResponse];

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
                    <Tooltip placement="bottom-start" arrow title="Xóa">
                      <IconButton
                        onClick={() => handleOnDelete(item)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip placement="bottom-start" arrow title="Chỉnh sửa">
                      <IconButton
                        component={Link}
                        to={DashboardPaths.EditRoomTypes + `/${item.id}`}
                        aria-label="edit"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip placement="bottom-start" arrow title="Xem chi tiết">
                      <IconButton
                        aria-label="details"
                        color="primary"
                        onClick={() => handleOnDetails(item)}
                      >
                        <RemoveRedEyeIcon />
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

export default TableRoomType;
