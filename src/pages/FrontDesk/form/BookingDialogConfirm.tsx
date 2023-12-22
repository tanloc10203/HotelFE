import {
  AppBar,
  Box,
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
import { ChangeEvent, FC, forwardRef, useCallback, useMemo } from "react";
import { ColumnState, SelectInputAutoComplete, TableCellOverride } from "~/components";
import { appActions } from "~/features/app";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { customerActions } from "~/features/customer";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { useCalcTimeBooking } from "~/hooks/useCalcTimeBooking";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { CustomerPayload, IRoomNumber, RoomsSelected } from "~/types";
import {
  calcPriceCheckInLate,
  calcPriceTotalRoom,
  checkInLate,
  fCapitalizeFirstLetter,
  fDateDayjs,
  fDurationUsedInRoom,
  fNumber,
} from "~/utils";
import DialogAddCustomer from "../components/DialogAddCustomer/DialogAddCustomer";
import FilterBookingConfirm from "../components/FilterBookingConfirm";
import GuestQuantity, { OnChangeTypeGuest } from "./GuestQuantity";
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

type BookingDialogConfirmProps = {
  open: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  onReceiveRoomDesktop?: () => void;
};

const BookingDialogConfirm: FC<BookingDialogConfirmProps> = ({
  open,
  onClose,
  onSubmit,
  onReceiveRoomDesktop,
}) => {
  const dispatch = useAppDispatch();

  const {
    screenGrid: { openAddCustomerDialog },
  } = useFrontDeskSelector();

  const { checkIn, checkOut, roomsSelected, modeTime, customerBooking, note } =
    useBookingSelector();

  const { text: calcTimeBooking, diff } = useCalcTimeBooking({ checkIn, checkOut, modeTime });

  const onConfirm = useCallback(() => {
    if (!customerBooking) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          text: `Vui lòng chọn khách hàng hoặc có thể thêm khách hàng mới`,
          severity: "error",
          vertical: "bottom",
          duration: 2000,
        })
      );
      return;
    }

    const length = roomsSelected.length;
    let roomsSelect: RoomsSelected | null = null;

    for (let index = 0; index < length; index++) {
      const _roomsSelect = roomsSelected[index];

      if (
        _roomsSelect.roomNumberSelected.length > _roomsSelect.quantity ||
        _roomsSelect.roomNumberSelected.length < _roomsSelect.quantity
      ) {
        roomsSelect = _roomsSelect;
        break;
      }
    }

    if (roomsSelect) {
      const textRoomNumber = roomsSelect.roomNumberSelected.reduce(
        (results, value, index, old) =>
          (results += `${value.id}${index === old.length - 1 ? "" : ", "}`),
        ""
      );

      dispatch(
        appActions.setSnackbar({
          open: true,
          text: `Loại  phòng ${roomsSelect.name}. Số phòng \`${textRoomNumber}\` đã lớn hơn số lượng \`${roomsSelect.quantity}\``,
          severity: "error",
          vertical: "bottom",
          duration: 2000,
        })
      );
      return;
    }

    if (!onSubmit) return;

    onSubmit();
  }, [onSubmit, roomsSelected, customerBooking]);

  const onCheckIn = useCallback(() => {
    if (!customerBooking) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          text: `Vui lòng chọn khách hàng hoặc có thể thêm khách hàng mới`,
          severity: "error",
          vertical: "bottom",
          duration: 2000,
        })
      );
      return;
    }

    const length = roomsSelected.length;
    let roomsSelect: RoomsSelected | null = null;

    for (let index = 0; index < length; index++) {
      const _roomsSelect = roomsSelected[index];

      if (
        _roomsSelect.roomNumberSelected.length > _roomsSelect.quantity ||
        _roomsSelect.roomNumberSelected.length < _roomsSelect.quantity
      ) {
        roomsSelect = _roomsSelect;
        break;
      }
    }

    if (roomsSelect) {
      const textRoomNumber = roomsSelect.roomNumberSelected.reduce(
        (results, value, index, old) =>
          (results += `${value.id}${index === old.length - 1 ? "" : ", "}`),
        ""
      );

      dispatch(
        appActions.setSnackbar({
          open: true,
          text: `Loại  phòng ${roomsSelect.name}. Số phòng \`${textRoomNumber}\` đã lớn hơn số lượng \`${roomsSelect.quantity}\``,
          severity: "error",
          vertical: "bottom",
          duration: 2000,
        })
      );
      return;
    }

    if (!onReceiveRoomDesktop) return;
    onReceiveRoomDesktop();
  }, [roomsSelected, customerBooking]);

  const columns = useMemo((): ColumnState[] => {
    return [
      { id: "name", label: "Loại phòng", minWidth: 80, maxWidth: 80 },
      { id: "roomNumber", label: "Phòng", minWidth: 120, maxWidth: 120 },
      {
        id: "quantity",
        label: "Số lượng",
        minWidth: 40,
        maxWidth: 40,
        styles: { padding: "2px" },
        align: "center",
      },
      {
        id: "checkIn",
        label: "Nhận phòng",
        minWidth: 40,
        maxWidth: 40,
        align: "center",
        styles: { padding: 0 },
      },
      {
        id: "checkOut",
        label: "Trả phòng",
        minWidth: 40,
        maxWidth: 40,
        align: "center",
        styles: { padding: 0 },
      },
      {
        id: "timer",
        label: "Thời gian",
        minWidth: 30,
        maxWidth: 30,
        align: "center",
        styles: { padding: 0 },
      },
      {
        id: "guestQuantity",
        label: "Số lượng khách",
        minWidth: 80,
        maxWidth: 80,
        styles: { padding: 0 },
        align: "center",
      },
      { id: "totalPrice", label: "Thành tiền", minWidth: 100, maxWidth: 100 },
    ];
  }, []);

  const handleChangeRoomNumberSelected = useCallback(
    (value: IRoomNumber[], index: number) => {
      const _roomsSelected = [...roomsSelected];
      _roomsSelected[index] = { ..._roomsSelected[index], roomNumberSelected: value };

      dispatch(bookingActions.setRoomsSelected(_roomsSelected));
    },
    [roomsSelected]
  );

  const handleChangeGuest = useCallback(
    ({ index, type, value }: OnChangeTypeGuest) => {
      const _roomsSelected = [...roomsSelected];
      _roomsSelected[index] = { ..._roomsSelected[index], [type]: value };

      dispatch(bookingActions.setRoomsSelected(_roomsSelected));
    },
    [roomsSelected]
  );

  const changeNote = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    dispatch(bookingActions.setNote(value));
  }, []);

  const initialValues = useMemo(() => {
    const data: CustomerPayload = {
      address: "",
      birthday: "",
      desc: "",
      email: "",
      first_name: "",
      gender: "MALE",
      last_name: "",
      phone_number: "",
    };

    return data;
  }, []);

  const handleCloseAddCustomerDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleAddCustomerDialog({ open: false }));
  }, []);

  const handleSubmitAddCustomer = useCallback((values: CustomerPayload, resetForm?: () => void) => {
    dispatch(appActions.openOverplay("Đang thêm khách hàng..."));
    dispatch(customerActions.addFrontDeskStart({ data: values, resetForm: resetForm! }));
  }, []);

  return (
    <>
      {openAddCustomerDialog ? (
        <DialogAddCustomer
          initialValues={initialValues}
          open={openAddCustomerDialog}
          onClose={handleCloseAddCustomerDialog}
          onSubmit={handleSubmitAddCustomer}
        />
      ) : null}

      <Dialog fullScreen TransitionComponent={Transition} fullWidth open={open} onClose={onClose}>
        <AppBar sx={{ position: "relative" }} color="inherit">
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Đặt / Nhận phòng nhanh
            </Typography>
            <Stack flexDirection={"row"} gap={2}>
              {/* <Button onClick={onClose} variant="text" color="inherit">
                Thêm tùy chọn
              </Button> */}

              <Button onClick={onClose} variant="outlined" color="error">
                Hủy bỏ
              </Button>

              <Button onClick={onCheckIn} variant="contained" color="success">
                Nhận phòng
              </Button>

              {modeTime === "time" ? null : (
                <Button onClick={onConfirm} variant="contained">
                  Đặt trước
                </Button>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        <DialogContent dividers={true}>
          <FilterBookingConfirm />

          <Table
            sxHeadCell={{
              background: (theme) => (theme.palette.mode === "dark" ? "#609966" : "#DDF7E3"),
            }}
            columns={columns}
          >
            {roomsSelected?.length ? (
              roomsSelected.map((row, index) => {
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
                      const value = row[column.id as keyof RoomsSelected];

                      if (column.id === "timer") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {calcTimeBooking}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "roomNumber") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <SelectInputAutoComplete
                              renderTags={(value: IRoomNumber[], getTagProps) => {
                                const length = value.length;

                                return value.map((option, index) => (
                                  <Typography fontSize={12} {...getTagProps({ index })}>
                                    {`${option.id}${length - 1 !== index ? "," : ""}`}
                                  </Typography>
                                ));
                              }}
                              onChange={(value) =>
                                handleChangeRoomNumberSelected(value as IRoomNumber[], index)
                              }
                              limitTags={1}
                              keyOption="id"
                              label=""
                              options={row.roomNumbers}
                              value={row.roomNumberSelected}
                              size="small"
                            />
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "guestQuantity") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <GuestQuantity
                              index={index}
                              onChange={handleChangeGuest}
                              adults={row.adults}
                              children={row.children}
                              maxPeople={row.maxPeople}
                            />
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "checkIn") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {fCapitalizeFirstLetter(fDateDayjs(checkIn))}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "checkOut") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {fCapitalizeFirstLetter(fDateDayjs(checkOut))}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "totalPrice") {
                        const price =
                          modeTime === "time"
                            ? row.prices.price_hours[0].price
                            : row.prices.price_offline;

                        const tax = 0.08;

                        const durationCheckIn = checkInLate(checkIn.toString());
                        const priceOverCheckIn = calcPriceCheckInLate(
                          durationCheckIn,
                          row.discount,
                          row.prices
                        );

                        const priceLateTime = durationCheckIn.late
                          ? priceOverCheckIn + priceOverCheckIn * tax
                          : 0;

                        if (
                          row.discount &&
                          row.discount.status !== "expired" &&
                          row.discount.is_public
                        ) {
                          let priceDiscount = 0;

                          priceDiscount = calcWithDiscount(price, row.discount.price);

                          if (modeTime === "time") {
                            priceDiscount = calcPriceHourWithDiscount({
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
                              <Stack alignItems={"center"} justifyContent={"center"} gap={1}>
                                <Typography
                                  fontSize={14}
                                  color={(theme) => theme.palette.success.main}
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {calcPriceTotalRoom(price + price * tax, diff)}
                                </Typography>

                                <Typography
                                  fontSize={14}
                                  color={(theme) => theme.palette.error.main}
                                >
                                  {`${calcPriceTotalRoom(
                                    priceDiscount,
                                    modeTime === "time" ? 1 : diff <= 0 ? 1 : diff
                                  )} + ${calcPriceTotalRoom(
                                    priceDiscount * tax,
                                    modeTime === "time" ? 1 : diff <= 0 ? 1 : diff
                                  )} = ${calcPriceTotalRoom(
                                    priceDiscount + priceDiscount * tax,
                                    modeTime === "time" ? 1 : diff <= 0 ? 1 : diff
                                  )}`}
                                </Typography>
                              </Stack>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Typography fontSize={14} fontWeight={700}>
                              {`${calcPriceTotalRoom(price, diff)}`}
                            </Typography>
                            <Typography fontSize={14} fontWeight={700}>
                              {`+ ${calcPriceTotalRoom(price * tax, diff)}`}
                            </Typography>

                            {priceLateTime > 0 ? (
                              <>
                                <Typography fontSize={14} fontWeight={700}>
                                  {`Tính tiền thêm : + ${fNumber(priceLateTime)}`}
                                </Typography>
                                <Typography
                                  fontSize={14}
                                  fontWeight={700}
                                  color={(theme) => theme.palette.error.main}
                                >
                                  {`Lý do nhận phòng sớm: ${fDurationUsedInRoom(
                                    durationCheckIn,
                                    true
                                  )}`}
                                </Typography>
                              </>
                            ) : null}

                            <Typography fontSize={14} fontWeight={700}>
                              {`= ${calcPriceTotalRoom(
                                price + price * tax,
                                diff,
                                priceLateTime
                              )} VNĐ`}
                            </Typography>

                            <Typography fontSize={14}>Đã cộng tiền thuế VAT {tax} %</Typography>
                          </TableCellOverride>
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
                          sx={
                            column.id === "prices"
                              ? { color: (theme) => theme.palette.success.main }
                              : {}
                          }
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
                  Có vẻ như bạn chưa chọn phòng!
                </TableCell>
              </TableRow>
            )}
          </Table>

          <Box mt={2} width={"50%"}>
            <TextField
              multiline
              rows={3}
              onChange={changeNote}
              value={note}
              fullWidth
              label="Ghi chú"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingDialogConfirm;
