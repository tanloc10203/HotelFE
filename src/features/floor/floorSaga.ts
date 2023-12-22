import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import { floorAPI } from "~/services/apis/floor";
import { Filters, IFloor, Pagination, ResetFormType, SuccessResponseProp } from "~/types";
import { floorActions } from ".";
import { appActions } from "../app";
import { toast } from "react-toastify";
import { roomActions } from "../room";

type ResponseData = SuccessResponseProp<IFloor[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(floorAPI.get, payload);
    yield put(floorActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(floorActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(floorActions.getDataStart.type, getData);
}

function* addData({ payload: { resetForm, ...others } }: PayloadAction<IFloor & ResetFormType>) {
  try {
    yield delay(300);
    yield call(floorAPI.post, others);
    yield put(floorActions.addDataSuccess());
    toast.success("Thêm mới thành công");
    yield call(resetForm);
    yield put(floorActions.getDataStart({ limit: 9999, page: 1 }));
    yield put(roomActions.setToggleDialogAddFloor(false));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(floorActions.addDataFailed(message));
    toast.error(message);
  } finally {
    yield put(appActions.closeOverplay());
  }
}

function* watchAddData() {
  yield takeLatest(floorActions.addDataStart.type, addData);
}

function* editData({ payload: { resetForm, ...others } }: PayloadAction<IFloor & ResetFormType>) {
  try {
    yield delay(300);
    yield call(floorAPI.patch, others.id!, others);
    yield put(floorActions.addDataSuccess());
    yield call(resetForm);
    yield put(floorActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(floorActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(floorActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IFloor>) {
  try {
    yield delay(300);
    yield call(floorAPI.delete, payload.id!);
    yield put(floorActions.addDataSuccess());
    yield put(floorActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(floorActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(floorActions.deleteDataStart.type, deleteData);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(floorActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, floorActions.setDebounceSearch.type, searchDebounce);
}

function* floorSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
  ]);
}

export default floorSaga;
