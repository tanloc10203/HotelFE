import { Box, Stack, TableCell } from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { isInteger } from "lodash";
import { FC, MouseEvent, memo, useCallback, useEffect, useMemo, useState } from "react";
import { appActions } from "~/features/app";
import { frontDeskActions } from "~/features/frontDesk";
import { roomAPI } from "~/services/apis/room";
import { useAppDispatch } from "~/stores";
import {
  BookingFrontDeskTimeline,
  BookingStatus,
  IBookingDetail,
  IRoomNumber,
  RoomNumberItemProps,
} from "~/types";
import { SelectWeekState } from "~/types/timeline";
import { fBookingStatusColorText, fBookingStatusTimelineColor } from "~/utils";
import PopupInformation from "../RoomNumberItem/PopupInformation";
dayjs.extend(isBetween);

type TableRowEventBookingProps = {
  row: IRoomNumber;
  date: SelectWeekState;
  booking: BookingFrontDeskTimeline;
  status: "between" | "start" | "end";
};

const TableRowEventBooking: FC<TableRowEventBookingProps> = ({ booking, status }) => {
  const dispatch = useAppDispatch();
  const [open, onOpen] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<null | IBookingDetail>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const isStart = useMemo(() => Boolean(status === "start"), [status]);
  const isEnd = useMemo(() => Boolean(status === "end"), [status]);

  useEffect(() => {
    if (!booking.id || !open) return;

    (async () => {
      try {
        dispatch(appActions.openOverplay());
        const response = await roomAPI.getInfoInDetailsBooking(booking.id!);
        setBookingDetails(response);
      } catch (error) {
        console.log(`error get info`, error);
      } finally {
        dispatch(appActions.closeOverplay());
      }
    })();
  }, [booking, open]);

  const handleClickPopup = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onOpen(true);
      setAnchorEl(event.currentTarget);
    },
    [booking]
  );

  const handleClosePopup = useCallback(() => {
    setAnchorEl(null);
    onOpen(false);
  }, []);

  const initialValues = useMemo((): RoomNumberItemProps | null => {
    if (!bookingDetails) return null;

    const {
      id,
      bookingData,
      prices,
      roomType,
      adults,
      children,
      bill,
      room_number_id,
      check_in,
      check_out,
      guestInformations,
    } = bookingDetails;

    const { is_booked_online } = bookingData!;
    const isOnline = isInteger(is_booked_online)
      ? Boolean(is_booked_online === 1)
      : Boolean(is_booked_online);

    return {
      id: room_number_id,
      priceDay: isOnline ? Number(prices?.price_online) : Number(prices?.price_online),
      priceHour: isOnline
        ? Number(prices?.price_hours?.[0].price)
        : Number(prices?.price_hours?.[0].price),
      roomTypeId: Number(roomType?.id),
      roomTypeName: String(roomType?.name),
      status: "unavailable",
      adults: Number(adults),
      children: Number(children || 0),
      guestInformations: guestInformations,
      bill: bill,
      booking_detail_id: id,
      check_in,
      check_out,
      mode_booking: bookingData?.mode_booking,
    };
  }, [bookingDetails]);

  useEffect(() => {
    if (!initialValues || booking.status !== "checked_out" || !open) return;

    // Cleanup room
    dispatch(frontDeskActions.setToggleCleanupDialog({ open: true, selected: initialValues }));
    onOpen(false);
  }, [booking, open, initialValues]);

  useEffect(() => {
    if (!initialValues || booking.status !== "confirmed" || !open) return;

    // Receive Room
    // dispatch(frontDeskActions.setToggleListCustomerBooked(true));
    // dispatch(frontDeskActions.setSelectedRoomNumberId(booking.room_number_id));
    // onOpen(false);
  }, [booking, open, initialValues]);

  return (
    <TableCell
      sx={{ padding: status === "start" ? `0 0 0 4px` : status === "end" ? `0 4px 0 0` : `0` }}
    >
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Box
          sx={{
            height: 35,
            width: "100%",
            background: (theme) =>
              fBookingStatusTimelineColor(booking.status as BookingStatus, theme.palette.mode),
            borderRadius: isStart ? `8px 0 0 8px` : isEnd ? `0 8px 8px  0` : "0",
            textAlign: isStart ? "left" : isEnd ? "right" : "",
            cursor: "pointer",
            p: 1,
            color: (theme) =>
              fBookingStatusColorText(booking.status as BookingStatus, theme.palette.mode),
          }}
          onClick={handleClickPopup}
        >
          {isStart
            ? booking.id
            : isEnd
            ? `${dayjs(booking.check_in).format("DD/MM HH:mm")} - ${dayjs(booking.check_out).format(
                "DD/MM HH:mm"
              )}`
            : ""}
        </Box>
      </Stack>

      {open && bookingDetails && initialValues ? (
        <PopupInformation
          roomNumber={initialValues}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          //@ts-ignore
          bookingStatus={booking.status}
          onClose={handleClosePopup}
          bookingDetails={bookingDetails}
        />
      ) : null}
    </TableCell>
  );
};

export default memo(TableRowEventBooking);
