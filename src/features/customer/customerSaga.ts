import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { customerAPI } from "~/services/apis/customer";
import { CustomerPayload, Filters, ICustomer, Pagination, SuccessResponseProp } from "~/types";
import { customerActions } from ".";
import { frontDeskActions } from "../frontDesk";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<ICustomer[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(customerAPI.get, payload);
    yield put(customerActions.getDataSuccess(response));
  } catch (error) {
    let message = messageErrorAxios(error);
    yield put(customerActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(customerActions.getDataStart.type, getData);
}

function* addFromFrontDesk({
  payload,
}: PayloadAction<{ data: CustomerPayload; resetForm: () => void }>) {
  try {
    yield delay(350);
    yield call(customerAPI.addFromFrontDesk, payload.data);
    yield put(customerActions.getDataStart({ limit: 9999, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm khách hàng thành công",
        duration: 3000,
        vertical: "bottom",
      })
    );
    yield call(payload.resetForm);
    yield put(customerActions.addFrontDeskSuccess());
    yield put(frontDeskActions.setToggleAddCustomerDialog({ open: false }));
  } catch (error) {
    let message = messageErrorAxios(error);
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "error",
        text: message,
        duration: 3000,
        vertical: "bottom",
      })
    );
    yield put(customerActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddFromFrontDesk() {
  yield takeLatest(customerActions.addFrontDeskStart.type, addFromFrontDesk);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(customerActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, customerActions.setDebounceSearch.type, searchDebounce);
}

function* customerSaga() {
  yield all([watchGetData(), watchDebounceSearch(), watchAddFromFrontDesk()]);
}

export default customerSaga;
