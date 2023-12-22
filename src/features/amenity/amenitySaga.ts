import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { Filters, IAmenityResponse, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { amenityActions } from "./amenitySlice";
import { appActions } from "../app";
import { amenityAPI } from "~/services/apis/amenity";

type ResponseData = SuccessResponseProp<IAmenityResponse[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(amenityAPI.get, payload);
    yield put(amenityActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(amenityActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(amenityActions.getDataStart.type, getData);
}

function* addData({
  payload: { resetForm, ...others },
}: PayloadAction<IAmenityResponse & ResetFormType>) {
  try {
    yield delay(300);
    yield call(amenityAPI.post, others);
    yield put(amenityActions.addDataSuccess());
    yield call(resetForm);
    yield put(amenityActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(amenityActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(amenityActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IAmenityResponse & ResetFormType>) {
  try {
    yield delay(300);
    yield call(amenityAPI.patch, others.id!, others);
    yield put(amenityActions.addDataSuccess());
    yield call(resetForm);
    yield put(amenityActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(amenityActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(amenityActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IAmenityResponse>) {
  try {
    yield delay(300);
    yield call(amenityAPI.delete, payload.id!);
    yield put(amenityActions.addDataSuccess());
    yield put(amenityActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(amenityActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(amenityActions.deleteDataStart.type, deleteData);
}

function* restoreData({ payload }: PayloadAction<IAmenityResponse>) {
  try {
    yield delay(300);
    yield call(amenityAPI.restore, payload.id!);
    yield put(amenityActions.addDataSuccess());
    yield put(amenityActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
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
    yield put(amenityActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchRestore() {
  yield takeLatest(amenityActions.restoreDataStart.type, restoreData);
}

function* deleteInTrash({ payload }: PayloadAction<IAmenityResponse>) {
  try {
    yield delay(300);
    yield call(amenityAPI.deleteInTrash, payload.id!);
    yield put(amenityActions.addDataSuccess());
    yield put(amenityActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
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
    yield put(amenityActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteInTrash() {
  yield takeLatest(amenityActions.deleteInTrashStart.type, deleteInTrash);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(amenityActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, amenityActions.setDebounceSearch.type, searchDebounce);
}

function* amenitySaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchRestore(),
    watchDeleteInTrash(),
  ]);
}

export default amenitySaga;
