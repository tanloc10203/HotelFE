import { Box } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useEffect } from "react";
import { FORMAT_DATETIME_SQL } from "~/constants/format";
import { appActions } from "~/features/app";
import { useUser } from "~/features/auth";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { customerActions } from "~/features/customer";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { roomActions } from "~/features/room";
import { useCalcTimeBooking } from "~/hooks/useCalcTimeBooking";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { BookingDeskTopPayload } from "~/types";
import { ModeTimeLine } from "~/types/timeline";
import { calcPriceWithOutTax } from "~/utils/convert";
import DialogChangeRoom from "./components/DialogChangeRoom";
import DialogCleanup from "./components/DialogCleanup/DialogCleanup";
import DialogGuest from "./components/DialogGuest";
import DialogListBooking from "./components/DialogListBooking";
import DialogListCustomerBooked from "./components/DialogListCustomerBooked";
import DialogServiceInformation from "./components/DialogServiceInformation";
import HeaderFrontDesk from "./components/HeaderFrontDesk";
import ListGrid from "./components/ListGrid";
import TimeLine from "./components/TimeLine";
import BookingDialog from "./form/BookingDialog";
import BookingDialogConfirm from "./form/BookingDialogConfirm";
import FormDialogCheckIn from "./form/FormDialogCheckIn";
import FormDialogSaveGuestStay from "./form/FormDialogSaveGuestStay";

const { HeadSeo, Container } = ForPage;

