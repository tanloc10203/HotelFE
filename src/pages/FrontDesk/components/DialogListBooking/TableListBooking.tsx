import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Stack, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useMemo, useRef } from "react";
import {
  Actions,
  ActionsRefsProps,
  ButtonActions,
  ColumnState,
  TableCellOverride,
} from "~/components";
import { ForPage } from "~/layouts";
import { BookingStatus, IBooking } from "~/types";
import { fBookingStatus, fBookingStatusColor, fDateDayjs, fNumber } from "~/utils";

const { Table } = ForPage;

type TableListBookingProps = {
  data: IBooking[];
  page: number;
  totalPage?: number;
  onChangePage?: (newPage: number) => void;
  onSeeBooking?: (row: IBooking) => void;
};

const TableListBooking: FC<TableListBookingProps> = ({
  data,
  page,
  totalPage,
  onChangePage,
  onSeeBooking,
}) => {
  const {
    palette: { mode },
  } = useTheme();
  const ref = useRef<ActionsRefsProps>(null);

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "id", label: "ID Đặt phòng", minWidth: 30 },
      {
        id: "customer",
        label: "TTKH",
        minWidth: 30,
        format(value: Pick<IBooking, "customer">["customer"]) {
          return value?.display_name || "Không có";
        },
      },
      {
        id: "employee",
        label: "NV Thực hiện",
        minWidth: 30,
        format(value: Pick<IBooking, "employee">["employee"]) {
          return value?.display_name || "Không có";
        },
      },
      {
        id: "is_booked_online",
        label: "Hình thức đặt",
        minWidth: 30,
        align: "left",
        format(value: Pick<IBooking, "is_booked_online">["is_booked_online"]) {
          return Boolean(value) ? "qua ứng dụng" : "tại khách sạn";
        },
      },
      {
        id: "total_room",
        label: "Tông SLP",
        minWidth: 30,
        format(value: Pick<IBooking, "total_room">["total_room"]) {
          return `${value} phòng`;
        },
      },
      {
        id: "total_price",
        label: "Tông tiền",
        minWidth: 30,
        format(value: Pick<IBooking, "total_price">["total_price"]) {
          return fNumber(value);
        },
      },
      {
        id: "voucher",
        label: "Voucher",
        minWidth: 30,
        align: "center",
        format(value: Pick<IBooking, "voucher">["voucher"]) {
          return value || "Không có";
        },
      },
      {
        id: "status",
        label: "Trạng thái",
        minWidth: 30,
        format(value: Pick<IBooking, "status">["status"]) {
          return fBookingStatus(value);
        },
      },
      {
        id: "created_at",
        label: "Ngày đặt",
        minWidth: 30,
        format(value: Pick<IBooking, "created_at">["created_at"]) {
          return fDateDayjs(dayjs(value), "DD/MM/YYYY HH:mm");
        },
      },
      {
        id: "updated_at",
        label: "Ngày hủy",
        minWidth: 30,
      },
      {
        id: "actions",
        label: "AC",
        minWidth: 30,
        align: "center",
      },
    ],
    []
  );

  const handleSeeBooking = useCallback(
    (row: IBooking) => {
      if (!ref.current || !onSeeBooking) return;
      ref.current.onClose();
      onSeeBooking(row);
    },
    [ref.current, onSeeBooking]
  );

  return (
    <Table
      onPageChange={onChangePage}
      columns={columns}
      page={page}
      totalRow={totalPage}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
    >
      {data?.length > 0 ? (
        data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => {
              const value = row[column.id as keyof IBooking];

              if (column.id === "actions") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    <Actions ref={ref}>
                      <ButtonActions
                        onClick={() => handleSeeBooking(row)}
                        startIcon={<RemoveRedEyeIcon />}
                      >
                        Xem chi tiết
                      </ButtonActions>
                      {row.status === "confirmed" ? (
                        <ButtonActions>Nhận phòng</ButtonActions>
                      ) : null}
                    </Actions>
                  </TableCellOverride>
                );
              }

              if (column.id === "updated_at") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    {row.status === "canceled"
                      ? fDateDayjs(dayjs(row.updated_at!), "DD/MM/YYYY HH:mm")
                      : null}
                  </TableCellOverride>
                );
              }

              if (column.id === "customer") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    <Stack>
                      <Typography fontSize={14}>{row?.customer?.display_name}</Typography>
                      <Typography fontSize={14} fontWeight={"bold"}>
                        {row?.customer?.phone_number}
                      </Typography>
                    </Stack>
                  </TableCellOverride>
                );
              }

              return (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.styles,
                    ...(column.id === "status"
                      ? {
                          color: fBookingStatusColor(value as BookingStatus, mode),
                        }
                      : {}),
                  }}
                  sx={{
                    ...(column.id === "is_booked_online"
                      ? {
                          color: (theme) =>
                            row.is_booked_online
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                        }
                      : {}),
                    ...(column.id === "employee"
                      ? {
                          color: (theme) => (row.employee ? null : theme.palette.error.main),
                        }
                      : {}),
                  }}
                  key={column.id}
                  component="th"
                  scope="row"
                  align={column.align}
                >
                  {column.format ? column.format(value as string) : (value as string)}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có nhân viên nào
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableListBooking;
