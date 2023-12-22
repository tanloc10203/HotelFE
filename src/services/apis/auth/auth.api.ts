import axios from "~/services/axios";
import {
  ChangePasswordPayload,
  EndPointUser,
  ForgotPasswordPayload,
  LoginPayload,
  SuccessResponseProp,
  UserState,
} from "~/types";
import { sleep } from "~/utils";

export const authEndPoint = "/Auth";
export const authFunctionEndPoint = {
  Login: "/Login",
  Profile: "/Profile",
  RefreshToken: "/RefreshToken",
  Password: "/Password",
  Logout: "/Logout",
};

export const loginOwnerEndPoint = authEndPoint + authFunctionEndPoint.Login + EndPointUser.Owner;

export const loginEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Login + EndPointUser.Employee;

export const profileOwnerEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + EndPointUser.Owner;

export const profileEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + EndPointUser.Employee;

export const refreshTokenOwnerEndPoint =
  authEndPoint + authFunctionEndPoint.RefreshToken + EndPointUser.Owner;

export const refreshTokenEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.RefreshToken + EndPointUser.Employee;

export const changePasswordOwnerEndPoint =
  authEndPoint + authFunctionEndPoint.Password + "/Change" + EndPointUser.Owner;

export const changePasswordEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Password + "/Change" + EndPointUser.Employee;

export const changeProfileOwnerEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + "/Update" + EndPointUser.Owner;

export const changeProfileEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + "/Update" + EndPointUser.Employee;

export const uploadAvatarOwnerEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + "/Update/Photo" + EndPointUser.Owner;

export const uploadAvatarEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Profile + "/Update/Photo" + EndPointUser.Employee;

export const logoutEmployeeEndPoint =
  authEndPoint + authFunctionEndPoint.Logout + EndPointUser.Employee;

export const logoutOwnerEndPoint = authEndPoint + authFunctionEndPoint.Logout + EndPointUser.Owner;

export const forgotPasswordEmployee =
  authEndPoint + authFunctionEndPoint.Password + "/Forgot" + EndPointUser.Employee;

export const forgotPasswordOwner =
  authEndPoint + authFunctionEndPoint.Password + "/Forgot" + EndPointUser.Owner;

export const resetPasswordEmployee =
  authEndPoint + authFunctionEndPoint.Password + "/Reset" + EndPointUser.Employee;

export const resetPasswordOwner =
  authEndPoint + authFunctionEndPoint.Password + "/Reset" + EndPointUser.Owner;

const AuthAPI = {
  login: (url: string, { arg }: { arg: LoginPayload }): Promise<SuccessResponseProp<string>> => {
    return axios.post(url, arg);
  },
  getProfile: async (url: string): Promise<SuccessResponseProp<UserState>> => {
    await sleep(1000);
    return axios.get(url).then((res) => res as unknown as SuccessResponseProp<UserState>);
  },
  refreshTokenOwner: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response: SuccessResponseProp<{
      accessToken: string;
      refreshToken: string;
    }> = await axios.post(refreshTokenOwnerEndPoint);
    return response.metadata;
  },
  refreshTokenEmployee: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response: SuccessResponseProp<{
      accessToken: string;
      refreshToken: string;
    }> = await axios.post(refreshTokenEmployeeEndPoint);

    return response.metadata;
  },
  changePasswordOwner: (url: string, { arg }: { arg: ChangePasswordPayload }) => {
    return axios.patch(url, arg);
  },
  changeProfileOwner: (url: string, data: UserState) => {
    const { id, ...other } = data;
    return axios.patch(`${url}/${id}`, other);
  },
  forgotPassword: (url: string, data: ForgotPasswordPayload) => {
    return axios.post(url, data);
  },
  resetPassword: (url: string, data: Pick<ChangePasswordPayload, "password">) => {
    return axios.post(url, data);
  },
  uploadAvatar: (url: string, id: number, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    return axios.patch(`${url}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  logout: (url: string) => {
    return axios.post(url);
  },
};

export default AuthAPI;
