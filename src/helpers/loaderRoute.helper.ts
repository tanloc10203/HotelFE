import { redirect } from "react-router-dom";
import { ACCESS_DENIED } from "~/constants";
import { store } from "~/stores";
import { DashboardPaths, SinglePaths } from "~/types";

export const authLoaderIsOwner = () => {
  const {
    role,
    owner: { accessToken: tokenOwner },
  } = store.getState().auth;

  if (!role || !tokenOwner) return redirect(SinglePaths.LoginEmployee);

  if (role === "EMPLOYEE") {
    return redirect(`${DashboardPaths.Forbidden}/${ACCESS_DENIED}`);
  }

  return null;
};
