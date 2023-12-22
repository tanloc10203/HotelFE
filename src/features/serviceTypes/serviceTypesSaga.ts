import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { serviceTypesAPI } from "~/services/apis/serviceTypes";
import { Filters, IServiceType, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { serviceTypesActions } from ".";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<IServiceType[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(serviceTypesAPI.get, payload);
    yield put(serviceTypesActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceTypesActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(serviceTypesActions.getDataStart.type, getData);
}

function* addData({
  payload: { resetForm, ...others },
}: PayloadAction<IServiceType & ResetFormType>) {
  try {
    yield delay(300);
    yield call(serviceTypesAPI.post, others);
    yield put(serviceTypesActions.addDataSuccess());
    yield call(resetForm);
    yield put(serviceTypesActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(serviceTypesActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(serviceTypesActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IServiceType & ResetFormType>) {
  try {
    yield delay(300);
    yield call(serviceTypesAPI.patch, others.id!, others);
    yield put(serviceTypesActions.addDataSuccess());
    yield call(resetForm);
    yield put(serviceTypesActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(serviceTypesActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(serviceTypesActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IServiceType>) {
  try {
    yield delay(300);
    yield call(serviceTypesAPI.delete, payload.id!);
    yield put(serviceTypesActions.addDataSuccess());
    yield put(serviceTypesActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(serviceTypesActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(serviceTypesActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(serviceTypesActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, serviceTypesActions.setDebounceSearch.type, searchDebounce);
}

function* serviceTypesSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default serviceTypesSaga;
