import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { rateAPI } from "~/services/apis/rate";
import { Filters, Pagination, RateState, SuccessResponseProp } from "~/types";
import { rateActions } from ".";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<RateState[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(rateAPI.get, payload);
    yield put(rateActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(rateActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetData() {
  yield takeLatest(rateActions.getDataStart.type, getData);
}

function* editData({ payload }: PayloadAction<Partial<RateState>>) {
  try {
    yield delay(300);
    yield call(rateAPI.patch, payload.id!, payload);
    yield put(rateActions.editDataSuccess());
    yield put(rateActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(rateActions.editDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(rateActions.editDataStart.type, editData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(rateActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, rateActions.setDebounceSearch.type, searchDebounce);
}

function* rateSaga() {
  yield all([watchGetData(), watchEditData(), watchDebounceSearch()]);
}

export default rateSaga;
