import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RestoreIcon from "@mui/icons-material/Restore";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ColumnState } from "~/components";
import { roomTypeActions, useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IRoomTypeResponse } from "~/types";

const { Table } = ForPage;

type TableRoomTypeProps = {
  isTrashMode?: boolean;
  onDelete?: (item: IRoomTypeResponse) => void;
  onDetails?: (item: IRoomTypeResponse) => void;
  onDeleteTrash?: (item: IRoomTypeResponse) => void;
  onRestore?: (item: IRoomTypeResponse) => void;
};

const TableRoomType: FC<TableRoomTypeProps> = ({
  onDelete,
  onRestore,
  onDeleteTrash,
  onDetails,
  isTrashMode,
}) => {
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

  const handleOnDeleteTrash = useCallback(
    (item: IRoomTypeResponse) => {
      if (!onDeleteTrash) return;
      onDeleteTrash(item);
    },
    [onDeleteTrash]
  );

  const handleOnRestore = useCallback(
    (item: IRoomTypeResponse) => {
      if (!onRestore) return;
      onRestore(item);
    },
    [onRestore]
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
                    <Tooltip
                      placement="bottom-start"
                      arrow
                      title={isTrashMode ? "Xóa vĩnh viễn" : "Chuyển vào thùng rác"}
                    >
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
                      <Tooltip placement="bottom-start" arrow title="Chỉnh sửa">
                        <IconButton
                          component={Link}
                          to={DashboardPaths.EditRoomTypes + `/${item.id}`}
                          aria-label="edit"
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

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
