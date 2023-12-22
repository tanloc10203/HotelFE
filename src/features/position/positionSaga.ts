import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { isErrorAxios } from "~/helpers";
import { positionAPI } from "~/services/apis/positions";
import { Filters, IPosition, Pagination, SuccessResponseProp } from "~/types";
import { positionActions } from ".";

type ResponseData = SuccessResponseProp<IPosition[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(positionAPI.get, payload);
    yield put(positionActions.getDataSuccess(response));
  } catch (error: any) {
    let message = error.message;

    if (isErrorAxios(error)) {
      message = error.response.data.message;
    }

    yield put(positionActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(positionActions.getDataStart.type, getData);
}

function* positionSaga() {
  yield all([watchGetData()]);
}

export default positionSaga;
