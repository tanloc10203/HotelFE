import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton, TableCell, TableRow, Tooltip, useTheme } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChipOverride, ColumnState } from "~/components";
import { roomActions, useRoom } from "~/features/room";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IFloor, IRoomResponse, IRoomTypeResponse, StatusRoom } from "~/types";
import { colors } from "~/utils";
import { convertStatusRoom } from "../helpers/convertStatusRoom";

const { Table } = ForPage;

type TableRoomProps = {
  onDetails?: (item: IRoomResponse) => void;
  onAddDiscount?: (item: IRoomResponse) => void;
};

const TableRoom: FC<TableRoomProps> = ({ onDetails }) => {
  const { data, pagination, filters } = useRoom();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "floor", label: "Tầng", minWidth: 80, align: "center" },
      { id: "roomType", label: "Loại phòng", minWidth: 200 },
      { id: "room_quantity", label: "Số lượng phòng", minWidth: 80, align: "center" },
      { id: "status", label: "Trạng thái", minWidth: 80, align: "center" },
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

  const handleOnDetails = useCallback(
    (item: IRoomResponse) => {
      if (!onDetails) return;
      onDetails(item);
    },
    [onDetails]
  );

  // const handleOnAddDiscount = useCallback(
  //   (item: IRoomResponse) => {
  //     if (!onAddDiscount) return;
  //     onAddDiscount(item);
  //   },
  //   [onAddDiscount]
  // );

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(roomActions.setFilter({ ...filters, page: newPage }));
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
              const value = item[column.id as keyof IRoomResponse];

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
                    <Tooltip placement="bottom-start" arrow title="Chỉnh sửa">
                      <IconButton
                        component={Link}
                        to={DashboardPaths.UpdateRoom + `/${item.id}`}
                        aria-label="edit"
                        color="secondary"
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

                    {/* <Tooltip
                      placement="bottom-start"
                      arrow
                      title={item?.discount ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
                    >
                      <IconButton
                        aria-label="details"
                        color="primary"
                        onClick={() => handleOnAddDiscount(item)}
                      >
                        {item?.discount ? <BrushIcon /> : <DiscountIcon />}
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                );
              }

              if (column.id === "floor") {
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
                    {(value as IFloor).name}
                  </TableCell>
                );
              }

              if (column.id === "roomType") {
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
                    {(value as IRoomTypeResponse).name}
                  </TableCell>
                );
              }

              if (column.id === "status") {
                const status = convertStatusRoom(value as StatusRoom);

                const color = colors(status.color, theme);

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
                    <ChipOverride
                      label={status.text}
                      background={color.bgActive}
                      colorOverride={color.colorActive}
                    />
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

export default TableRoom;
