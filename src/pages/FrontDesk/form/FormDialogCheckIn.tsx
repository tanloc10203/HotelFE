import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Box,
  LinearProgress,
  SelectChangeEvent,
  Stack,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import dayjs from "dayjs";
import { isNumber } from "lodash";
import { FC, useCallback, useLayoutEffect, useMemo } from "react";
import { ColumnState, SelectInput, TableCellOverride, Transition } from "~/components";
import { FORMAT_DATETIME_SQL } from "~/constants/format";
import { appActions } from "~/features/app";
import { useUser } from "~/features/auth";
import { OptionsCheckIn, frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { CheckInPayload, GetCustomerBooked } from "~/types";
import {
  calcPriceCheckInLate,
  checkInLate,
  currentDate,
  fCapitalizeFirstLetter,
  fDateDayjs,
  fDurationUsedInRoom,
  fNumber,
} from "~/utils";

const { Table } = ForPage;

type FormDialogCheckInProps = {
  onSubmit?: () => void;
};

const FormDialogCheckIn: FC<FormDialogCheckInProps> = () => {
  const {
    isLoading,
    modeBooking,
    openDialogCheckIn,
    customerBookedSelected,
    selectRoomNumberId,
    optionCheckIn,
    checkIn,
    checkOut,
    customerBookedCheckIns,
  } = useFrontDeskSelector();
  const dispatch = useAppDispatch();
  const user = useUser();

  useLayoutEffect(() => {
    if (
      !openDialogCheckIn ||
      !selectRoomNumberId ||
      !customerBookedSelected ||
      optionCheckIn === "CHECK_IN_ONE"
    )
      return;

    dispatch(
      frontDeskActions.getCustomerBookedCheckInsStart({
        checkIn: checkIn.format(FORMAT_DATETIME_SQL),
        checkOut: checkOut.format(FORMAT_DATETIME_SQL),
        modeBooking: modeBooking,
        roomNumber: selectRoomNumberId,
        customerId: customerBookedSelected.customer_id,
        status: "confirmed",
      })
    );
  }, [openDialogCheckIn, selectRoomNumberId, customerBookedSelected, optionCheckIn]);

  const columns: ColumnState[] = useMemo(
    () => [
      {
        id: "roomTypeName",
        label: "Loại phòng",
      },
      {
        id: "room_number_id",
        label: "Phòng",
        align: "center",
      },
      {
        id: "check_in",
        label: "Ngày nhận phòng",
        format(value) {
          return fCapitalizeFirstLetter(fDateDayjs(dayjs(value)));
        },
      },
      {
        id: "check_out",
        label: "Ngày trả phòng",
        format(value) {
          return fCapitalizeFirstLetter(fDateDayjs(dayjs(value)));
        },
      },
      {
        id: "overCheckIn",
        label: "Nhận phòng trễ",
      },
      {
        id: "lateCheckIn",
        label: "Nhận phòng sớm",
      },
      {
        id: "prices",
        label: `Thành tiền`,
        align: "center",
      },
    ],
    []
  );

  const onClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogCheckIn(false));
    dispatch(frontDeskActions.setCustomerBookedSelected(null));
    dispatch(frontDeskActions.setOptionsCheckIn("CHECK_IN_ALL"));
    dispatch(frontDeskActions.getCustomerBookedCheckInsSuccess([]));
  }, []);

  const options = useMemo(() => {
    return [
      { label: "Khách muốn nhận tất cả phòng đã đặt", value: "CHECK_IN_ALL" },
      { label: `Chỉ nhận phòng ${selectRoomNumberId}`, value: "CHECK_IN_ONE" },
    ];
  }, [selectRoomNumberId]);

  const handleChangeOptions = useCallback((event: SelectChangeEvent<unknown>) => {
    dispatch(frontDeskActions.setOptionsCheckIn(event.target.value as OptionsCheckIn));
  }, []);

  const dataRender = useMemo(() => {
    if (!selectRoomNumberId || !customerBookedSelected) return [];

    if (optionCheckIn === "CHECK_IN_ONE") return [customerBookedSelected];

    return customerBookedCheckIns;
  }, [optionCheckIn, customerBookedCheckIns]);

  const handleSubmitConfirm = useCallback(() => {
    if (!user || !customerBookedCheckIns.length || !customerBookedSelected) return;

    const data: CheckInPayload = {
      booking_id: customerBookedSelected.booking_id,
      customer_id: customerBookedSelected.customer_id,
      employee_id: user.id!,
      is_booked_online: isNumber(customerBookedSelected.is_booked_online)
        ? Boolean(customerBookedSelected.is_booked_online === 1)
        : customerBookedSelected.is_booked_online,
      modeBooking: customerBookedSelected.mode_booking,
      bookingDetails: customerBookedCheckIns.map((row) => ({
        check_in: row.check_in,
        check_out: row.check_out,
        id: row.id!,
        prices: row.prices,
        room_id: row.room_id,
        room_number_id: row.room_number_id,
      })),
    };

    dispatch(appActions.openOverplay("Đang check-in..."));
    dispatch(frontDeskActions.checkInStart(data));
  }, [customerBookedCheckIns, user]);

  return (
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      fullWidth
      open={openDialogCheckIn}
      onClose={onClose}
    >
      <AppBar sx={{ position: "relative" }} color="inherit">
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Xác nhận nhận phòng
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            <Button onClick={onClose} variant="outlined" color="error">
              Hủy bỏ
            </Button>
            <Button variant="contained" onClick={handleSubmitConfirm}>
              Xác nhận và thêm thông tin lưu trú
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <DialogContent dividers={true}>
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <PersonIcon />
            <Typography
              color={(theme) => theme.palette.success.main}
              fontWeight={600}
            >{`Khách hàng: ${customerBookedSelected?.display_name}`}</Typography>
          </Stack>

          <Box width={"28%"}>
            <SelectInput
              value={optionCheckIn}
              onChange={handleChangeOptions}
              options={options}
              label="Hình thức nhận phòng"
              sizeForm="small"
            />
          </Box>
        </Stack>

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
            {!dataRender.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component="th" scope="row">
                  Danh sách phòng mà anh đã đặt
                </TableCell>
              </TableRow>
            ) : (
              dataRender.map((row, index) => (
                <TableRow key={`${row.booking_id}-${index}`}>
                  {columns.map((column, index) => {
                    const value = row[column.id as keyof GetCustomerBooked];
                    const durationCheckIn = checkInLate(row.check_in);
                    const priceOverCheckIn = calcPriceCheckInLate(
                      durationCheckIn,
                      row.discount,
                      row.prices
                    );

                    const priceLateTime = durationCheckIn.late
                      ? priceOverCheckIn + priceOverCheckIn * row.tax
                      : 0;

                    if (column.id === "prices") {
                      return (
                        <TableCellOverride key={index} {...column}>
                          <Typography fontSize={14} fontWeight={700}>{`${fNumber(
                            Number(row?.bill?.cost_room)
                          )} ${
                            durationCheckIn.late
                              ? `+ ${fNumber(
                                  priceOverCheckIn + priceOverCheckIn * row.tax
                                )} = ${fNumber(Number(row?.bill?.cost_room) + priceLateTime)} `
                              : ""
                          }VNĐ `}</Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                          >{`(đã tính thuế VAT ${row.tax}%)`}</Typography>
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "overCheckIn") {
                      return (
                        <TableCellOverride key={index} {...column}>
                          {!durationCheckIn.late ? (
                            <>
                              <Typography fontSize={14}>
                                {`${currentDate().format("DD/MM/YYYY HH:mm:ss")}`}
                              </Typography>
                              <Typography fontSize={14} fontWeight={700}>
                                {`Trễ  ${fDurationUsedInRoom(durationCheckIn, true)}`}
                              </Typography>
                            </>
                          ) : (
                            "Không có"
                          )}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "lateCheckIn") {
                      return (
                        <TableCellOverride key={index} {...column}>
                          {durationCheckIn.late ? (
                            <>
                              <Typography fontSize={14}>
                                {`${currentDate().format("DD/MM/YYYY HH:mm:ss")}`}
                              </Typography>
                              <Typography fontSize={14}>
                                {`Giá tiền (${fNumber(
                                  priceOverCheckIn + priceOverCheckIn * row.tax
                                )} VNĐ)`}
                              </Typography>
                              <Typography fontSize={14} fontWeight={700}>
                                {`Sớm  ${fDurationUsedInRoom(durationCheckIn, true)}`}
                              </Typography>
                            </>
                          ) : (
                            "Không có"
                          )}
                        </TableCellOverride>
                      );
                    }

                    return (
                      <TableCellOverride key={index} {...column}>
                        {column.format ? column.format(value) : (value as string)}
                      </TableCellOverride>
                    );
                  })}
                </TableRow>
              ))
            )}
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialogCheckIn;
