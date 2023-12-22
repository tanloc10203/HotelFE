import axios, { AxiosError } from "axios";
import { Headers, LocalStorage, env } from "~/constants";
import { authActions } from "~/features/auth";
import { dayNow, isAuthOwner, isUnauthorizedError } from "~/helpers";
import { getLocalStorage, setLocalStorage } from "~/helpers/localStorage";
import { store } from "~/stores";
import { ErrorResponse } from "~/types";
import { AuthAPI } from "../apis/auth";

export const ROOT_END_POINT = "/api/v1";

export const ROUTE_REFRESH_TOKEN = {
  employee: "/Auth/RefreshToken/Employee",
  owner: "/Auth/RefreshToken/Owner",
};

const instance = axios.create({
  baseURL: env.SERVER_URL + ROOT_END_POINT,
  withCredentials: true,
});

let errorCount = 1;

instance.interceptors.request.use(
  function (config) {
    const tokenEpl = getLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE);
    const tokenOwner = getLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER);

    const { role } = store.getState().auth;

    if (role === "EMPLOYEE" && tokenEpl) {
      config.headers[LocalStorage.ACCESS_TOKEN_EMPLOYEE] = tokenEpl;
    }

    if (role === "OWNER" && tokenOwner) {
      config.headers[LocalStorage.ACCESS_TOKEN_OWNER] = tokenOwner;
    }

    config.headers[LocalStorage.ROLES] = role;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let refreshingFunc: () => Promise<{
  accessToken: string;
  refreshToken: string;
}> | null;

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error: AxiosError<ErrorResponse>) {
    const originalConfig = error.config;
    const { role } = store.getState().auth;
    errorCount++;
    console.log("====================================");
    console.log(`role`, role + " path = " + originalConfig?.url);
    console.log("====================================");

    if (errorCount >= 3 || !role || !isUnauthorizedError(error)) {
      errorCount = 0;
      console.log("====================================");
      console.log(`role`, role + " path = " + originalConfig?.url + " errorCount = " + errorCount);
      console.log("====================================");
      return Promise.reject(error);
    }

    let owner = false;

    if (isAuthOwner(originalConfig)) {
      owner = true;
    }

    try {
      console.log("====================================");
      console.log(`expired path =>  ${dayNow()}`, originalConfig?.url);
      console.log("====================================");

      if (!refreshingFunc) {
        if (owner || role === "OWNER") {
          refreshingFunc = AuthAPI.refreshTokenOwner;
        } else {
          refreshingFunc = AuthAPI.refreshTokenEmployee;
        }
      }

      const response = await refreshingFunc()!;

      if (owner || role === "OWNER") {
        setLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER, response.accessToken);
        store.dispatch(authActions.setAccessToken({ type: "OWNER", token: response.accessToken }));
        originalConfig?.headers.set(LocalStorage.ACCESS_TOKEN_OWNER, response.accessToken);
        originalConfig?.headers.set(Headers.RefreshTokenOwner, response.refreshToken);
      } else {
        setLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE, response.accessToken);
        store.dispatch(
          authActions.setAccessToken({ type: "EMPLOYEE", token: response.accessToken })
        );
        originalConfig?.headers.set(LocalStorage.ACCESS_TOKEN_EMPLOYEE, response.accessToken);
        originalConfig?.headers.set(Headers.RefreshTokenEmployee, response.refreshToken);
      }

      try {
        return await instance.request(originalConfig!);
      } catch (innerError) {
        console.log("====================================");
        console.log(`error innerError path ${originalConfig?.url} => ${dayNow()}`, innerError);
        console.log("====================================");
        if (isUnauthorizedError(innerError)) throw innerError;
      }
    } catch (error) {
      console.log("====================================");
      console.log(`error instance path ${originalConfig?.url} => ${dayNow()}`, error);
      console.log("====================================");

      if (role === "EMPLOYEE") {
        store.dispatch(authActions.setResetState("EMPLOYEE"));
      } else {
        store.dispatch(authActions.setResetState("OWNER"));
      }

      throw error;
    } finally {
      refreshingFunc = null!;
      errorCount = 0;
    }
  }
);

export default instance;
