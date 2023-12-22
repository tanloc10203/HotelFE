import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { messageErrorAxios } from "~/helpers";
import {
  Filters,
  GroupEquipment,
  GroupEquipmentArray,
  IEquipmentResponse,
  Pagination,
  ResetFormType,
  SuccessResponseProp,
} from "~/types";
import { equipmentActions } from "./equipmentSlice";
import { appActions } from "../app";
import { equipmentAPI } from "~/services/apis/equipment";

type ResponseData = SuccessResponseProp<IEquipmentResponse[], Pagination>;

function* getData({ payload }: PayloadAction<Filters>) {
  try {
    const response: ResponseData = yield call(equipmentAPI.get, payload);
    yield put(equipmentActions.getDataSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(equipmentActions.getDataFailed(message));
  }
}

function* watchGetData() {
  yield takeLatest(equipmentActions.getDataStart.type, getData);
}

function* getDataGroups() {
  try {
    const response: GroupEquipmentArray = yield call(equipmentAPI.getGroups);
    yield put(equipmentActions.getDataGroupsSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(equipmentActions.getDataGroupsFailed(message));
  }
}

function* watchGetDataGroups() {
  yield takeLatest(equipmentActions.getDataGroupsStart.type, getDataGroups);
}

function* getDataGroupsFilter({ payload }: PayloadAction<GroupEquipment>) {
  try {
    const response: IEquipmentResponse[] = yield call(equipmentAPI.getFilterByGroup, payload);
    yield put(equipmentActions.getDataGroupsFilterSuccess(response));
  } catch (error: any) {
    let message = messageErrorAxios(error);
    yield put(equipmentActions.getDataGroupsFailed(message));
  }
}

function* watchGetDataGroupsFilter() {
  yield takeLatest(equipmentActions.getDataGroupsFilterStart.type, getDataGroupsFilter);
}

function* addData({
  payload: { resetForm, ...others },
}: PayloadAction<IEquipmentResponse & ResetFormType>) {
  try {
    yield delay(300);
    yield call(equipmentAPI.post, others);
    yield put(equipmentActions.addDataSuccess());
    yield call(resetForm);
    yield put(equipmentActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchAddData() {
  yield takeLatest(equipmentActions.addDataStart.type, addData);
}

function* editData({
  payload: { resetForm, ...others },
}: PayloadAction<IEquipmentResponse & ResetFormType>) {
  try {
    yield delay(300);
    yield call(equipmentAPI.patch, others.id!, others);
    yield put(equipmentActions.addDataSuccess());
    yield call(resetForm);
    yield put(equipmentActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentActions.addDataFailed(message));
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchEditData() {
  yield takeLatest(equipmentActions.editDataStart.type, editData);
}

function* deleteData({ payload }: PayloadAction<IEquipmentResponse>) {
  try {
    yield delay(300);
    yield call(equipmentAPI.delete, payload.id!);
    yield put(equipmentActions.addDataSuccess());
    yield put(equipmentActions.getDataStart({ limit: 5, page: 1 }));
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
    yield put(equipmentActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteData() {
  yield takeLatest(equipmentActions.deleteDataStart.type, deleteData);
}

function* restoreData({ payload }: PayloadAction<IEquipmentResponse>) {
  try {
    yield delay(300);
    yield call(equipmentAPI.restore, payload.id!);
    yield put(equipmentActions.addDataSuccess());
    yield put(equipmentActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
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
    yield put(equipmentActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchRestore() {
  yield takeLatest(equipmentActions.restoreDataStart.type, restoreData);
}

function* deleteInTrash({ payload }: PayloadAction<IEquipmentResponse>) {
  try {
    yield delay(300);
    yield call(equipmentAPI.deleteInTrash, payload.id!);
    yield put(equipmentActions.addDataSuccess());
    yield put(equipmentActions.getDataStart({ limit: 5, page: 1, delete_not_null: true }));
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
    yield put(equipmentActions.deleteDataFailed());
    yield put(
      appActions.setSnackbar({ open: true, severity: "error", text: message, duration: 3000 })
    );
  }
}

function* watchDeleteInTrash() {
  yield takeLatest(equipmentActions.deleteInTrashStart.type, deleteInTrash);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(equipmentActions.setFilter(payload));
}

function* watchDebounceSearch() {
  yield debounce(500, equipmentActions.setDebounceSearch.type, searchDebounce);
}

function* equipmentSaga() {
  yield all([
    watchGetData(),
    watchAddData(),
    watchEditData(),
    watchDeleteData(),
    watchDebounceSearch(),
    watchGetDataGroups(),
    watchGetDataGroupsFilter(),
    watchRestore(),
    watchDeleteInTrash(),
  ]);
}

export default equipmentSaga;
