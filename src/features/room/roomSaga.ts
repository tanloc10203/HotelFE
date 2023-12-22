import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, getContext, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { RouterApp } from "~/routes/route";
import { roomAPI } from "~/services/apis/room";
import {
  DashboardPaths,
  Filters,
  FrontDesk,
  FrontDeskTimeline,
  IRoom,
  IRoomResponse,
  Pagination,
  RoomAddDiscount,
  RoomPayloadAdd,
  SuccessResponseProp,
} from "~/types";
import { roomActions } from ".";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<IRoomResponse[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(roomAPI.get, payload);
    yield put(roomActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(roomActions.getDataStart.type, getData);
}

function* getDataFrontDesk() {
  try {
    const response: FrontDesk[] = yield call(roomAPI.getFrontDesk);
    yield put(roomActions.getDataFrontDeskSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetDataFrontDesk() {
  yield takeLatest(roomActions.getDataFrontDeskStart.type, getDataFrontDesk);
}

function* getDataFrontTimelineDesk({
  payload,
}: PayloadAction<{ startDate: string; endDate: string }>) {
  try {
    const response: FrontDeskTimeline[] = yield call(roomAPI.getFrontDeskTimeline, payload);
    yield put(roomActions.getDataFrontDeskTimelineSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetDataFrontTimelineDesk() {
  yield takeLatest(roomActions.getDataFrontDeskTimelineStart.type, getDataFrontTimelineDesk);
}

function* addData({ payload }: PayloadAction<RoomPayloadAdd>) {
  try {
    yield delay(300);
    yield call(roomAPI.postFormData, payload);
    yield put(roomActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới thành công",
        duration: 3000,
      })
    );
    const router: RouterApp = yield getContext("router");
    yield call(router.navigate, DashboardPaths.Room, { replace: true });
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(roomActions.addDataStart.type, addData);
}

function* addDiscount({ payload }: PayloadAction<RoomAddDiscount>) {
  try {
    yield delay(300);
    yield call(roomAPI.addDiscount, { ...payload });
    yield put(roomActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Lưu khuyến mãi thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddDiscount() {
  yield takeLatest(roomActions.addDiscountStart.type, addDiscount);
}

function* editData({ payload }: PayloadAction<RoomPayloadAdd>) {
  try {
    yield delay(300);
    yield call(roomAPI.patchFormData, payload);
    yield put(roomActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thành công",
        duration: 3000,
      })
    );
    const router: RouterApp = yield getContext("router");
    yield call(router.navigate, DashboardPaths.Room, { replace: true });
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(roomActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IRoom>) {
  try {
    yield delay(300);
    yield call(roomAPI.delete, payload.id!);
    yield put(roomActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Xóa \`${payload.id}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(roomActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(roomActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, roomActions.setDebounceSearch.type, searchDebounce);
}

function* roomSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchAddDiscount(),
    watchGetDataFrontDesk(),
    watchGetDataFrontTimelineDesk(),
  ]);
}

export default roomSaga;
