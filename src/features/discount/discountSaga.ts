import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { discountAPI } from "~/services/apis/discount";
import { DiscountPayload, Filters, IDiscount, Pagination, SuccessResponseProp } from "~/types";
import { discountActions } from ".";
import { appActions } from "../app";
import { roomActions } from "../room";

type ResponseData = SuccessResponseProp<IDiscount[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(discountAPI.get, payload);
    yield put(discountActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(discountActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(discountActions.getDataStart.type, getData);
}

function* addData({ payload }: PayloadAction<DiscountPayload>) {
  try {
    yield delay(300);
    yield call(discountAPI.post, {
      ...payload,
      num_discount: +payload.num_discount,
      percent_discount: payload.percent_discount ? +payload.percent_discount : 0,
      price_discount: payload.price_discount ? +payload.price_discount : 0,
    });
    yield put(discountActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(discountActions.setToggleDiscount(null));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm khuyến mãi thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(discountActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(discountActions.addDataStart.type, addData);
}

function* editData({ payload }: PayloadAction<DiscountPayload>) {
  try {
    yield delay(300);
    yield call(discountAPI.patch, payload.id!, {
      ...payload,
      num_discount: +payload.num_discount,
      percent_discount: payload.percent_discount ? +payload.percent_discount : 0,
      price_discount: payload.price_discount ? +payload.price_discount : 0,
    });
    yield put(discountActions.addDataSuccess());
    yield put(roomActions.getDataStart({ limit: 5, page: 1 }));
    yield put(discountActions.setToggleDiscount(null));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật khuyến mãi thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(discountActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(discountActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IDiscount>) {
  try {
    yield delay(300);
    yield call(discountAPI.delete, payload.id!);
    yield put(discountActions.addDataSuccess());
    yield put(discountActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Xóa \`${payload.id}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(discountActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(discountActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(discountActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, discountActions.setDebounceSearch.type, searchDebounce);
}

function* discountSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default discountSaga;
