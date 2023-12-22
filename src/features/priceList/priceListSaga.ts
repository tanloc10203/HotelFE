import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { priceListAPI } from "~/services/apis/priceList";
import { Filters, Pagination, SuccessResponseProp } from "~/types";
import { PriceListState } from "~/types/priceList.model";
import { appActions } from "../app";
import { priceListActions } from "./priceListSlice";

type ResponseData = SuccessResponseProp<PriceListState[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(priceListAPI.get, payload);
    yield put(priceListActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(priceListActions.getDataStart.type, getData);
}

function* getDataDiscount({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(priceListAPI.get, payload);
    yield put(priceListActions.getDataDiscountSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.getDataFailed(message));
  }
}

function* watchGetDataDiscount() {
  yield takeLatest(priceListActions.getDataDiscountStart.type, getDataDiscount);
}

function* addData({
  payload: { resetForm, data },
}: PayloadAction<{ data: PriceListState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(priceListAPI.post, data);
    yield put(priceListActions.addDataSuccess());
    yield call(resetForm);
    yield put(priceListActions.getDataStart({ limit: 5, page: 1, type: "room" }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới bảng giá phòng thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(priceListActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, data },
}: PayloadAction<{ data: PriceListState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(priceListAPI.patch, data.id!, data);
    yield put(priceListActions.addDataSuccess());
    yield call(resetForm);
    yield put(priceListActions.getDataStart({ limit: 5, page: 1, type: "room" }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật bảng giá phòng thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(priceListActions.editDataStart.type, editData);
}

function* addDataDiscount({
  payload: { resetForm, data },
}: PayloadAction<{ data: PriceListState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(priceListAPI.postDiscount, data);
    yield put(priceListActions.addDataDiscountSuccess());
    yield call(resetForm);
    yield put(priceListActions.getDataDiscountStart({ limit: 5, page: 1, type: "discount" }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới bảng giá khuyến mãi thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddDataDiscount() {
  yield takeLatest(priceListActions.addDataDiscountStart.type, addDataDiscount);
}

function* editDataDiscount({
  payload: { resetForm, data },
}: PayloadAction<{ data: PriceListState; resetForm: () => void }>) {
  try {
    yield delay(300);
    yield call(priceListAPI.patchDiscount, data.id!, data);
    yield put(priceListActions.addDataDiscountSuccess());
    yield call(resetForm);
    yield put(priceListActions.getDataDiscountStart({ limit: 5, page: 1, type: "discount" }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật bảng giá khuyến mãi thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditDataDiscount() {
  yield takeLatest(priceListActions.editDataDiscountStart.type, editDataDiscount);
}

function* deleteData({ payload }: PayloadAction<PriceListState>) {
  try {
    yield delay(300);
    yield call(priceListAPI.delete, payload.id!);
    yield put(priceListActions.addDataSuccess());
    yield put(priceListActions.getDataStart({ limit: 5, page: 1, type: "room" }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Xóa \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(priceListActions.deleteDataStart.type, deleteData);
}

function* restoreData({ payload }: PayloadAction<PriceListState>) {
  try {
    yield delay(300);
    yield call(priceListAPI.restore, payload.id!);
    yield put(priceListActions.addDataSuccess());
    yield put(
      priceListActions.getDataStart({ limit: 5, page: 1, delete_not_null: true, type: "room" })
    );
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Khôi phục dữ liệu  \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchRestore() {
  yield takeLatest(priceListActions.restoreDataStart.type, restoreData);
}

function* deleteInTrash({ payload }: PayloadAction<PriceListState>) {
  try {
    yield delay(300);
    yield call(priceListAPI.deleteInTrash, payload.id!);
    yield put(priceListActions.addDataSuccess());
    yield put(
      priceListActions.getDataStart({ limit: 5, page: 1, delete_not_null: true, type: "room" })
    );
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: `Đã xóa vĩnh viễn dữ liệu  \`${payload.name}\` thành công`,
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(priceListActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteInTrash() {
  yield takeLatest(priceListActions.deleteInTrashStart.type, deleteInTrash);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(priceListActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, priceListActions.setDebounceSearch.type, searchDebounce);
}

function* priceListSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchRestore(),
    watchDeleteInTrash(),
    watchEditDataDiscount(),
    watchAddDataDiscount(),
    watchGetDataDiscount(),
  ]);
}

export default priceListSaga;
