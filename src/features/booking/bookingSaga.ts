import { PayloadAction } from "@reduxjs/toolkit";
import {
  all,
  call,
  debounce,
  delay,
  getContext,
  put,
  select,
  takeLatest,
} from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { RouterApp } from "~/routes/route";
import { bookingAPI } from "~/services/apis/booking";
import { bookingDetailsAPI } from "~/services/apis/bookingDetails";
import { roomAPI } from "~/services/apis/room";
import {
  BookingDeskTopPayload,
  DashboardPaths,
  Filters,
  IBooking,
  IBookingDetail,
  IRoomType,
  IRoomTypePayloadEdit,
  Pagination,
  RoomsAvailableDesktop,
  SearchingAvailableDesktopPayload,
  SuccessResponseProp,
} from "~/types";
import { ModeTimeLine, SelectWeekState } from "~/types/timeline";
import { selectWeek } from "~/utils";
import { bookingActions } from ".";
import { appActions } from "../app";
import { InitialStateFrontDeskSlice, frontDeskActions } from "../frontDesk";
import { roomActions } from "../room";

type ResponseData = SuccessResponseProp<IBooking[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(bookingAPI.get, payload);
    yield put(bookingActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetData() {
  yield takeLatest(bookingActions.getDataStart.type, getData);
}

function* getDataBookingDetails({ payload }: PayloadAction<Filters>) {
  try {
    const response: SuccessResponseProp<IBookingDetail[]> = yield call(
      bookingDetailsAPI.get,
      payload
    );
    yield put(bookingActions.getDataBookingDetailsSuccess(response.metadata));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetDataBookingDetails() {
  yield takeLatest(bookingActions.getDataBookingDetailsStart.type, getDataBookingDetails);
}

function* getRoomAvailableDesktop({ payload }: PayloadAction<SearchingAvailableDesktopPayload>) {
  try {
    const response: RoomsAvailableDesktop[] = yield call(roomAPI.getAvailableDesktop, payload);
    yield put(bookingActions.getRoomAvailableDesktopSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.getRoomAvailableDesktopFailed(message));
  }
}

function* watchGetRoomAvailableDesktop() {
  yield takeLatest(bookingActions.getRoomAvailableDesktopStart.type, getRoomAvailableDesktop);
}

function* bookingDesktop({ payload }: PayloadAction<BookingDeskTopPayload>) {
  try {
    yield delay(350);
    yield call(bookingAPI.bookingDesktop, payload);
    yield put(bookingActions.bookingDesktopSuccess());
    yield put(bookingActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Đặt phòng thành công.",
        duration: 3000,
        vertical: "bottom",
      })
    );
    yield put(frontDeskActions.setToggleBookingConfirm({ open: false }));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.bookingDesktopFailed(message));
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

function* watchBookingDesktop() {
  yield takeLatest(bookingActions.bookingDesktopStart.type, bookingDesktop);
}

function* receiveRoomDesktopStart({
  payload,
}: PayloadAction<{ data: BookingDeskTopPayload; mode: ModeTimeLine }>) {
  try {
    yield delay(350);
    yield call(bookingAPI.receiveRoomDesktop, payload.data);
    yield put(bookingActions.receiveRoomDesktopSuccess());

    if (payload.mode === "grid") {
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

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Nhận phòng thành công.",
        duration: 3000,
        vertical: "bottom",
      })
    );
    yield put(frontDeskActions.setToggleBookingConfirm({ open: false }));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.bookingDesktopFailed(message));
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

function* watchReceiveRoomDesktopStart() {
  yield takeLatest(bookingActions.receiveRoomDesktopStart.type, receiveRoomDesktopStart);
}

function* editData(_: PayloadAction<IRoomTypePayloadEdit>) {
  try {
    yield delay(300);
    yield put(bookingActions.addDataSuccess());
    yield put(bookingActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thành công",
        duration: 3000,
      })
    );
    const router: RouterApp = yield getContext("router");
    yield call(router.navigate, DashboardPaths.RoomTypes, { replace: true });
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(bookingActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IRoomType>) {
  try {
    yield delay(300);
    yield call(bookingAPI.delete, payload.id!);
    yield put(bookingActions.addDataSuccess());
    yield put(bookingActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Xóa \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bookingActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(bookingActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(bookingActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, bookingActions.setDebounceSearch.type, searchDebounce);
}

function* bookingSaga() {
  yield all([
    watchGetData(),
    watchBookingDesktop(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchGetRoomAvailableDesktop(),
    watchGetDataBookingDetails(),
    watchReceiveRoomDesktopStart(),
  ]);
}

export default bookingSaga;
