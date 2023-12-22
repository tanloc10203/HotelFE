import {
  AppBar,
  Box,
  LinearProgress,
  SelectChangeEvent,
  Slide,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";
import { Dayjs } from "dayjs";
import { FC, forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ColumnState } from "~/components";
import { FORMAT_DATETIME_SQL } from "~/constants/format";
import { appActions } from "~/features/app";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IRoomPrice, ModeTimeBookingPrice, RoomsAvailableDesktop, RoomsSelected } from "~/types";
import { fNumber, getElementByLength } from "~/utils";
import FilterBooking from "../components/FilterBooking";
import { useCalcTimeBooking } from "~/hooks/useCalcTimeBooking";
import { calcPriceHourWithDiscount, calcWithDiscount } from "~/utils/convert";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const { Table } = ForPage;

type BookingDialogProps = {
  open: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
};

const BookingDialog: FC<BookingDialogProps> = ({ open, onClose, onSubmit }) => {
  const { checkIn, checkOut, isLoading, roomsAvailable, modeTime } = useBookingSelector();
  const { text: calcDateTime, diff } = useCalcTimeBooking({ checkIn, checkOut, modeTime });
  const dispatch = useAppDispatch();
  const [quantities, setQuantities] = useState<null | Record<number, string>>(null);

  // console.log("====================================");
  // console.log(`roomsAvailable`, roomsAvailable);
  // console.log("====================================");

  useEffect(() => {
    if (open)
      dispatch(
        bookingActions.getRoomAvailableDesktopStart({
          check_in: checkIn.format(FORMAT_DATETIME_SQL),
          check_out: checkOut.format(FORMAT_DATETIME_SQL),
        })
      );
  }, [checkIn, checkOut, open]);

  useLayoutEffect(() => {
    if (!roomsAvailable.length) return;

    const initial = {};

    const _quantities = roomsAvailable.reduce(
      (object, value) => ({ ...object, [value.roomTypeId]: "0" }),
      initial
    );

    setQuantities(_quantities);
  }, [roomsAvailable]);

  const onChangeCheckIn = useCallback((value: Dayjs | null) => {
    dispatch(bookingActions.setCheckInOut({ type: "check-out", value: value! }));
    dispatch(bookingActions.setCheckInOut({ type: "check-in", value: value! }));
  }, []);

  const onChangeCheckOut = useCallback((value: Dayjs | null) => {
    dispatch(bookingActions.setCheckInOut({ type: "check-out", value: value! }));
  }, []);

  const onChangeMode = useCallback((event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;

    dispatch(bookingActions.setModeTime(value as ModeTimeBookingPrice));
  }, []);

  const columns: ColumnState[] = useMemo(
    () => [
      {
        id: "name",
        label: "Loại phòng",
        maxWidth: 150,
        minWidth: 150,
      },
      {
        id: "roomAvailable",
        label: "Có sẵn",
        maxWidth: 30,
        minWidth: 30,
        styles: {
          padding: 0,
        },
        align: "center",
        format(value) {
          return `${value} phòng`;
        },
      },
      {
        id: "quantity",
        label: "Số lượng",
        align: "center",
        maxWidth: 30,
        minWidth: 30,
      },
      {
        id: "prices",
        label: modeTime === "time" ? `Giá phòng / giờ` : `Giá phòng / ngày`,
        maxWidth: 50,
        minWidth: 50,
        styles: {
          padding: 0,
        },
        align: "center",
        format(value: IRoomPrice) {
          if (modeTime === "time") {
            return `${fNumber(value?.price_hours[0]?.price || 0)}`;
          }

          return `${fNumber(value?.price_offline)}`;
        },
      },
      {
        id: "sub_total",
        label: `Thành tiền`,
        maxWidth: 50,
        minWidth: 50,
        styles: {
          padding: 0,
        },
        align: "center",
      },
    ],
    [modeTime]
  );

  const onChangeQuantity = useCallback(
    (roomTypeId: number, value: string) => {
      const available = roomsAvailable.find((r) => r.roomTypeId === roomTypeId)!;

      value = +value > available.roomAvailable ? `${available.roomAvailable}` : value;

      setQuantities((prev) => ({
        ...prev,
        [roomTypeId]: `${value}`,
      }));
    },
    [roomsAvailable]
  );

  const onConfirm = useCallback(() => {
    if (!quantities) return;

    let isEmpty = Object.values(quantities).every((value) => {
      return !value || +value === 0;
    });

    if (isEmpty) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: "Vui lòng ghi số lượng phòng của loại phòng bạn chọn.",
          vertical: "bottom",
        })
      );
      return;
    }

    const data: RoomsSelected[] = Object.entries(quantities)
      .map(([key, value]) => ({ quantity: +value, roomTypeId: +key }))
      .filter((t) => t.quantity)
      .map((t) => {
        const room = roomsAvailable.find((r) => r.roomTypeId === t.roomTypeId)!;
        const roomNumberSelected = getElementByLength(room.roomNumbers, t.quantity - 1);
        return {
          ...room,
          ...t,
          roomNumberSelected,
          adults: 1,
          children: 0,
          checkIn,
          checkOut,
          totalTime: diff,
        };
      });

    if (!onSubmit) return;
    dispatch(bookingActions.setRoomsSelected(data));
    onSubmit();
  }, [quantities, roomsAvailable, diff, onSubmit]);

  return (
    <Dialog fullScreen TransitionComponent={Transition} fullWidth open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative" }} color="inherit">
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Chọn phòng
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            <Button onClick={onClose} variant="outlined" color="error">
              Hủy bỏ
            </Button>
            <Button onClick={onConfirm} variant="contained">
              Xác nhận
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <DialogContent dividers={true}>
        <FilterBooking
          modeValue={modeTime}
          checkIn={checkIn}
          checkOut={checkOut}
          calcDateTime={calcDateTime}
          onChangeCheckIn={onChangeCheckIn}
          onChangeCheckOut={onChangeCheckOut}
          onChangeMode={onChangeMode}
        />

        <Box position={"relative"}>
          {isLoading === "pending" ? (
            <Box position={"absolute"} top={-5} right={0} left={0}>
              <LinearProgress />
            </Box>
          ) : null}

          <Table
            sxHeadCell={{
              background: (theme) => (theme.palette.mode === "dark" ? "#609966" : "#DDF7E3"),
            }}
            columns={columns}
          >
            {roomsAvailable?.length ? (
              roomsAvailable.map((row, index) => {
                return (
                  <TableRow
                    sx={{
                      background: (theme) =>
                        index % 2 !== 0
                          ? theme.palette.mode === "dark"
                            ? theme.palette.grey[900]
                            : theme.palette.grey[100]
                          : theme.palette.mode === "dark"
                          ? theme.palette.common.black
                          : theme.palette.common.white,
                    }}
                    key={row.roomTypeId}
                  >
                    {columns.map((column) => {
                      const value = row[column.id as keyof RoomsAvailableDesktop];

                      let priceResults = 0;

                      if (modeTime === "day") {
                        priceResults = row.prices.price_offline;
                      } else {
                        priceResults = row.prices.price_hours[0].price;
                      }

                      if (
                        row.discount &&
                        row.discount.status !== "expired" &&
                        row.discount.is_public
                      ) {
                        const { price } = row.discount;

                        if (modeTime === "day") {
                          priceResults = calcWithDiscount(row.prices.price_offline, price);
                        } else {
                          priceResults = calcWithDiscount(row.prices.price_hours[0].price, price);
                        }
                      }

                      if (column.id === "quantity") {
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
                            <TextField
                              sx={{ maxWidth: 35 }}
                              value={quantities ? quantities[row.roomTypeId] : ""}
                              onChange={({ target: { value } }) =>
                                onChangeQuantity(row.roomTypeId, value)
                              }
                              type="number"
                              size="small"
                              variant="standard"
                            />
                          </TableCell>
                        );
                      }

                      if (column.id === "sub_total") {
                        if (modeTime === "time") {
                          priceResults = calcPriceHourWithDiscount({
                            priceHours: row.prices.price_hours,
                            totalPrice: 0,
                            totalTime: diff,
                            priceDiscount: row?.discount?.price || 0,
                          });
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
                            {quantities && quantities[row.roomTypeId]
                              ? fNumber(
                                  Number(quantities[row.roomTypeId]) *
                                    priceResults *
                                    (modeTime === "time" ? 1 : diff <= 0 ? 1 : diff)
                                )
                              : 0}
                          </TableCell>
                        );
                      }

                      if (column.id === "prices") {
                        if (
                          row.discount &&
                          row.discount.status !== "expired" &&
                          row.discount.is_public
                        ) {
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
                              <Stack
                                flexDirection={"row"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                gap={2}
                              >
                                <Typography
                                  fontSize={14}
                                  color={(theme) => theme.palette.success.main}
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {column.format
                                    ? column.format(value as string)
                                    : (value as string)}
                                </Typography>

                                <Typography
                                  fontSize={14}
                                  color={(theme) => theme.palette.error.main}
                                >
                                  {fNumber(priceResults)}
                                </Typography>
                              </Stack>
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
                            <Typography fontSize={14} color={(theme) => theme.palette.success.main}>
                              {column.format ? column.format(value as string) : (value as string)}
                            </Typography>
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
                          {column.format ? column.format(value as string) : (value as string)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} component="th" scope="row">
                  Đã hết phòng
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
