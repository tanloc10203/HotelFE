import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, select, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { guestStayInformationAPI } from "~/services/apis/guestStayInformation";
import { roomAPI } from "~/services/apis/room";
import {
  AddGuestStayInformationPayload,
  ChangeRoomPayload,
  CheckInPayload,
  CheckoutPayload,
  GetChangeRoomsQuery,
  GetCustomerBooked,
  GetCustomerBookedPayload,
  IGuestStayInformation,
  InformationRoomDetails,
  ResetFormType,
  RoomsAvailableDesktop,
  SuccessResponseProp,
} from "~/types";
import { ModeTimeLine, SelectWeekState } from "~/types/timeline";
import { selectWeek } from "~/utils";
import { InitialStateFrontDeskSlice, frontDeskActions } from ".";
import { appActions } from "../app";
import { roomActions } from "../room";

function* getCustomerByRoomNumber({ payload }: PayloadAction<GetCustomerBookedPayload>) {
  try {
    yield delay(300);
    const response: GetCustomerBooked[] = yield call(roomAPI.getCustomerByRoomNumber, payload);
    yield put(frontDeskActions.getCustomerBookedByRoomNumberSuccess(response));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getCustomerBookedByRoomNumberFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetCustomerByRoomNumber() {
  yield takeLatest(
    frontDeskActions.getCustomerBookedByRoomNumberStart.type,
    getCustomerByRoomNumber
  );
}

function* getInformationRoom({ payload }: PayloadAction<string>) {
  try {
    const response: InformationRoomDetails = yield call(roomAPI.getInformationRoom, payload);
    yield put(frontDeskActions.getInformationRoomSuccess(response));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getInformationRoomFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetInformationRoom() {
  yield takeLatest(frontDeskActions.getInformationRoomStart.type, getInformationRoom);
}

function* getCustomerCheckIn({ payload }: PayloadAction<GetCustomerBookedPayload>) {
  try {
    yield delay(300);
    const response: GetCustomerBooked[] = yield call(roomAPI.getCustomerByRoomNumber, payload);
    yield put(frontDeskActions.getCustomerBookedCheckInsSuccess(response));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getCustomerBookedCheckInsFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetCustomerCheckIn() {
  yield takeLatest(frontDeskActions.getCustomerBookedCheckInsStart.type, getCustomerCheckIn);
}

function* checkIn({ payload }: PayloadAction<CheckInPayload>) {
  try {
    yield delay(300);
    yield call(roomAPI.checkIn, payload);
    yield put(frontDeskActions.checkInSuccess());
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Nhận phòng thành công.",
        duration: 3000,
        vertical: "bottom",
      })
    );
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getCustomerBookedCheckInsFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchCheckIn() {
  yield takeLatest(frontDeskActions.checkInStart.type, checkIn);
}

function* checkOut({ payload }: PayloadAction<CheckoutPayload>) {
  try {
    yield delay(300);
    const response: InformationRoomDetails = yield call(
      roomAPI.checkOut,
      payload.bookingDetailsId,
      payload
    );
    yield put(frontDeskActions.checkOutSuccess(response));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Trả phòng thành công.",
        duration: 3000,
        vertical: "bottom",
      })
    );
    const { mode }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);

    if (mode === "grid") {
      yield put(roomActions.getDataFrontDeskStart());
    } else {
      const {
        timeline: { dateRange },
      }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);
      const date: SelectWeekState[] = yield call(selectWeek, dateRange);

      yield put(
        roomActions.getDataFrontDeskTimelineStart({
          startDate: date[0].date,
          endDate: date[date.length - 1].date,
        })
      );
    }
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getCustomerBookedCheckInsFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchCheckOut() {
  yield takeLatest(frontDeskActions.checkOutStart.type, checkOut);
}

function* cleanupRoom({
  payload,
}: PayloadAction<{ bookingDetailsId: string; mode: ModeTimeLine }>) {
  try {
    yield delay(300);
    yield call(roomAPI.cleanupRoom, payload.bookingDetailsId);
    yield put(frontDeskActions.cleanupSuccess());
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Dọn phòng hoàn thành.",
        duration: 3000,
        vertical: "bottom",
      })
    );

    const { mode }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);

    if (mode === "grid") {
      yield put(roomActions.getDataFrontDeskStart());
    } else {
      const {
        timeline: { dateRange },
      }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);
      const date: SelectWeekState[] = yield call(selectWeek, dateRange);

      yield put(
        roomActions.getDataFrontDeskTimelineStart({
          startDate: date[0].date,
          endDate: date[date.length - 1].date,
        })
      );
    }
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getGuestsInRoomError(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchCleanupRoom() {
  yield takeLatest(frontDeskActions.cleanupStart.type, cleanupRoom);
}

function* addGuestStayInformation({
  payload,
}: PayloadAction<{
  data: AddGuestStayInformationPayload;
  resetForm: ResetFormType;
}>) {
  try {
    yield delay(300);
    const { data, resetForm } = payload;
    const response: GetCustomerBooked[] = yield call(roomAPI.addGuestStayInformation, data);
    yield call(resetForm.resetForm);
    yield put(frontDeskActions.addIdentificationGuestSuccess(response));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm thông tin lưu trú thành công",
        duration: 3000,
        vertical: "bottom",
      })
    );
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getCustomerBookedCheckInsFailed(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddGuestStayInformation() {
  yield takeLatest(frontDeskActions.addIdentificationGuestStart.type, addGuestStayInformation);
}

function* getGuestInRoom({
  payload,
}: PayloadAction<{ bookingDetailsId: string; roomNumberId: string }>) {
  try {
    yield delay(300);
    const response: SuccessResponseProp<IGuestStayInformation[]> = yield call(
      guestStayInformationAPI.get,
      {
        limit: 9999,
        booking_details_id: payload.bookingDetailsId,
        room_number: payload.roomNumberId,
      }
    );

    yield put(frontDeskActions.getGuestsInRoomSuccess(response.metadata));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getGuestsInRoomError(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetGuestsInRoom() {
  yield takeLatest(frontDeskActions.getGuestsInRoomStart.type, getGuestInRoom);
}

function* getDataChangeRooms({ payload }: PayloadAction<GetChangeRoomsQuery>) {
  try {
    yield delay(300);
    const response: RoomsAvailableDesktop[] = yield call(roomAPI.getChangeRooms, payload);

    yield put(frontDeskActions.getDataChangeRoomSuccess(response));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getGuestsInRoomError(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetDataChangeRooms() {
  yield takeLatest(frontDeskActions.getDataChangeRoomStart.type, getDataChangeRooms);
}

function* addGuestInRoom({
  payload,
}: PayloadAction<{ data: IGuestStayInformation; resetForm: () => void; mode: "add" | "edit" }>) {
  try {
    yield delay(300);

    let response: IGuestStayInformation[] = [];
    let message = "Thêm thông tin khách thành công";

    if (payload.mode === "add") {
      response = yield call(guestStayInformationAPI.post, payload.data);
    } else {
      const { created_at, updated_at, deleted_at, ...othersData } = payload.data;

      response = yield call(guestStayInformationAPI.patch, String(payload.data.id), othersData);
    }

    yield call(payload.resetForm);

    if (payload.mode === "edit") {
      message = "Cập nhật thông tin khách thành công";
      yield put(frontDeskActions.setSelectedGuestEdit(null));
    }

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );

    yield put(frontDeskActions.addGuestsInRoomSuccess(response));
    yield put(frontDeskActions.setToggleDialogAddGuest(false));
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getGuestsInRoomError(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddGuestsInRoom() {
  yield takeLatest(frontDeskActions.addGuestsInRoomStart.type, addGuestInRoom);
}

function* changeRoom({ payload }: PayloadAction<ChangeRoomPayload>) {
  try {
    yield delay(300);

    yield call(roomAPI.changeRoom, payload);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thay đổi phòng thành công",
        duration: 3000,
        vertical: "bottom",
      })
    );

    yield put(frontDeskActions.changeRoomSuccess());

    const { mode }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);

    if (mode === "grid") {
      yield put(roomActions.getDataFrontDeskStart());
    } else {
      const {
        timeline: { dateRange },
      }: InitialStateFrontDeskSlice = yield select((state) => state.frontDesk);
      const date: SelectWeekState[] = yield call(selectWeek, dateRange);

      yield put(
        roomActions.getDataFrontDeskTimelineStart({
          startDate: date[0].date,
          endDate: date[date.length - 1].date,
        })
      );
    }
  } catch (error: any) {
    const message = messageErrorAxios(error);
    yield put(frontDeskActions.getGuestsInRoomError(message));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchChangeRoom() {
  yield takeLatest(frontDeskActions.changeRoomStart.type, changeRoom);
}

function* frontDeskSaga() {
  yield all([
    watchGetCustomerByRoomNumber(),
    watchGetCustomerCheckIn(),
    watchCheckIn(),
    watchAddGuestStayInformation(),
    watchGetInformationRoom(),
    watchCheckOut(),
    watchGetGuestsInRoom(),
    watchAddGuestsInRoom(),
    watchGetDataChangeRooms(),
    watchChangeRoom(),
    watchCleanupRoom(),
  ]);
}

export default frontDeskSaga;
