import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { bannerAPI } from "~/services/apis/banner";
import { BannerState, Filters, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { bannerActions } from ".";
import { appActions } from "../app";
import { roomActions } from "../room";

type ResponseData = SuccessResponseProp<BannerState[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(bannerAPI.get, payload);
    yield put(bannerActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bannerActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(bannerActions.getDataStart.type, getData);
}

function* addData({ payload }: PayloadAction<FileList>) {
  try {
    yield delay(300);
    yield call(bannerAPI.postForm, payload);
    yield put(bannerActions.addDataSuccess());
    yield put(
      appActions.setSnackbar({ text: "Thêm banner thành công", open: true, severity: "success" })
    );
    yield put(bannerActions.getDataStart({ limit: 5, page: 1 }));
    yield put(roomActions.setToggleDialogAddFloor(false));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bannerActions.addDataFailed(message));
    yield put(appActions.setSnackbar({ text: message, open: true, severity: "error" }));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(bannerActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<BannerState & ResetFormType>) {
  try {
    yield delay(300);
    yield call(bannerAPI.patch, others.id!, others);
    yield put(bannerActions.addDataSuccess());
    yield call(resetForm);
    yield put(bannerActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(bannerActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(bannerActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<string>) {
  try {
    yield delay(300);
    yield call(bannerAPI.delete, payload);
    yield put(bannerActions.addDataSuccess());
    yield put(bannerActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Xóa \`${payload}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(bannerActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchDeleteData() {
  yield takeLatest(bannerActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(bannerActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, bannerActions.setDebounceSearch.type, searchDebounce);
}

function* bannerSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default bannerSaga;
