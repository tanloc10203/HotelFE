import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { reportAPI } from "~/services/apis/report";
import {
  QuantityBookingState,
  RateBookingState,
  RoomTypeMoneyState,
  ServiceMoneyResponse,
} from "~/types";
import { reportActions } from ".";
import { appActions } from "../app";

function* getBoxReport({ payload }: PayloadAction<string>) {
  try {
    const [quantityBooking, rateBooking]: [QuantityBookingState, RateBookingState] = yield all([
      call(reportAPI.QuantityBooking, payload),
      call(reportAPI.RateBooking, payload),
    ]);

    yield put(
      reportActions.getBoxReportSuccess({ ...quantityBooking, rateBooking: rateBooking.rate })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(reportActions.getBoxReportFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetBoxReport() {
  yield takeLatest(reportActions.getBoxReportStart.type, getBoxReport);
}

function* getRoomTypeDetailsChart({ payload }: PayloadAction<string>) {
  try {
    const response: RoomTypeMoneyState = yield call(reportAPI.RoomTypeMoney, payload);
    yield put(reportActions.getRoomTypeDetailsChartSuccess(response.details));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(reportActions.getBoxReportFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetRoomTypeDetailsChart() {
  yield takeLatest(reportActions.getRoomTypeDetailsChartStart.type, getRoomTypeDetailsChart);
}

function* getServiceMoney({ payload }: PayloadAction<{ dateStart: string; dateEnd: string }>) {
  try {
    const response: ServiceMoneyResponse = yield call(
      reportAPI.ServiceMoney,
      payload.dateStart,
      payload.dateEnd
    );
    yield put(reportActions.getServiceMoneySuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(reportActions.getBoxReportFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetServiceMoney() {
  yield takeLatest(reportActions.getServiceMoneyStart.type, getServiceMoney);
}

function* reportSaga() {
  yield all([watchGetBoxReport(), watchGetRoomTypeDetailsChart(), watchGetServiceMoney()]);
}

export default reportSaga;
