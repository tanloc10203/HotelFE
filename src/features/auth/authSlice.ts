import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { LocalStorage } from "~/constants";
import { getLocalStorage, removeLocalByRole } from "~/helpers/localStorage";
import { RoleStates, UserState } from "~/types";

interface AuthState {
  user: UserState | null;
  accessToken: string;
}

interface InitialState {
  owner: AuthState;
  employee: AuthState;
  session: string;
  role: RoleStates | null;
}

const initialState: InitialState = {
  owner: {
    user: null,
    accessToken: getLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER) || "",
  },
  employee: {
    user: null,
    accessToken: getLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE) || "",
  },
  role: null,
  session: "",
};

type SetUser = {
  type: RoleStates;
  user: UserState | null;
};

type SetAccessToken = {
  type: RoleStates;
  token: string;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload: { type, user } }: PayloadAction<SetUser>) => {
      if (type === "EMPLOYEE") {
        state.employee.user = user;
      } else {
        state.owner.user = user;
      }
    },
    setAccessToken: (state, { payload: { type, token } }: PayloadAction<SetAccessToken>) => {
      if (type === "EMPLOYEE") {
        state.employee.accessToken = token;
      } else {
        state.owner.accessToken = token;
      }
    },
    setRole: (state, { payload }: PayloadAction<RoleStates | null>) => {
      state.role = payload;
    },
    setSession: (state, { payload }: PayloadAction<string>) => {
      state.session = payload;
    },
    setResetState: (state, { payload }: PayloadAction<RoleStates>) => {
      removeLocalByRole(payload);
      if (payload === "EMPLOYEE") {
        state.employee = {
          accessToken: "",
          user: null,
        };
      } else {
        state.owner = {
          accessToken: "",
          user: null,
        };
      }
      state.role = null;
      state.session = "";
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
