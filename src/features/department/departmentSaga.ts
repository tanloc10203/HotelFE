import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { departmentAPI } from "~/services/apis/department";
import { Filters, IDepartment, Pagination, SuccessResponseProp } from "~/types";
import { departmentActions } from ".";

type ResponseData = SuccessResponseProp<IDepartment[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(departmentAPI.get, payload);
    yield put(departmentActions.getDataSuccess(response));
  } catch (error) {
    let message = messageErrorAxios(error);
    yield put(departmentActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(departmentActions.getDataStart.type, getData);
}

function* departmentSaga() {
  yield all([watchGetData()]);
}

export default departmentSaga;
