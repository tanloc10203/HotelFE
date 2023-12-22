import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { Filters, IEquipmentType, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { equipmentTypeActions } from "./equipmentTypeSlice";
import { appActions } from "../app";
import { equipmentTypeAPI } from "~/services/apis/equipmentType";

type ResponseData = SuccessResponseProp<IEquipmentType[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(equipmentTypeAPI.get, payload);
    yield put(equipmentTypeActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(equipmentTypeActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(equipmentTypeActions.getDataStart.type, getData);
}

function* addData({
  payload: { resetForm, ...others },
}: PayloadAction<IEquipmentType & ResetFormType>) {
  try {
    yield delay(300);
    yield call(equipmentTypeAPI.post, others);
    yield put(equipmentTypeActions.addDataSuccess());
    yield call(resetForm);
    yield put(equipmentTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(equipmentTypeActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IEquipmentType & ResetFormType>) {
  try {
    yield delay(300);
    yield call(equipmentTypeAPI.patch, others.id!, others);
    yield put(equipmentTypeActions.addDataSuccess());
    yield call(resetForm);
    yield put(equipmentTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentTypeActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(equipmentTypeActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IEquipmentType>) {
  try {
    yield delay(300);
    yield call(equipmentTypeAPI.delete, payload.id!);
    yield put(equipmentTypeActions.addDataSuccess());
    yield put(equipmentTypeActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentTypeActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(equipmentTypeActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(equipmentTypeActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, equipmentTypeActions.setDebounceSearch.type, searchDebounce);
}

function* equipmentTypeSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default equipmentTypeSaga;
