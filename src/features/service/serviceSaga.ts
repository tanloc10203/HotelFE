import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import {
  Filters,
  IService,
  IServicePayload,
  Pagination,
  ProductPayload,
  ResetFormType,
  SuccessResponseProp,
} from "~/types";
import { serviceActions } from ".";
import { appActions } from "../app";
import { serviceAPI } from "~/services/apis/service";

type ResponseData = SuccessResponseProp<IService[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(300);
    const response: ResponseData = yield call(serviceAPI.get, payload);
    yield put(serviceActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetData() {
  yield takeLatest(serviceActions.getDataStart.type, getData);
}

function* getDataSearching({ payload }: PayloadAction<string>) {
  try {
    // yield delay(300);
    const response: ResponseData = yield call(serviceAPI.get, {
      is_product: 1,
      name_like: payload,
      page: 1,
      limit: 9999,
    });
    yield put(serviceActions.searchingDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.getDataFailed(message));
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchGetDataSearching() {
  yield takeLatest(serviceActions.searchingDataStart.type, getDataSearching);
}

function* addData({
  payload: { resetForm, ...others },
}: PayloadAction<IServicePayload & ResetFormType>) {
  try {
    yield delay(300);
    yield call(serviceAPI.postFormData, others);
    yield put(serviceActions.addDataSuccess());
    yield call(resetForm);
    yield put(serviceActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm mới thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(serviceActions.addDataStart.type, addData);
}

function* addDataProduct({
  payload: { resetForm, ...others },
}: PayloadAction<ProductPayload & ResetFormType>) {
  try {
    yield delay(300);
    const response: number = yield call(serviceAPI.postFormDataProduct, others);

    if (response) {
      yield put(serviceActions.addDataProductSuccess());
      yield call(resetForm);
      yield put(serviceActions.getDataStart({ limit: 5, page: 1 }));
      yield put(
        appActions.setSnackbar({
          open: true,
          severity: "success",
          text: "Thêm mới hàng hóa thành công",
          duration: 3000,
        })
      );
    }
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.addDataProductFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddDataProduct() {
  yield takeLatest(serviceActions.addDataProductStart.type, addDataProduct);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IServicePayload & ResetFormType>) {
  try {
    yield delay(300);
    yield call(serviceAPI.patchFormData, others.id!, others);
    yield put(serviceActions.addDataSuccess());
    yield call(resetForm);
    yield put(serviceActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditData() {
  yield takeLatest(serviceActions.editDataStart.type, editData);
}

function* editDataProduct({
  payload: { resetForm, ...others },
}: PayloadAction<ProductPayload & ResetFormType>) {
  try {
    yield delay(300);
    yield call(serviceAPI.patchFormDataProduct, others.id!, others);
    yield put(serviceActions.addDataProductSuccess());
    yield call(resetForm);
    yield put(serviceActions.getDataStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật thành công",
        duration: 3000,
      })
    );
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(serviceActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchEditDataProduct() {
  yield takeLatest(serviceActions.editProductStart.type, editDataProduct);
}

function* deleteData({ payload }: PayloadAction<IService>) {
  try {
    yield delay(300);
    yield call(serviceAPI.delete, payload.id!);
    yield put(serviceActions.addDataSuccess());
    yield put(serviceActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(serviceActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(serviceActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(serviceActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, serviceActions.setDebounceSearch.type, searchDebounce);
}

function* searchingProductDebounce({ payload }: PayloadAction<string>) {
  yield put(serviceActions.searchingDataStart(payload));
}

function* watchDebounceSearchingProduct() {
  yield debounce(500, serviceActions.setDebounceSearchingProduct.type, searchingProductDebounce);
}

function* serviceSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchAddDataProduct(),
    watchEditDataProduct(),
    watchGetDataSearching(),
    watchDebounceSearchingProduct(),
  ]);
}

export default serviceSaga;
