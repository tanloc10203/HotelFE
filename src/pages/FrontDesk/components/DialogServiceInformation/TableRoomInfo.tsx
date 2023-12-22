import { TableRow } from "@mui/material";
import { FC } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { Colors } from "~/constants";
import { useFrontDeskSelector } from "~/features/frontDesk";
import { ForPage } from "~/layouts";
import { calDateTimeBooking, fNumber } from "~/utils";
import { calcWithDiscount } from "~/utils/convert";

const { Table } = ForPage;

const TableRoomInfo: FC = () => {
  const { informationRoom } = useFrontDeskSelector();
  const columnsRoom: ColumnState[] = [
    { id: "name", label: "Thông tin phòng", minWidth: 80 },
    {
      id: "time",
      label: "Thời gian",
      minWidth: 40,
      maxWidth: 40,
      align: "center",
      styles: { padding: 0 },
    },
    { id: "price", label: "Đơn giá", minWidth: 100, maxWidth: 100 },
    {
      id: "subTotal",
      label: "Thành tiền",
      minWidth: 100,
      maxWidth: 100,
      styles: { padding: 0 },
      align: "center",
    },
    {
      id: "paymentCost",
      label: "Đã thanh toán",
      minWidth: 100,
      maxWidth: 100,
      styles: { padding: 0 },
      align: "center",
    },
  ];

  return (
    <Table
      columns={columnsRoom}
      autoHeight
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "light" ? Colors.GreenLight : Colors.GreenDark,
      }}
    >
      {informationRoom.data ? (
        <TableRow>
          {columnsRoom.map((column) => {
            const { bookingDetails, room, tax } = informationRoom.data!;

            const time = calDateTimeBooking(
              bookingDetails?.check_in!,
              bookingDetails?.check_out!,
              bookingDetails?.bookingData?.mode_booking!
            );

            if (column.id === "name") {
              return (
                <TableCellOverride key={column.id} {...column}>
                  {`${room?.roomTypeName} - ${room.roomNumber.id}`}
                </TableCellOverride>
              );
            }

            if (column.id === "time") {
              return (
                <TableCellOverride key={column.id} {...column}>
                  {time.text}
                </TableCellOverride>
              );
            }

            if (column.id === "price") {
              return (
                <TableCellOverride key={column.id} {...column}>
                  {`${fNumber(
                    informationRoom?.data?.bill?.cost_room ||
                      informationRoom?.data?.bill?.total_price ||
                      0
                  )} (đã bao gồm ${tax}% VAT)`}
                </TableCellOverride>
              );
            }

            if (column.id === "paymentCost") {
              return (
                <TableCellOverride key={column.id} {...column}>
                  {`${
                    informationRoom?.data?.bill?.status === "paid"
                      ? fNumber(
                          calcWithDiscount(
                            informationRoom?.data?.bookingDetails?.bookingData?.is_booked_online
                              ? informationRoom?.data?.bill?.cost_room_paid!
                              : informationRoom?.data?.bill?.cost_room ||
                                  informationRoom?.data?.bill?.total_price ||
                                  0,
                            informationRoom?.data?.bill?.discount || 0
                          )
                        )
                      : "0"
                  }`}
                </TableCellOverride>
              );
            }

            return (
              <TableCellOverride key={column.id} {...column}>
                {`${fNumber(
                  calcWithDiscount(
                    informationRoom?.data?.bill?.cost_room ||
                      informationRoom?.data?.bill?.total_price ||
                      0,
                    informationRoom?.data?.bill?.discount || 0
                  )
                )}`}
              </TableCellOverride>
            );
          })}
        </TableRow>
      ) : null}
    </Table>
  );
};

export default TableRoomInfo;
