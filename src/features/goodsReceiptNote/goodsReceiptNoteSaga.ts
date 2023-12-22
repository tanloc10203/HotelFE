import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { supplierAPI } from "~/services/apis/supplier";
import { Filters, ResetFormType, SupplierType } from "~/types";
import { appActions } from "../app";
import { GetGoodsReceiptNoteResponse, GetSupplierResponse, goodsReceiptNoteActions } from ".";
import { GoodsReceiptNotePayloadAdd } from "~/types/goodsReceiptNote";
import { goodsReceiptNoteAPI } from "~/services/apis/goodsReceiptNote";
import { serviceActions } from "../service";

function* addSupplier({
  payload: { resetForm, data },
}: PayloadAction<{ data: SupplierType } & ResetFormType>) {
  try {
    yield delay(300);
    yield call(supplierAPI.post, data);
    yield put(goodsReceiptNoteActions.getDataSupplierStart({ page: 1, limit: 100 }));
    yield put(goodsReceiptNoteActions.addSupplierSuccess());
    yield call(resetForm);
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm nhà cung cấp thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(goodsReceiptNoteActions.addSupplierFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddSupplier() {
  yield takeLatest(goodsReceiptNoteActions.addSupplierStart.type, addSupplier);
}

function* addGoodsReceiptNote({ payload }: PayloadAction<GoodsReceiptNotePayloadAdd>) {
  try {
    yield delay(300);
    yield call(goodsReceiptNoteAPI.post, payload);
    yield put(goodsReceiptNoteActions.getGoodsReceiptNoteStart({ order: "created_at" }));
    yield put(goodsReceiptNoteActions.addGoodsReceiptNoteSuccess());
    yield put(serviceActions.setImportProductDataEmpty());
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Nhập hàng hóa thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(goodsReceiptNoteActions.addGoodsReceiptNoteFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddGoodsReceiptNote() {
  yield takeLatest(goodsReceiptNoteActions.addGoodsReceiptNoteStart.type, addGoodsReceiptNote);
}

function* getSupplier({ payload }: PayloadAction<Filters>) {
  try {
    const response: GetSupplierResponse = yield call(supplierAPI.get, payload);
    yield put(goodsReceiptNoteActions.getDataSupplierSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(goodsReceiptNoteActions.getDataSupplierFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetSupplier() {
  yield takeLatest(goodsReceiptNoteActions.getDataSupplierStart.type, getSupplier);
}

function* getGoodsReceiptNote({ payload }: PayloadAction<Filters>) {
  try {
    const response: GetGoodsReceiptNoteResponse = yield call(goodsReceiptNoteAPI.get, payload);
    yield put(goodsReceiptNoteActions.getGoodsReceiptNoteSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(goodsReceiptNoteActions.getGoodsReceiptNoteFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetGoodsReceiptNote() {
  yield takeLatest(goodsReceiptNoteActions.getGoodsReceiptNoteStart.type, getGoodsReceiptNote);
}

function* goodsReceiptNoteSaga() {
  yield all([
    watchAddSupplier(),
    watchGetSupplier(),
    watchAddGoodsReceiptNote(),
    watchGetGoodsReceiptNote(),
  ]);
}

export default goodsReceiptNoteSaga;
