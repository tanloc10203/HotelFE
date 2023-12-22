import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import KeyIcon from "@mui/icons-material/Key";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import { Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { frontDeskActions } from "~/features/frontDesk";
import { guestUseServiceActions } from "~/features/guestUseServices";
import { useAppDispatch } from "~/stores";
import { BookingStatus, IBookingDetail, RoomNumberItemProps } from "~/types";
import {
  calDateTimeBooking,
  fBookingStatus,
  fBookingStatusColor,
  fDateDayjs,
  fNumber,
} from "~/utils";

type PopupInformationProps = {
  anchorEl: HTMLDivElement | null;
  open: boolean;
  onClose?: () => void;
  roomNumber: RoomNumberItemProps;
  bookingStatus?: BookingStatus;
  bookingDetails?: IBookingDetail;
};

const PopupInformation: FC<PopupInformationProps> = ({
  anchorEl,
  open,
  onClose,
  roomNumber,
  bookingStatus = "in_progress",
  bookingDetails,
}) => {
  const dispatch = useAppDispatch();

  const handleSelected = useCallback(() => {
    if (!roomNumber.booking_detail_id) return;

    dispatch(frontDeskActions.setToggleDialogServiceInformations(true));
    dispatch(frontDeskActions.setSelectedRoomNumberForServiceInformation(roomNumber));
    dispatch(guestUseServiceActions.setBookingDetailsId(roomNumber.booking_detail_id));
    onClose?.();
  }, [roomNumber]);

  const handleCheckIn = useCallback(() => {
    if (!bookingDetails) return;

    dispatch(frontDeskActions.setToggleDialogCheckIn(true));
    dispatch(frontDeskActions.setOptionsCheckIn("CHECK_IN_ALL"));
    dispatch(frontDeskActions.setSelectedRoomNumberId(roomNumber.id));
    dispatch(
      frontDeskActions.setCheckInOut({ type: "check-out", value: dayjs(bookingDetails.check_in) })
    );
    dispatch(
      frontDeskActions.setCheckInOut({ type: "check-in", value: dayjs(bookingDetails.check_out) })
    );
    dispatch(
      frontDeskActions.setCustomerBookedSelected({
        adults: roomNumber.adults!,
        bill: bookingDetails?.bill!,
        booking_id: bookingDetails.booking_id,
        check_in: bookingDetails.check_in,
        check_out: bookingDetails.check_out,
        children: bookingDetails.children,
        customer_id: bookingDetails?.bookingData?.customerData?.id!,
        discount: bookingDetails?.discount!,
        display_name: bookingDetails.bookingData?.customerData?.display_name!,
        guestInformations: bookingDetails?.guestInformations || [],
        is_booked_online: bookingDetails?.bookingData?.is_booked_online!,
        mode_booking: bookingDetails?.bookingData?.mode_booking!,
        prices: bookingDetails?.prices!,
        room_id: bookingDetails.room_id,
        room_number_id: roomNumber.id,
        roomTypeName: roomNumber.roomTypeName,
        status: bookingDetails.status,
        tax: 0.08,
        bookingData: bookingDetails.bookingData,
      })
    );
  }, [roomNumber, bookingDetails]);

  const handleClickChangeRoom = useCallback(() => {
    onClose?.();
    dispatch(frontDeskActions.setToggleChangeRoomDialog({ open: true, selected: roomNumber }));
  }, [roomNumber]);

  const handleClickCheckout = useCallback(() => {
    if (!roomNumber.booking_detail_id) return;

    dispatch(frontDeskActions.setToggleDialogServiceInformations(true));
    dispatch(frontDeskActions.setSelectedRoomNumberForServiceInformation(roomNumber));
    dispatch(guestUseServiceActions.setBookingDetailsId(roomNumber.booking_detail_id));
    dispatch(frontDeskActions.setToggleCheckoutDialog({ open: true }));
    onClose?.();
  }, [roomNumber]);

  const handleClickListGuest = useCallback(() => {
    onClose?.();
    dispatch(frontDeskActions.setToggleGuestDialog({ open: true, selected: roomNumber }));
    dispatch(frontDeskActions.setSelectedRoomNumberId(roomNumber.id));
  }, [roomNumber]);

  const isCurrentDateCheckIn = useMemo(() => {
    const isToday = dayjs(bookingDetails?.check_in).isToday();

    return isToday;
  }, [bookingDetails]);

  return (
    <Popover
      onClose={onClose}
      id={open ? "information-popover" : undefined}
      open={open}
      elevation={10}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Stack p={2} minWidth={350} gap={1}>
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <Typography fontSize={14} fontWeight={700}>
              {roomNumber?.id}
            </Typography>
            <Typography
              fontSize={14}
              color={(theme) => fBookingStatusColor(bookingStatus, theme.palette.mode)}
            >
              {fBookingStatus(bookingStatus)}
            </Typography>
          </Stack>

          <Stack flexDirection={"row"}>
            {bookingStatus === "in_progress" ||
            bookingStatus === "checked_out" ||
            bookingStatus === "completed" ? (
              <Tooltip
                arrow
                title={
                  bookingStatus === "in_progress" ? "Chỉnh sửa, thêm dịch vụ" : "Thông tin chi tiết"
                }
              >
                <IconButton size="small" onClick={handleSelected}>
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            ) : null}
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack>
          <Typography fontWeight={700}>{roomNumber?.roomTypeName}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <AccessTimeIcon fontSize="inherit" />
          </Stack>
          <Typography fontSize={12}>
            {`${fDateDayjs(dayjs(roomNumber?.check_in), "HH:mm, DD MMM")}  -  ${fDateDayjs(
              dayjs(roomNumber?.check_out),
              "HH:mm, DD MMM"
            )}`}
          </Typography>
          <Typography fontSize={12} color={(theme) => theme.palette.success.main}>
            {`(${
              calDateTimeBooking(
                roomNumber?.check_in ?? dayjs().format("YYYY-MM-DD"),
                roomNumber?.check_out ?? dayjs().format("YYYY-MM-DD"),
                roomNumber?.mode_booking ?? "day"
              ).diff
            } ${roomNumber?.mode_booking === "day" ? "ngày" : "giờ"})`}
          </Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <PersonOutlineIcon fontSize="inherit" />
          </Stack>
          <Typography fontWeight={700} fontSize={14} color={(theme) => theme.palette.success.main}>
            {roomNumber?.guestInformations?.length
              ? roomNumber?.guestInformations[0]?.full_name
              : "Chưa có thông tin lưu trú"}
          </Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <KeyIcon fontSize="inherit" />
          </Stack>
          <Typography fontSize={14}>{roomNumber?.booking_detail_id}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <PeopleOutlineIcon fontSize="inherit" />
          </Stack>
          <Typography
            fontSize={14}
          >{`${roomNumber?.adults} người lớn & ${roomNumber?.children} trẻ em & ${roomNumber?.guestInformations?.length} giấy tờ`}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <SingleBedIcon fontSize="inherit" />
          </Stack>
          <Typography fontWeight={700} fontSize={14} color={(theme) => theme.palette.success.main}>
            {roomNumber?.id}
          </Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <EditNoteIcon fontSize="inherit" />
          </Stack>
          <Typography fontSize={14}>{`Chưa có ghi chú`}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Stack fontSize={14}>
            <LocalAtmIcon fontSize="inherit" />
          </Stack>
          <Typography fontWeight={700} fontSize={14} color={(theme) => theme.palette.success.main}>
            {fNumber(roomNumber?.bill?.total_price ?? 0)}
          </Typography>
        </Stack>

        <Stack flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"flex-end"}>
          {bookingStatus === "in_progress" ||
          bookingStatus === "checked_out" ||
          bookingStatus === "completed" ||
          bookingStatus === "confirmed" ? (
            <>
              {bookingStatus === "confirmed" ? (
                isCurrentDateCheckIn ? (
                  <Button size="small" variant="outlined" color="success" onClick={handleCheckIn}>
                    Nhận phòng
                  </Button>
                ) : (
                  <Button size="small" disabled variant="outlined" color="success">
                    Chưa đên ngày nhận phòng
                  </Button>
                )
              ) : (
                <Button size="small" variant="outlined" color="success" onClick={handleSelected}>
                  Chi tiết
                </Button>
              )}
              {bookingStatus === "in_progress" ? (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={handleClickListGuest}
                  >
                    Lưu trú
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={handleClickChangeRoom}
                  >
                    Đổi phòng
                  </Button>

                  <Button size="small" variant="contained" onClick={handleClickCheckout}>
                    Trả phòng
                  </Button>
                </>
              ) : null}
            </>
          ) : null}
        </Stack>
      </Stack>
    </Popover>
  );
};

export default PopupInformation;
