import { LocalStorage } from "~/constants";
import { RoleStates } from "~/types";

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string, event = false) => {
  localStorage.setItem(key, value);
  if (typeof window === "undefined" || !event) return;
  window.dispatchEvent(new Event("storage"));
};

export const removeLocalStorage = (key: string, event = false) => {
  localStorage.removeItem(key);
  if (typeof window === "undefined" || !event) return;
  window.dispatchEvent(new Event("storage"));
};

export const removeAllLocalStorage = (event = false) => {
  localStorage.clear();
  if (typeof window === "undefined" || !event) return;
  window.dispatchEvent(new Event("storage"));
};

export const removeLocalByRole = (role: RoleStates) => {
  if (role === "EMPLOYEE") {
    removeLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE);
  } else {
    removeLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER);
  }
  removeLocalStorage(LocalStorage.ACCEPTS_SESSION);
  removeLocalStorage(LocalStorage.LAST_SESSION);
};
