import { useAppSelector, type RootState } from "~/stores";
import { RoleStates } from "~/types";

const ownerSelector = (rootState: RootState) => rootState.auth.owner.user;
const employeeSelector = (rootState: RootState) => rootState.auth.employee.user;
const accessTokenOwnerSelector = (rootState: RootState) => rootState.auth.owner.accessToken;
const accessTokenEmployeeSelector = (rootState: RootState) => rootState.auth.employee.accessToken;
const roleSelector = (rootState: RootState) => rootState.auth.role;
const sessionSelector = (rootState: RootState) => rootState.auth.session;

export const useGetUser = (type: RoleStates) =>
  useAppSelector(type === "EMPLOYEE" ? employeeSelector : ownerSelector);
export const useGetAccessToken = (type: RoleStates) =>
  useAppSelector(type === "EMPLOYEE" ? accessTokenEmployeeSelector : accessTokenOwnerSelector);
export const useGetRole = () => useAppSelector(roleSelector);
export const useGetSession = () => useAppSelector(sessionSelector);
export const useUser = () => useGetUser(useGetRole()!);
