import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, getContext, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { RouterApp } from "~/routes/route";
import { roomTypeAPI } from "~/services/apis/roomType";
import {
  DashboardPaths,
  Filters,
  IRoomType,
  IRoomTypePayload,
  IRoomTypePayloadEdit,
  IRoomTypeResponse,
  Pagination,
  SuccessResponseProp,
} from "~/types";
import { roomTypeActions } from ".";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<IRoomTypeResponse[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(roomTypeAPI.get, payload);
    yield put(roomTypeActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomTypeActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(roomTypeActions.getDataStart.type, getData);
}

function* addData({ payload: { ...others } }: PayloadAction<IRoomTypePayload>) {
  try {
    yield delay(300);
    yield call(roomTypeAPI.postAdd, others);
    yield put(roomTypeActions.addDataSuccess());
    yield put(roomTypeActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới thành công",
        duration: 3000,
      })
    );

    const router: RouterApp = yield getContext("router");
    yield call(router.navigate, DashboardPaths.RoomTypes, { replace: true });
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(roomTypeActions.addDataStart.type, addData);
}

function* editData({ payload: { ...others } }: PayloadAction<IRoomTypePayloadEdit>) {
  try {
    yield delay(300);
    yield call(roomTypeAPI.patchEdit, others, others.id!);
    yield put(roomTypeActions.addDataSuccess());
    yield put(roomTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(roomTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(roomTypeActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IRoomType>) {
  try {
    yield delay(300);
    yield call(roomTypeAPI.delete, payload.id!);
    yield put(roomTypeActions.addDataSuccess());
    yield put(roomTypeActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Đã chuyển  \`${payload.name}\` vào thùng rác thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomTypeActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(roomTypeActions.deleteDataStart.type, deleteData);
}

function* restoreData({ payload }: PayloadAction<IRoomType>) {
  try {
    yield delay(300);
    yield call(roomTypeAPI.restore, payload.id!);
    yield put(roomTypeActions.addDataSuccess());
    yield put(roomTypeActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Khôi phục dữ liệu  \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomTypeActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchRestore() {
  yield takeLatest(roomTypeActions.restoreDataStart.type, restoreData);
}

function* deleteInTrash({ payload }: PayloadAction<IRoomType>) {
  try {
    yield delay(300);
    yield call(roomTypeAPI.deleteInTrash, payload.id!);
    yield put(roomTypeActions.addDataSuccess());
    yield put(roomTypeActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Đã xóa vĩnh viễn dữ liệu  \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(roomTypeActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteInTrash() {
  yield takeLatest(roomTypeActions.deleteInTrashStart.type, deleteInTrash);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(roomTypeActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, roomTypeActions.setDebounceSearch.type, searchDebounce);
}

function* roomTypeSaga() {
  yield all([
    watchRestore(),
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDeleteInTrash(),
    watchDebounceSearch(),
  ]);
}

export default roomTypeSaga;
