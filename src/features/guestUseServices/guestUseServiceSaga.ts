import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { guestUseServiceAPI } from "~/services/apis/guestUseService";
import { Filters } from "~/types";
import {
  GuestUseServiceType,
  GuestUseServicesPlusMinusPayload,
} from "~/types/guestUseServices.type";
import { GetUseServiceResponse, guestUseServiceActions } from ".";
import { appActions } from "../app";
import { serviceActions } from "../service";

function* addUseService({
  payload: { data, isProduct },
}: PayloadAction<{ data: GuestUseServiceType; isProduct: boolean }>) {
  try {
    const response: GuestUseServiceType[] = yield call(guestUseServiceAPI.post, data);
    yield put(guestUseServiceActions.addUseServiceSuccess(response));

    if (isProduct) {
      yield put(serviceActions.getDataStart({ page: 1, limit: 100, is_product: 1 }));
    }
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(guestUseServiceActions.addUseServiceFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddUseService() {
  yield takeLatest(guestUseServiceActions.addUseServiceStart.type, addUseService);
}

function* deleteUseService({
  payload: { guestUseServiceId, isProduct },
}: PayloadAction<{ guestUseServiceId: string; isProduct: boolean }>) {
  try {
    const response: GuestUseServiceType[] = yield call(
      guestUseServiceAPI.delete,
      guestUseServiceId
    );
    yield put(guestUseServiceActions.deleteUseServiceSuccess(response));

    if (isProduct) {
      yield put(serviceActions.getDataStart({ page: 1, limit: 100, is_product: 1 }));
    }
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(guestUseServiceActions.deleteUseServiceFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchDeleteUseService() {
  yield takeLatest(guestUseServiceActions.deleteUseServiceStart.type, deleteUseService);
}

function* plusMinusUseService({
  payload: { data, isProduct },
}: PayloadAction<{ data: GuestUseServicesPlusMinusPayload; isProduct: boolean }>) {
  try {
    const response: GuestUseServiceType[] = yield call(guestUseServiceAPI.plusMinus, data);
    yield put(guestUseServiceActions.plusMinusUseServiceSuccess(response));

    if (isProduct) {
      yield put(serviceActions.getDataStart({ page: 1, limit: 100, is_product: 1 }));
    }
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(guestUseServiceActions.plusMinusUseServiceFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchPlusMinusUseService() {
  yield takeLatest(guestUseServiceActions.plusMinusUseServiceStart.type, plusMinusUseService);
}

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: GetUseServiceResponse = yield call(guestUseServiceAPI.get, payload);
    yield put(guestUseServiceActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(guestUseServiceActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetData() {
  yield takeLatest(guestUseServiceActions.getDataStart.type, getData);
}

function* guestUseServiceSaga() {
  yield all([
    watchAddUseService(),
    watchDeleteUseService(),
    watchGetData(),
    watchPlusMinusUseService(),
  ]);
}

export default guestUseServiceSaga;
