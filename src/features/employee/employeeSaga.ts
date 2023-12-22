import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest, all, debounce } from "redux-saga/effects";
import { isErrorAxios } from "~/helpers";
import { employeeAPI } from "~/services/apis/emloyee";
import { Filters, Pagination, SuccessResponseProp, TypeEmployeeResponse } from "~/types";
import { employeeActions } from ".";

type ResponseData = SuccessResponseProp<TypeEmployeeResponse[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(employeeAPI.get, payload);
    yield put(employeeActions.getDataSuccess(response));
  } catch (error: any) {
    let message = error.message;

    if (isErrorAxios(error)) {
      message = error.response.data.message;
    }

    yield put(employeeActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(employeeActions.getDataStart.type, getData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(employeeActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, employeeActions.setDebounceSearch.type, searchDebounce);
}

function* employeeSaga() {
  yield all([watchGetData(), watchDebounceSearch()]);
}

export default employeeSaga;