const FrontDeskPage: FC = () => {
  const dispatch = useAppDispatch();
  const user = useUser();

  const { checkIn, checkOut, customerBooking, modeTime, note, roomsSelected } =
    useBookingSelector();
  const { diff } = useCalcTimeBooking({ checkIn, checkOut, modeTime });

  const {
    openListCustomerBooked,
    selectRoomNumberId,
    checkIn: checkInFrontDesk,
    checkOut: checkOutFrontDesk,
    modeBooking,
    openDialogServiceInformation,
    mode,

    screenGrid: {
      openGuestDialog,
      selectedRoomNumber,
      openChangeRoomDialog,
      openCleanupDialog,
      openDialogListBooking,

      openBooking,
      openConfirm,
    },
  } = useFrontDeskSelector();

  useEffect(() => {
    dispatch(customerActions.getDataStart({ limit: 9999, page: 1 }));
  }, []);

  useEffect(() => {
    if (mode === "grid") {
      dispatch(appActions.openOverplay("Đang tải dữ liệu..."));
      dispatch(roomActions.getDataFrontDeskStart());
    }

    return () => {
      dispatch(roomActions.resetData());
    };
  }, [mode]);

  useEffect(() => {
    if (!openListCustomerBooked || !selectRoomNumberId) return;

    dispatch(
      frontDeskActions.getCustomerBookedByRoomNumberStart({
        checkIn: checkInFrontDesk.format(FORMAT_DATETIME_SQL),
        checkOut: checkOutFrontDesk.format(FORMAT_DATETIME_SQL),
        modeBooking,
        roomNumber: selectRoomNumberId,
        status: "confirmed",
      })
    );
  }, [openListCustomerBooked, modeBooking, checkInFrontDesk, checkOutFrontDesk]);

  const onToggleMode = useCallback((mode: ModeTimeLine) => {
    dispatch(frontDeskActions.setMode(mode));
  }, []);

  const onCloseBooking = useCallback(() => {
    dispatch(frontDeskActions.setToggleBooking({ open: false }));
  }, []);

  const onOpenBooking = useCallback(() => {
    dispatch(bookingActions.setCheckInOut({ type: "check-in", value: dayjs() }));
    dispatch(frontDeskActions.setToggleBooking({ open: true }));
  }, []);

  const handleOnSubmitBookingDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleBookingConfirm({ open: true }));
    onCloseBooking();
  }, []);

  const handleSubmitBookingConfirm = useCallback(() => {
    const data: BookingDeskTopPayload = {
      customerId: customerBooking?.id!,
      modeCheckPrice: modeTime,
      note,
      rooms: roomsSelected.map((t) => {
        const totalCost = calcPriceWithOutTax({
          modeBooking: modeTime,
          priceDay: t.prices.price_offline,
          priceHour: t.prices.price_hours,
          totalDateTimeCheckInOut: t.totalTime,
          discount: t.discount,
        });

        return {
          ...t,
          checkIn: t.checkIn.format(FORMAT_DATETIME_SQL),
          checkOut: t.checkOut.format(FORMAT_DATETIME_SQL),
          totalCost,
        };
      }),
      employeeId: user?.id!,
    };

    dispatch(appActions.openOverplay());
    dispatch(bookingActions.bookingDesktopStart(data));
  }, [checkIn, checkOut, diff, customerBooking, modeTime, note, roomsSelected, user]);

  const handleOnReceiveRoomDesktop = useCallback(() => {
    const data: BookingDeskTopPayload = {
      customerId: customerBooking?.id!,
      modeCheckPrice: modeTime,
      note,
      rooms: roomsSelected.map((t) => {
        const totalCost = calcPriceWithOutTax({
          modeBooking: modeTime,
          priceDay: t.prices.price_offline,
          priceHour: t.prices.price_hours,
          totalDateTimeCheckInOut: t.totalTime,
          discount: t.discount,
        });

        return {
          ...t,
          checkIn: t.checkIn.format(FORMAT_DATETIME_SQL),
          checkOut: t.checkOut.format(FORMAT_DATETIME_SQL),
          totalCost,
        };
      }),
      employeeId: user?.id!,
    };

    dispatch(appActions.openOverplay());
    dispatch(bookingActions.receiveRoomDesktopStart({ data, mode }));
  }, [checkIn, checkOut, diff, customerBooking, modeTime, note, roomsSelected, user, mode]);

  const handleOnCloseBookingConfirm = useCallback(() => {
    dispatch(frontDeskActions.setToggleBookingConfirm({ open: false }));
    dispatch(bookingActions.setRoomsSelected([]));
    dispatch(bookingActions.setCustomerBooking(null));
  }, []);

  const handleOnCloseDialogListCustomerBooked = useCallback(() => {
    dispatch(frontDeskActions.setToggleListCustomerBooked(false));
    dispatch(frontDeskActions.setSelectedRoomNumberId(""));
    dispatch(frontDeskActions.setResetCheckInOut());
    dispatch(frontDeskActions.setModeBooking("day"));
    dispatch(frontDeskActions.getCustomerBookedByRoomNumberSuccess([]));
  }, []);

  const handleCloseGuestDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleGuestDialog({ open: false, selected: null }));
    dispatch(frontDeskActions.getGuestsInRoomSuccess([]));
    dispatch(roomActions.getDataFrontDeskStart());
  }, []);

  const handleCloseChangeRoomDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleChangeRoomDialog({ open: false, selected: null }));
  }, []);

  const handleCloseCleanupDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleCleanupDialog({ open: false, selected: null }));
  }, []);

  const handleSubmitCleanup = useCallback(() => {
    if (!selectedRoomNumber) return;
    dispatch(appActions.openOverplay("Đang tiến hành..."));
    dispatch(
      frontDeskActions.cleanupStart({
        bookingDetailsId: selectedRoomNumber?.booking_detail_id!,
        mode,
      })
    );
  }, [selectedRoomNumber, mode]);

  const handleCloseDialogListBooking = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogListBooking(false));
    dispatch(bookingActions.getDataSuccess({ metadata: [], message: "" }));
  }, []);

  const handleOpenDialogListBooking = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogListBooking(true));
  }, []);

  return (
    <ForPage>
      <HeadSeo title="Lễ tân" />

      {openDialogListBooking ? (
        <DialogListBooking open={openDialogListBooking} onClose={handleCloseDialogListBooking} />
      ) : null}

      {openCleanupDialog ? (
        <DialogCleanup open onClose={handleCloseCleanupDialog} onSubmit={handleSubmitCleanup} />
      ) : null}

      {openBooking ? (
        <BookingDialog
          onSubmit={handleOnSubmitBookingDialog}
          open={openBooking}
          onClose={onCloseBooking}
        />
      ) : null}

      {openConfirm ? (
        <BookingDialogConfirm
          onSubmit={handleSubmitBookingConfirm}
          open={openConfirm}
          onClose={handleOnCloseBookingConfirm}
          onReceiveRoomDesktop={handleOnReceiveRoomDesktop}
        />
      ) : null}

      {openListCustomerBooked ? (
        <DialogListCustomerBooked
          open={openListCustomerBooked}
          onClose={handleOnCloseDialogListCustomerBooked}
        />
      ) : null}

      <FormDialogCheckIn />

      {openGuestDialog ? (
        <DialogGuest
          roomNumber={selectedRoomNumber}
          open={openGuestDialog}
          onClose={handleCloseGuestDialog}
        />
      ) : null}

      {openDialogServiceInformation ? <DialogServiceInformation /> : null}

      <FormDialogSaveGuestStay />

      {openChangeRoomDialog && selectedRoomNumber ? (
        <DialogChangeRoom
          roomNumber={selectedRoomNumber}
          open={openChangeRoomDialog}
          onClose={handleCloseChangeRoomDialog}
        />
      ) : null}

      <Container maxWidth="xl">
        <HeaderFrontDesk
          mode={mode}
          onOpenDialogListBooking={handleOpenDialogListBooking}
          onOpenBooking={onOpenBooking}
          onToggleMode={onToggleMode}
        />

        <Box mt={2}>{mode === "grid" ? <ListGrid /> : <TimeLine />}</Box>
      </Container>
    </ForPage>
  );
};

export default FrontDeskPage;
