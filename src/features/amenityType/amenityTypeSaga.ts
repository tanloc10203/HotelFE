import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { Filters, IAmenitie, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { amenityTypeActions } from "./amenityTypeSlice";
import { appActions } from "../app";
import { amenityTypeAPI } from "~/services/apis/amenityType";

type ResponseData = SuccessResponseProp<IAmenitie[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(amenityTypeAPI.get, payload);
    yield put(amenityTypeActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(amenityTypeActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(amenityTypeActions.getDataStart.type, getData);
}

function* addData({ payload: { resetForm, ...others } }: PayloadAction<IAmenitie & ResetFormType>) {
  try {
    yield delay(300);
    yield call(amenityTypeAPI.post, others);
    yield put(amenityTypeActions.addDataSuccess());
    yield call(resetForm);
    yield put(amenityTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(amenityTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(amenityTypeActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IAmenitie & ResetFormType>) {
  try {
    yield delay(300);
    yield call(amenityTypeAPI.patch, others.id!, others);
    yield put(amenityTypeActions.addDataSuccess());
    yield call(resetForm);
    yield put(amenityTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(amenityTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(amenityTypeActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IAmenitie>) {
  try {
    yield delay(300);
    yield call(amenityTypeAPI.delete, payload.id!);
    yield put(amenityTypeActions.addDataSuccess());
    yield put(amenityTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(amenityTypeActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(amenityTypeActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(amenityTypeActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, amenityTypeActions.setDebounceSearch.type, searchDebounce);
}

function* amenityTypeSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default amenityTypeSaga;
