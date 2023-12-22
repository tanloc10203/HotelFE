import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { informationHotelsAPI } from "~/services/apis/informationHotel";
import { Filters, InformationHotelState, Pagination, SuccessResponseProp } from "~/types";
import { informationHotelActions } from ".";
import { appActions } from "../app";

type ResponseData = SuccessResponseProp<InformationHotelState[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(informationHotelsAPI.get, payload);
    yield put(informationHotelActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(informationHotelActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetData() {
  yield takeLatest(informationHotelActions.getDataStart.type, getData);
}

function* addData({
  payload,
}: PayloadAction<{ data: InformationHotelState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(informationHotelsAPI.post, payload.data);
    yield put(informationHotelActions.addDataSuccess());
    yield call(payload.resetForm);
    yield put(
      appActions.setSnackbar({
        text: "Thêm thông tin khách sạn thành công",
        open: true,
        severity: "success",
      })
    );
    yield put(informationHotelActions.getDataStart());
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(informationHotelActions.addDataFailed(message));
    yield put(appActions.setSnackbar({ text: message, open: true, severity: "error" }));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(informationHotelActions.addDataStart.type, addData);
}

function* editData({
  payload,
}: PayloadAction<{ data: InformationHotelState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(informationHotelsAPI.patch, payload.data.id!, payload.data);
    yield put(informationHotelActions.addDataSuccess());
    yield call(payload.resetForm);
    yield put(informationHotelActions.getDataStart());
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thông tin thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(informationHotelActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(informationHotelActions.editDataStart.type, editData);
}

function* informationHotelSaga() {
  yield all([watchGetData(), watchAddData(), watchEditData()]);
}

export default informationHotelSaga;
