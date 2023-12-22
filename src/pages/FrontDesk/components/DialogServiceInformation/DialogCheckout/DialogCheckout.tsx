import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { intervalToDuration } from "date-fns";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { AppbarDialog, Bill, ColumnState, InputBill, Transition } from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { useGuestUseServiceSelector } from "~/features/guestUseServices";
import { useCalcTimeUsedInRoom } from "~/hooks/useCalcTimeUsedInRoom";
import { ForPage } from "~/layouts";
import { BillInfoPayload, InformationRoomDetails } from "~/types";
import { fDurationUsedInRoom } from "~/utils";
import { calcPriceHourWithDiscount } from "~/utils/convert";
import TableGuestInfo from "../../TableGuestInfo";
import CardItemServiceBill from "../CardItemServiceBill";
import TableRoomInfo from "../TableRoomInfo";
import InformationTime from "./InformationTime";

const { Table } = ForPage;

type DialogCheckoutProps = {
  open: boolean;
  room: InformationRoomDetails;
  onClose?: () => void;
  onCheckout?: (value: BillInfoPayload) => void;
  disabled?: boolean;
};

const DialogCheckout: FC<DialogCheckoutProps> = ({ open, onClose, onCheckout, room, disabled }) => {
  const { data } = useGuestUseServiceSelector();

  const duration = useCalcTimeUsedInRoom(room.bookingDetails.checked_in || "");

  const checkInCalc = useMemo(() => {
    const { bookingDetails } = room;

    const checkIn = dayjs(new Date(bookingDetails.check_in || ""));
    const checkedIn = dayjs(new Date(bookingDetails.checked_in || ""));

    const diff = checkIn.diff(checkedIn, "minutes");
    const durationCheckIn = intervalToDuration({
      end: checkedIn.toDate(),
      start: checkIn.toDate(),
    });

    return { ...durationCheckIn, late: diff > 0 };
  }, [room]);

  const checkOutCalc = useMemo(() => {
    const { bookingDetails } = room;

    const checkOut = dayjs(new Date(bookingDetails.check_out || ""));
    const checkedOut = dayjs(new Date());

    const diff = checkOut.diff(checkedOut, "minutes");
    const durationCheckOut = intervalToDuration({
      end: checkedOut.toDate(),
      start: checkOut.toDate(),
    });

    return { ...durationCheckOut, late: diff > 0 };
  }, [room, duration]);

  const initialValues = useMemo((): BillInfoPayload => {
    if (!room)
      return {
        paymentCost: 0,
        customerPay: 0,
        customerRequirePay: 0,
        discount: 0,
        note: "",
        totalCostRoom: 0,
        totalCostService: 0,
        totalQuantityOrdered: 0,
        change: 0,
        deposit: 0,
        costLateCheckIn: 0,
        costOverCheckOut: 0,
      };

    const {
      bill,
      bookingDetails,
      room: { prices },
    } = room;

    let totalCostRoom = Number(bill?.cost_room || bill?.total_price);
    let costLateCheckIn = 0;
    let costOverCheckOut = 0;
    let costLateCheckOut = 0;

    const totalCostService = data.reduce((total, value) => {
      if (!value.unitData || !value.sub_total) return (total += 0);

      const { unitData, sub_total } = value;

      if (!unitData.is_default) {
        return (total += sub_total * Number(unitData.quantity));
      }

      return (total += sub_total);
    }, 0);

    const totalQuantityOrdered = data.reduce(
      (total, value) => (total += value.quantity_ordered!),
      0
    );

    if (!disabled && checkInCalc.late) {
      costLateCheckIn = Number(bill?.cost_last_checkin);
    } else {
      costLateCheckIn = Number(bill?.cost_last_checkin);
    }

    if (!disabled) {
      if (!checkOutCalc.late) {
        const hourLateCheckOut = Number(checkOutCalc.hours);

        const priceLateCheckOut = calcPriceHourWithDiscount({
          priceDiscount: bookingDetails?.discount?.price || 0,
          priceHours: prices?.price_hours || [],
          totalPrice: 0,
          totalTime: hourLateCheckOut,
        });

        costOverCheckOut = priceLateCheckOut;

        totalCostRoom += priceLateCheckOut;
      }
    } else {
      costOverCheckOut = Number(bill?.cost_over_checkout);
      costLateCheckOut = Number(bill?.cost_late_checkout);
    }

    if (bill?.status === "paid") {
      if (bill.cost_room) {
        totalCostRoom = Number(bill.cost_room);
      } else {
        totalCostRoom -= Number(bill.total_price);
      }
    }

    const paymentCost = bill?.status === "paid" ? Number(bill?.total_price) : 0;

    return {
      paymentCost,
      customerPay: disabled
        ? totalCostRoom + totalCostService + costLateCheckIn + costOverCheckOut - costLateCheckOut
        : 0,
      customerRequirePay: totalCostRoom + totalCostService + costLateCheckIn,
      discount: disabled ? bill?.discount || 0 : 0,
      totalQuantityOrdered,
      note: "",
      totalCostRoom: totalCostRoom,
      totalCostService,
      change: 0,
      deposit: 0,
      costOverCheckOut,
      costLateCheckIn,
    };
  }, [room, data, checkInCalc, checkOutCalc, disabled]);

  const columns: ColumnState[] = [
    { id: "name", label: "Hàng hóa/Dịch vụ", minWidth: 80 },
    {
      id: "quantity",
      label: "SL",
      minWidth: 80,
      maxWidth: 80,
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
  ];

  const handleCheckout = useCallback((value: BillInfoPayload) => {
    if (!onCheckout) return;

    console.log("====================================");
    console.log(`value`, value);
    console.log("====================================");

    onCheckout(value);
  }, []);

  return (
    <Dialog
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      fullScreen
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
    >
      <AppbarDialog
        title={`Trả phòng ${room.room.roomNumber.id}. Đã sử dụng ${duration}`}
        onClose={onClose}
      />

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Grid container spacing={2}>
          <Grid item lg={9} pr={2}>
            <InformationTime
              checkIn={room?.bookingDetails?.check_in || ""}
              checkOut={room?.bookingDetails?.check_out || ""}
              checkedIn={room?.bookingDetails?.checked_in || ""}
              checkedOut={room?.bookingDetails?.checked_out || ""}
            />

            <Stack mb={2}>
              <Box mb={2}>
                <Typography>Thông tin phòng</Typography>
              </Box>

              <TableRoomInfo />
            </Stack>

            <Stack>
              <Box mb={2}>
                <Typography>Thông tin sử dụng dịch vụ / hàng hóa</Typography>
              </Box>

              <Table
                columns={columns}
                autoHeight
                sxHeadCell={{
                  background: (theme) =>
                    theme.palette.mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                }}
              >
                {data.length ? (
                  data.map((row, index) => (
                    <CardItemServiceBill columns={columns} data={row} key={index} index={index} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Không có dịch vụ / hàng hóa sử dụng
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            </Stack>

            <Box mt={3}>
              <Box mb={2}>
                <Typography>Thông tin khách lưu trú</Typography>
              </Box>

              <TableGuestInfo
                hiddenColumn="room_number"
                checkIn={room.bookingDetails.check_in}
                checkOut={room.bookingDetails.check_out}
                guests={room.guestsData}
              />
            </Box>
          </Grid>

          <Grid item lg={3} borderLeft={(theme) => `1px  dashed ${theme.palette.grey[200]}`}>
            <Stack mb={3} gap={3}>
              <InputBill
                label="Trạng thái"
                inputProps={{
                  disabled: true,
                  sx: {
                    "& input": {
                      fontSize: 14,
                      color: (theme) =>
                        room.bill?.status === "paid"
                          ? theme.palette.success.main
                          : room.bill?.status === "partially_paid"
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  },
                  value:
                    room.bill?.status === "paid"
                      ? "Đã thanh toán"
                      : room.bill?.status === "partially_paid"
                      ? "Đã thanh toán 1 phần"
                      : "Chưa thanh toán",
                }}
              />

              <InputBill
                label="Hình thức đặt"
                inputProps={{
                  disabled: true,
                  sx: {
                    "& input": {
                      fontSize: 14,
                      color: (theme) => theme.palette.success.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  },
                  value: room.bookingDetails.bookingData.is_booked_online
                    ? "qua ứng dụng"
                    : "trực tiếp",
                }}
              />

              <InputBill
                label="Nhận phòng"
                inputProps={{
                  disabled: true,
                  sx: {
                    "& input": {
                      fontSize: 14,
                      color: (theme) =>
                        !checkInCalc.late ? theme.palette.error.main : theme.palette.success.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  },
                  value: `${checkInCalc.late ? "sớm" : "trễ"} ${fDurationUsedInRoom(
                    checkInCalc!,
                    true
                  )}`,
                }}
              />

              <InputBill
                label="Trả phòng"
                inputProps={{
                  disabled: true,
                  sx: {
                    "& input": {
                      fontSize: 14,
                      color: (theme) =>
                        !checkOutCalc.late ? theme.palette.error.main : theme.palette.success.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  },
                  value: `${checkOutCalc.late ? "sớm" : "trễ"} ${fDurationUsedInRoom(
                    checkOutCalc!,
                    true
                  )}`,
                }}
              />

              <InputBill
                label="Đặt theo"
                inputProps={{
                  disabled: true,
                  sx: {
                    "& input": {
                      fontSize: 14,
                      color: (theme) => theme.palette.success.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  },
                  value:
                    room.bookingDetails.bookingData.mode_booking === "time"
                      ? "theo giờ"
                      : "theo ngày",
                }}
              />
            </Stack>

            <Bill
              disabled={disabled}
              isPaid={room?.bill?.status === "paid"}
              initialValues={initialValues}
              onSubmit={handleCheckout}
              isBookingTime={room?.bookingDetails?.bookingData?.mode_booking === "time"}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCheckout;
